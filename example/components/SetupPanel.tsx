import { useEffect, useMemo, useState } from "react";
import DeviceSelector from "./DeviceSelector";
import voicesData from "../voices.json";

const STT_PROVIDERS = [
  { value: "deepgram", label: "Deepgram (placeholder)" },
  { value: "cartesia", label: "Cartesia (placeholder)" },
  { value: "soniox", label: "Soniox (placeholder)" },
];

type VoiceOption = { value: string; label: string; language?: string };

const parsedProviders = (voicesData as { provider: string; voices: unknown }[]).map((p) => ({
  value: p.provider.toLowerCase(),
  label: p.provider,
  rawProvider: p.provider,
  voices: p.voices,
}));

const TTS_LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "ja", label: "Japanese" },
];

interface SetupPanelProps {
  selectedDeviceId: string | null;
  onDeviceChange: (deviceId: string) => void;
  onDeviceRefresh: () => void;
  devices: { deviceId: string; label: string }[];
  deviceLoading: boolean;
  deviceError: string | null;
  onStart: () => Promise<void>;
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
  const [sttProvider, setSttProvider] = useState<string>(STT_PROVIDERS[0].value);
  const ttsProviders = parsedProviders.length
    ? parsedProviders.map(({ value, label }) => ({ value, label }))
    : [
        { value: "cartesia", label: "Cartesia" },
        { value: "azure", label: "Azure Speech" },
        { value: "minimax", label: "MiniMax" },
      ];

  const [ttsProvider, setTtsProvider] = useState<string>(ttsProviders[0]?.value ?? "");
  const [ttsLanguage, setTtsLanguage] = useState<string>(TTS_LANGUAGE_OPTIONS[0].value);

  const voicesByProvider = useMemo(() => {
    const map: Record<string, VoiceOption[]> = {};
    parsedProviders.forEach(({ value, rawProvider, voices }) => {
      if (rawProvider.toLowerCase() === "cartesia" && Array.isArray(voices)) {
        map[value] = voices.map((v: any) => ({
          value: v.id ?? v.voice_id ?? v.ShortName ?? v.Name ?? "",
          label: v.name ?? v.voice_name ?? v.DisplayName ?? v.LocalName ?? v.ShortName ?? v.id ?? "Voice",
          language: v.language_normalized ?? v.language,
        }));
      } else if (rawProvider.toLowerCase() === "azure" && Array.isArray(voices)) {
        map[value] = voices.map((v: any) => ({
          value: v.ShortName ?? v.LocalName ?? v.Name ?? "",
          label:
            v.DisplayName ||
            v.LocalName ||
            v.ShortName ||
            v.Name ||
            "Voice",
          language: v.language_normalized ?? v.language ?? v.Locale,
        }));
      } else if (rawProvider.toLowerCase() === "minimax" && typeof voices === "object" && voices) {
        const all = [
          ...(voices as any).system_voice ?? [],
          ...(voices as any).voice_cloning ?? [],
          ...(voices as any).voice_generation ?? [],
        ];
        map[value] = all.map((v: any) => ({
          value: v.voice_id ?? v.id ?? "",
          label: v.voice_name ?? v.name ?? v.voice_id ?? "Voice",
          language: v.language_normalized ?? v.language,
        }));
      }
    });
    return map;
  }, []);

  const voicesForProvider = useMemo(() => voicesByProvider[ttsProvider] ?? [], [ttsProvider, voicesByProvider]);

  const filteredVoices = useMemo(() => {
    if (!ttsLanguage) return voicesForProvider;
    const lang = ttsLanguage.toLowerCase();
    return voicesForProvider.filter((v) => {
      const voiceLang = (v.language || "").toLowerCase();
      return voiceLang === lang || voiceLang.startsWith(`${lang}-`);
    });
  }, [ttsLanguage, voicesForProvider]);

  const [voiceSelection, setVoiceSelection] = useState<string>(filteredVoices[0]?.value ?? "");

  useEffect(() => {
    setVoiceSelection(filteredVoices[0]?.value ?? "");
  }, [ttsProvider, filteredVoices]);

  const handleSttChange = (value: string) => {
    setSttProvider(value);
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

  const isStarting = callState === "starting";
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
      options: { value: string; label: string }[];
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
        onChange: setTtsLanguage,
        options: TTS_LANGUAGE_OPTIONS,
      })}
      {renderSelectRow({
        id: "tts-voice",
        label: "Voice",
        value: voiceSelection,
        onChange: handleVoiceChange,
        options: filteredVoices,
        disabled: filteredVoices.length === 0,
      })}
      <div className="microphone-status">
        {filteredVoices.length === 0
          ? "No voices available for this provider."
          : `Showing ${filteredVoices.length} voices for ${ttsProviders.find((p) => p.value === ttsProvider)?.label ?? "provider"} (${TTS_LANGUAGE_OPTIONS.find((l) => l.value === ttsLanguage)?.label ?? ttsLanguage}).`}
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
            onStart().catch(() => {
              /* error handled upstream */
            });
          }}
          disabled={disabled || isStarting}
        >
          {startLabel}
        </button>
      </div>
    </div>
  );
}

export default SetupPanel;
