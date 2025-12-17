import { useEffect, useMemo, useRef, useState } from "react";
import type { CreateAssistantDTOInput, Language } from "@newcast/nexagent-sdk-web/api";

import { SYSTEM_PROMPT_STORAGE_KEY } from "./SetupPanel";
import voiceCatalog from "../voice_catalog.json";

const DEFAULT_NEXAGENT_BASE_URL = "https://nexagent.api.next.newcast.ai";

const STT_PROVIDERS = [
  { value: "soniox", label: "Soniox" },
  { value: "deepgram", label: "Deepgram" },
  { value: "cartesia", label: "Cartesia" },
] as const;

const TTS_LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "ja", label: "Japanese" },
] as const;
const TTS_GENDER_OPTIONS = [
  { value: "all", label: "Any" },
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
];

type VoiceOption = { value: string; label: string; language?: string; gender?: string; provider: string };
type SttProvider = (typeof STT_PROVIDERS)[number]["value"];
type TtsLanguage = (typeof TTS_LANGUAGE_OPTIONS)[number]["value"];

const parsedCatalog = (voiceCatalog as Array<{
  voice_provider: string;
  voice_id: string;
  name?: string | null;
  language?: string | null;
  gender?: string | null;
}>).reduce<Record<string, VoiceOption[]>>((acc, voice) => {
  const providerKey = (voice.voice_provider || "").toLowerCase();
  if (!acc[providerKey]) acc[providerKey] = [];
  acc[providerKey].push({
    provider: providerKey,
    value: voice.voice_id,
    label: voice.name || voice.voice_id,
    language: voice.language || undefined,
    gender: voice.gender || undefined,
  });
  return acc;
}, {});

const resolvedBaseUrl = (process.env.NEXT_PUBLIC_NEXAGENT_BASE_URL?.trim() || DEFAULT_NEXAGENT_BASE_URL).replace(
  /\/+$/,
  ""
);
const resolvedAssistantId = process.env.NEXT_PUBLIC_NEXAGENT_ASSISTANT_ID?.trim() || "";
const resolvedAuthKey =
  process.env.NEXT_PUBLIC_NEXAGENT_PRIVATE_KEY?.trim() ||
  "";

const LoadingSpinner = () => <span className="spinner" aria-hidden />;

export function PhoneSetupPanel() {
  const [sttProvider, setSttProvider] = useState<SttProvider>(
    (STT_PROVIDERS.find((p) => p.value === "soniox")?.value ??
      STT_PROVIDERS[0].value) as SttProvider
  );
  const ttsProviders = Object.keys(parsedCatalog).length
    ? Object.keys(parsedCatalog).map((key) => ({
        value: key,
        label: key.charAt(0).toUpperCase() + key.slice(1),
      }))
    : [
        { value: "cartesia", label: "Cartesia" },
        { value: "azure", label: "Azure Speech" },
        { value: "minimax", label: "MiniMax" },
      ];

  const [ttsProvider, setTtsProvider] = useState<string>(
    ttsProviders.find((p) => p.value === "cartesia")?.value ?? ttsProviders[0]?.value ?? ""
  );
  const [ttsLanguage, setTtsLanguage] = useState<TtsLanguage>(TTS_LANGUAGE_OPTIONS[0].value);
  const [ttsGender, setTtsGender] = useState<string>("all");
  const [voiceSelection, setVoiceSelection] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [showSystemPrompt, setShowSystemPrompt] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [showTtsConfig, setShowTtsConfig] = useState(true);

  const [updateStatus, setUpdateStatus] = useState<"idle" | "updating" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(SYSTEM_PROMPT_STORAGE_KEY);
    if (saved && saved.trim()) {
      setSystemPrompt(saved);
      setShowSystemPrompt(true);
    }
  }, []);

  const voicesByProvider = useMemo(() => parsedCatalog, []);
  const voicesForProvider = useMemo(() => voicesByProvider[ttsProvider] ?? [], [ttsProvider, voicesByProvider]);
  const filteredVoices = useMemo(() => {
    const lang = ttsLanguage.toLowerCase();
    const gender = ttsGender.toLowerCase();
    return voicesForProvider.filter((v) => {
      const voiceLang = (v.language || "").toLowerCase();
      const languageMatch = voiceLang === lang || voiceLang.startsWith(`${lang}-`);
      const genderValue = (v.gender || "").toLowerCase();
      const genderMatch = gender === "all" || genderValue === gender;
      return languageMatch && genderMatch;
    });
  }, [ttsLanguage, ttsGender, voicesForProvider]);

  useEffect(() => {
    setVoiceSelection(filteredVoices[0]?.value ?? "");
  }, [ttsProvider, filteredVoices]);

  const selectedVoice = useMemo(
    () => voicesForProvider.find((v) => v.value === voiceSelection),
    [voiceSelection, voicesForProvider],
  );

  const previewUrl = selectedVoice
    ? `https://aigcc-perm-data.s3.us-east-1.amazonaws.com/nexagent/voice_library/${selectedVoice.provider}/${selectedVoice.value}.mp3`
    : undefined;

  const handlePlayPreview = () => {
    if (!previewUrl) return;
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio
      .play()
      .then(() => {
        setIsPlaying(true);
        startProgressLoop();
      })
      .catch(() => {
        /* ignore play errors (e.g., autoplay restrictions) */
      });
  };

  const startProgressLoop = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    const tick = () => {
      const audio = audioRef.current;
      const bar = progressRef.current;
      if (!audio || !bar || !audio.duration || audio.paused || audio.ended) {
        rafRef.current = null;
        return;
      }
    const progress = Math.min(audio.currentTime / audio.duration, 1);
    bar.style.transform = `scaleX(${progress})`;
    rafRef.current = requestAnimationFrame(tick);
  };
  rafRef.current = requestAnimationFrame(tick);
};

