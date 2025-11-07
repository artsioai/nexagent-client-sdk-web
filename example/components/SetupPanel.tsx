import DeviceSelector from "./DeviceSelector";

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
  const isStarting = callState === "starting";
  const startLabel =
    callState === "ready" || callState === "idle"
      ? "Start Call"
      : isStarting
      ? "Starting…"
      : "Start";

  return (
    <div className="card">
      <div className="header">
        <h1 className="title">NexAgent Web SDK Demo</h1>
        <p className="subtitle">
          Connect directly to NexAgent, choose your microphone, and review live transcripts in real time.
        </p>
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
