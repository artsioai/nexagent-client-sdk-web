import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type AudioDevice = Pick<MediaDeviceInfo, "deviceId" | "label" | "kind">;

interface UseAudioDevicesResult {
  devices: AudioDevice[];
  selectedDeviceId: string | null;
  setSelectedDeviceId: (deviceId: string | null) => void;
  refresh: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const isMediaDevicesSupported =
  typeof window !== "undefined" &&
  typeof navigator !== "undefined" &&
  !!navigator.mediaDevices;

export function useAudioDevices(): UseAudioDevicesResult {
  const [devices, setDevices] = useState<AudioDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const stopTracksRef = useRef<() => void>(() => {});

  const stopTracks = useCallback(() => {
    stopTracksRef.current?.();
    stopTracksRef.current = () => {};
  }, []);

  const enumerate = useCallback(async () => {
    if (!isMediaDevicesSupported) {
      setError("Media devices are not available in this environment.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      stopTracks();
      const permissionStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      stopTracksRef.current = () => {
        permissionStream.getTracks().forEach((track) => track.stop());
      };

      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = allDevices.filter(
        (device) => device.kind === "audioinput"
      );
      setDevices(audioInputs);

      if (audioInputs.length === 0) {
        setSelectedDeviceId(null);
      } else if (
        !selectedDeviceId ||
        !audioInputs.some((device) => device.deviceId === selectedDeviceId)
      ) {
        setSelectedDeviceId(audioInputs[0].deviceId);
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to access microphone devices.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [selectedDeviceId, stopTracks]);

  useEffect(() => {
    enumerate();
    return () => {
      stopTracks();
    };
  }, [enumerate, stopTracks]);

  useEffect(() => {
    if (!isMediaDevicesSupported) return;
    const handleDeviceChange = () => {
      enumerate().catch(() => {
        /* handled in enumerate */
      });
    };
    navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange);
    return () => {
      navigator.mediaDevices.removeEventListener(
        "devicechange",
        handleDeviceChange
      );
    };
  }, [enumerate]);

  const refresh = useCallback(async () => {
    await enumerate();
  }, [enumerate]);

  return useMemo(
    () => ({
      devices,
      selectedDeviceId,
      setSelectedDeviceId,
      refresh,
      loading,
      error,
    }),
    [devices, selectedDeviceId, refresh, loading, error]
  );
}

export default useAudioDevices;
