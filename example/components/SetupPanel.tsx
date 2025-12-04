import { useEffect, useMemo, useState } from "react";
import type { CreateAssistantDTOInput, Language } from "../../api";
import DeviceSelector from "./DeviceSelector";
import voiceCatalog from "../voice_catalog.json";

const SYSTEM_PROMPT_STORAGE_KEY = "nexagent_demo_system_prompt";

const STT_PROVIDERS = [
  { value: "deepgram", label: "Deepgram (placeholder)" },
  { value: "cartesia", label: "Cartesia (placeholder)" },
  { value: "soniox", label: "Soniox (placeholder)" },
] as const;

type VoiceOption = { value: string; label: string; language?: string; gender?: string; provider: string };

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

const TTS_LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "ja", label: "Japanese" },
] as const;
const TTS_GENDER_OPTIONS = [
  { value: "all", label: "Any" },
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
];

type SttProvider = (typeof STT_PROVIDERS)[number]["value"];
type TtsLanguage = (typeof TTS_LANGUAGE_OPTIONS)[number]["value"];

interface SetupPanelProps {
  selectedDeviceId: string | null;
  onDeviceChange: (deviceId: string) => void;
  onDeviceRefresh: () => void;
  devices: { deviceId: string; label: string }[];
  deviceLoading: boolean;
  deviceError: string | null;
  onStart: (assistant: CreateAssistantDTOInput) => Promise<void>;
  callState: "idle" | "ready" | "starting" | "connected";
  disabled?: boolean;
}

export function SetupPanel({
  selectedDeviceId,
  onDeviceChange,
  onDeviceRefresh,
  devices,
  deviceLoading,
  deviceError,
  onStart,
  callState,
  disabled,
}: SetupPanelProps) {
  const [sttProvider, setSttProvider] = useState<SttProvider>(STT_PROVIDERS[0].value);
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

  const [ttsProvider, setTtsProvider] = useState<string>(ttsProviders[0]?.value ?? "");
  const [ttsLanguage, setTtsLanguage] = useState<TtsLanguage>(TTS_LANGUAGE_OPTIONS[0].value);
  const [ttsGender, setTtsGender] = useState<string>("all");
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState("");

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

  const [voiceSelection, setVoiceSelection] = useState<string>(filteredVoices[0]?.value ?? "");

  useEffect(() => {
    setVoiceSelection(filteredVoices[0]?.value ?? "");
  }, [ttsProvider, filteredVoices]);

  const handleSttChange = (value: string) => {
    setSttProvider(value as SttProvider);
    console.info(`[placeholder] STT provider selected: ${value}`);
  };

  const handleTtsChange = (value: string) => {
    setTtsProvider(value);
    console.info(`[placeholder] TTS provider selected: ${value}`);
  };

  const handleVoiceChange = (value: string) => {
    setVoiceSelection(value);
    console.info(`Voice selected: ${value}`);
  };

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
      name: "Web Demo Assistant",
      firstMessage: "Hi there! I'm your NexAgent demo assistant. How can I help?",
      metadata: {
        source: "demo",
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

  const isStarting = callState === "starting";
  const startButtonDisabled = disabled || isStarting || !voiceSelection;
  const startLabel =
    callState === "ready" || callState === "idle"
      ? "Start Call"
      : isStarting
      ? "Starting…"
      : "Start";

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

  return (
    <div className="card">
      <div className="header">
        <h1 className="title">NexAgent Web SDK Demo</h1>
        <p className="subtitle">
          Connect directly to NexAgent, choose your microphone, and review live transcripts in real time.
        </p>
      </div>
      {renderSelectRow({
        id: "stt-provider",
        label: "Speech-to-Text Provider",
        value: sttProvider,
        onChange: handleSttChange,
        options: STT_PROVIDERS,
      })}
      {renderSelectRow({
        id: "tts-provider",
        label: "Text-to-Speech Provider",
        value: ttsProvider,
        onChange: handleTtsChange,
        options: ttsProviders,
      })}
      {renderSelectRow({
        id: "tts-language",
        label: "TTS Language",
        value: ttsLanguage,
        onChange: (value) => setTtsLanguage(value as TtsLanguage),
        options: TTS_LANGUAGE_OPTIONS,
      })}
      {renderSelectRow({
        id: "tts-gender",
        label: "TTS Gender",
        value: ttsGender,
        onChange: setTtsGender,
        options: TTS_GENDER_OPTIONS,
      })}
      {renderSelectRow({
        id: "tts-voice",
        label: "Voice",
        value: voiceSelection,
        onChange: handleVoiceChange,
        options: filteredVoices,
        disabled: filteredVoices.length === 0,
      })}
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
            <label className="label" htmlFor="system-prompt">
              System Prompt
            </label>
            <div className="device-row device-row--tight">
              <textarea
                id="system-prompt"
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
      <DeviceSelector
        selectedDeviceId={selectedDeviceId}
        onChange={onDeviceChange}
        onRefresh={onDeviceRefresh}
        devices={devices}
        loading={deviceLoading}
        error={deviceError}
      />
      <div className="controls">
        <button
          className="button primary"
          onClick={() => {
            const assistantConfig = buildAssistantConfig();
            const trimmedPrompt = systemPrompt.trim();
            if (typeof window !== "undefined") {
              if (trimmedPrompt) {
                window.localStorage.setItem(SYSTEM_PROMPT_STORAGE_KEY, trimmedPrompt);
              } else {
                window.localStorage.removeItem(SYSTEM_PROMPT_STORAGE_KEY);
              }
            }
            onStart(assistantConfig).catch(() => {
              /* error handled upstream */
            });
          }}
          disabled={startButtonDisabled}
        >
          {startLabel}
        </button>
      </div>
    </div>
  );
}

export default SetupPanel;