const resetProgress = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    const bar = progressRef.current;
    if (bar) {
      bar.style.transform = "scaleX(0)";
    }
    setIsPlaying(false);
  };

  useEffect(() => () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
  }, []);

  const buildAssistantConfig = (): CreateAssistantDTOInput => {
    const voice = (() => {
      if (ttsProvider === "cartesia") {
        return {
          provider: "cartesia" as const,
          voiceId: voiceSelection,
          language: ttsLanguage,
        };
      }
      if (ttsProvider === "azure") {
        return {
          provider: "azure" as const,
          voiceId: voiceSelection,
        };
      }
      return {
        provider: "minimax" as const,
        voiceId: voiceSelection,
      };
    })();

    const transcriber: CreateAssistantDTOInput["transcriber"] = (() => {
      if (sttProvider === "deepgram") {
        return {
          provider: "deepgram" as const,
          model: "nova-2",
          language: ttsLanguage,
        };
      }
      if (sttProvider === "cartesia") {
        return {
          provider: "cartesia" as const,
          model: "ink-whisper",
          language: ttsLanguage,
        };
      }
      return {
        provider: "soniox" as const,
        model: "ink-whisper",
        language: [ttsLanguage as Language],
      };
    })();

    return {
      name: "Phone Call Assistant",
      firstMessage: "Hi there! I'm your NexAgent phone assistant. How can I help?",
      metadata: {
        source: "demo-phone",
        sttProvider,
        ttsProvider,
      },
      transcriber,
      model: {
        provider: "openai",
        model: "gpt-4o",
        ...(systemPrompt.trim()
          ? {
              messages: [
                {
                  role: "system" as const,
                  content: systemPrompt.trim(),
                },
              ],
            }
          : {}),
      },
      voice,
    };
  };

  const renderSelectRow = (
    {
      id,
      label,
      value,
      onChange,
      options,
      disabled: rowDisabled = false,
    }: {
      id: string;
      label: string;
      value: string;
      onChange: (value: string) => void;
      options: ReadonlyArray<{ value: string; label: string }>;
      disabled?: boolean;
    },
  ) => (
    <div className="card-section card-section--compact">
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <div className="device-row device-row--tight device-row--meter">
        <select
          id={id}
          className="select select--compact select--meter"
          value={value}
          onChange={(event) => onChange(event.currentTarget.value)}
          disabled={rowDisabled}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const handleUpdate = async () => {
    if (!resolvedAssistantId) {
      setUpdateStatus("error");
      setStatusMessage("NEXT_PUBLIC_NEXAGENT_ASSISTANT_ID is not configured.");
      return;
    }
    if (!resolvedAuthKey) {
      setUpdateStatus("error");
      setStatusMessage("A private API key is required (NEXT_PUBLIC_NEXAGENT_PRIVATE_KEY).");
      return;
    }

    setUpdateStatus("updating");
    setStatusMessage(null);

    const payload = buildAssistantConfig();
    const trimmedPrompt = systemPrompt.trim();
    if (typeof window !== "undefined") {
      if (trimmedPrompt) {
        window.localStorage.setItem(SYSTEM_PROMPT_STORAGE_KEY, trimmedPrompt);
      } else {
        window.localStorage.removeItem(SYSTEM_PROMPT_STORAGE_KEY);
      }
    }

    try {
      const response = await fetch(`${resolvedBaseUrl}/assistant/${resolvedAssistantId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resolvedAuthKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const message = errorBody?.detail || response.statusText || "Failed to update assistant.";
        throw new Error(typeof message === "string" ? message : JSON.stringify(message));
      }

      const updated = await response.json();
      setUpdateStatus("success");
      setStatusMessage(`Updated assistant ${updated?.name || resolvedAssistantId} successfully.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update assistant.";
      setUpdateStatus("error");
      setStatusMessage(message);
    }
  };

  const updateButtonLabel = updateStatus === "updating" ? "Updating…" : "Update";
  const updateDisabled = updateStatus === "updating" || !voiceSelection;

  return (
    <div className="card">
      <div className="header">
        <h1 className="title">Phone Call Configuration</h1>
        <p className="subtitle">Update the phone assistant configuration</p>
      </div>

      {renderSelectRow({
        id: "stt-provider-phone",
        label: "Speech-to-Text Provider",
        value: sttProvider,
        onChange: (value) => setSttProvider(value as SttProvider),
        options: STT_PROVIDERS,
      })}

      <div className="card-section card-section--compact">
        <div className="device-row device-row--tight" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="label">TTS Configuration</div>
            <div className="microphone-status">Provider, language, gender, and voice</div>
          </div>
          <button
            type="button"
            className="button"
            onClick={() => setShowTtsConfig((prev) => !prev)}
          >
            {showTtsConfig ? "Hide" : "Show"}
          </button>
        </div>
        {showTtsConfig && (
          <div style={{ marginTop: 8 }}>
            {renderSelectRow({
              id: "tts-provider-phone",
              label: "Provider",
              value: ttsProvider,
              onChange: setTtsProvider,
              options: ttsProviders,
            })}
            {renderSelectRow({
              id: "tts-language-phone",
              label: "Language",
              value: ttsLanguage,
              onChange: (value) => setTtsLanguage(value as TtsLanguage),
              options: TTS_LANGUAGE_OPTIONS,
            })}
            {renderSelectRow({
              id: "tts-gender-phone",
              label: "Gender",
              value: ttsGender,
              onChange: setTtsGender,
              options: TTS_GENDER_OPTIONS,
            })}
            <div className="card-section card-section--compact">
              <label className="label" htmlFor="tts-voice-phone">
                Voice
              </label>
              <div className="device-row device-row--tight device-row--meter" style={{ gap: 8 }}>
                <select
                  id="tts-voice-phone"
                  className="select select--compact select--meter"
                  value={voiceSelection}
                  onChange={(event) => setVoiceSelection(event.currentTarget.value)}
                  disabled={filteredVoices.length === 0}
                >
                  {filteredVoices.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="button"
                  onClick={handlePlayPreview}
                  disabled={!previewUrl}
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    backgroundColor: isPlaying ? "#e0e0e0" : undefined,
                  }}
                >
                  <span
                    ref={progressRef}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      transform: "scaleX(0)",
                      transformOrigin: "left center",
                      willChange: "transform",
                      backgroundColor: "#000",
                      pointerEvents: "none",
                    }}
                  />
                  <span style={{ position: "relative", zIndex: 1 }}>Play preview</span>
                </button>
              </div>
              <audio
                ref={audioRef}
                src={previewUrl}
                preload="none"
                style={{ display: "none" }}
                onEnded={resetProgress}
                onPause={resetProgress}
                onLoadedMetadata={startProgressLoop}
              />
            </div>
          </div>
        )}
      </div>

      <div className="card-section card-section--compact">
        <button
          type="button"
          className="button"
          onClick={() => setShowSystemPrompt((prev) => !prev)}
        >
          {showSystemPrompt ? "Hide system prompt" : "Add system prompt"}
        </button>
        {showSystemPrompt && (
          <div style={{ marginTop: 8 }}>
            <label className="label" htmlFor="system-prompt-phone">
              System Prompt
            </label>
            <div className="device-row device-row--tight">
              <textarea
                id="system-prompt-phone"
                className="input"
                rows={6}
                value={systemPrompt}
                onChange={(event) => setSystemPrompt(event.currentTarget.value)}
                placeholder="Describe how the assistant should behave."
                style={{ width: "100%" }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="controls">
        <button
          type="button"
          className="button primary"
          onClick={handleUpdate}
          disabled={updateDisabled}
        >
          {updateStatus === "updating" && <LoadingSpinner />}
          {updateButtonLabel}
        </button>
      </div>

      {statusMessage && (
        <div className={`notice ${updateStatus === "success" ? "notice--success" : "notice--error"}`}>
          {updateStatus === "updating" ? <LoadingSpinner /> : null}
          <span>{statusMessage}</span>
        </div>
      )}
    </div>
  );
}

export default PhoneSetupPanel;
