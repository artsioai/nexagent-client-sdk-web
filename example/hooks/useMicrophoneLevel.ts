import { useEffect, useRef, useState } from "react";

const isBrowser =
  typeof window !== "undefined" &&
  typeof navigator !== "undefined" &&
  !!navigator.mediaDevices;

export function useMicrophoneLevel(deviceId?: string | null) {
  const [level, setLevel] = useState(0);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!isBrowser) {
      return;
    }

    let cancelled = false;

    const start = async () => {
      try {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        if (audioContextRef.current) {
          await audioContextRef.current.close();
          audioContextRef.current = null;
        }
        const constraints: MediaStreamConstraints = {
          audio: deviceId
            ? {
                deviceId: { exact: deviceId },
              }
            : true,
          video: false,
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        const audioContext = new AudioContext();
        audioContextRef.current = audioContext;
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const update = () => {
          analyser.getByteTimeDomainData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i += 1) {
            const value = (dataArray[i] - 128) / 128;
            sum += value * value;
          }
          const rms = Math.sqrt(sum / dataArray.length);
          const normalized = Math.min(1, rms * 3);
          setLevel(normalized);
          animationRef.current = requestAnimationFrame(update);
        };
        update();
      } catch (error) {
        console.error("Unable to read microphone level", error);
        setLevel(0);
      }
    };

    start();

    return () => {
      cancelled = true;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => null);
        audioContextRef.current = null;
      }
    };
  }, [deviceId]);

  return level;
}

export default useMicrophoneLevel;
