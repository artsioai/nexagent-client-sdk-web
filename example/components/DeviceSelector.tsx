import { useMemo } from "react";
import { useMicrophoneLevel } from "../hooks/useMicrophoneLevel";

interface DeviceSelectorProps {
  selectedDeviceId: string | null;
  onChange: (deviceId: string) => void;
  onRefresh: () => void;
  devices: { deviceId: string; label: string }[];
  loading: boolean;
  error: string | null;
}

export function DeviceSelector({
  selectedDeviceId,
  onChange,
  onRefresh,
  devices,
  loading,
  error,
}: DeviceSelectorProps) {
  const deviceOptions = useMemo(() => {
    if (loading) {
      return [{ deviceId: "", label: "Loading microphones…" }];
    }
    if (error) {
      return [{ deviceId: "", label: "Microphone unavailable" }];
    }
    if (devices.length === 0) {
      return [{ deviceId: "", label: "No microphones detected" }];
    }
    return devices;
  }, [devices, loading, error]);

  const level = useMicrophoneLevel(selectedDeviceId);

  return (
    <div className="card-section">
      <label className="label" htmlFor="microphone">
        Microphone
      </label>
      <div className="device-row">
        <select
          id="microphone"
          className="select"
          value={selectedDeviceId ?? deviceOptions[0]?.deviceId ?? ""}
          onChange={(event) => onChange(event.currentTarget.value)}
          disabled={loading || !!error || deviceOptions.length === 0}
        >
          {deviceOptions.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || "Unnamed microphone"}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="button secondary"
          onClick={onRefresh}
          disabled={loading}
        >
          Refresh
        </button>
      </div>
      <div className="microphone-status">
        {error
          ? <span className="error-text">{error}</span>
          : loading
            ? "Requesting microphone access…"
            : "Speak to test your microphone level."}
      </div>
      {!error && (
        <div className="level-meter">
          <div
            className="level-meter__fill"
            style={{ width: `${Math.max(5, level * 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default DeviceSelector;
