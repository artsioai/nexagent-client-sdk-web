import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import NexAgent from "@newcast/nexagent-sdk-web";

import { useAudioDevices } from "../hooks/useAudioDevices";
import SessionView from "./SessionView";
import SetupPanel from "./SetupPanel";
import { TranscriptMessage } from "./ChatTranscript";

type CallState = "idle" | "ready" | "starting" | "connected";

interface TranscriptTurn {
  id: string | null;
  text: string;
}

interface TranscriptBubble {
  id: string;
  role: TranscriptMessage["role"];
  createdAt: number;
  lastUpdated: number;
  segments: TranscriptTurn[];
  activeSegment?: TranscriptTurn;
}

const DEFAULT_NEXAGENT_BASE_URL =
  "https://nexagent.api.next.newcast.ai";

export function NexAgentDemo() {
  const publicKey =
    process.env.NEXT_PUBLIC_NEXAGENT_PUBLIC_KEY ||
    "";
  const assistantId =
    process.env.NEXT_PUBLIC_NEXAGENT_ASSISTANT_ID || "";

  const [callState, setCallState] = useState<CallState>("idle");
  const [muted, setMuted] = useState(false);
  const [assistantSpeaking, setAssistantSpeaking] = useState(false);
  const [messages, setMessages] = useState<TranscriptMessage[]>([]);
  const [lastError, setLastError] = useState<string | null>(null);

  const nexAgentRef = useRef<NexAgent | null>(null);
  const transcriptAggregatesRef = useRef<TranscriptBubble[]>([]);
  const bubbleIdCounterRef = useRef(0);
  const selectedDeviceRef = useRef<string | null>(null);

  const audioDevices = useAudioDevices();

  const rebuildMessagesFromAggregates = useCallback(() => {
    const bubbles = transcriptAggregatesRef.current;

    const next = bubbles
      .map((bubble) => {
        const segments = bubble.segments
          .map((turn) => turn.text.trim())
          .filter(Boolean);

        const activeText = bubble.activeSegment?.text?.trim();
        if (activeText) {
          segments.push(activeText);
        }

        if (segments.length === 0) {
          return null;
        }

        return {
          id: bubble.id,
          role: bubble.role,
          text: segments.join("\n\n"),
          timestamp: bubble.createdAt,
          isFinal: !bubble.activeSegment,
        } satisfies TranscriptMessage;
      })
      .filter((message): message is TranscriptMessage => message !== null);

    setMessages(next);
  }, []);

  const finalizeActiveTurns = useCallback(() => {
    const bubbles = transcriptAggregatesRef.current;
    let changed = false;

    bubbles.forEach((bubble) => {
      if (!bubble.activeSegment) {
        return;
      }

      const activeText = bubble.activeSegment.text.trim();
      if (activeText.length > 0) {
        const activeId = bubble.activeSegment.id;
        const existing =
          activeId !== null
            ? bubble.segments.find((turn) => turn.id === activeId)
            : undefined;

        if (existing) {
          existing.text = activeText;
        } else {
          const duplicateNull =
            activeId === null &&
            bubble.segments.length > 0 &&
            bubble.segments[bubble.segments.length - 1].text === activeText;

          if (!duplicateNull) {
            bubble.segments.push({
              id: activeId,
              text: activeText,
            });
          }
        }
      }

      bubble.activeSegment = undefined;
      bubble.lastUpdated = Date.now();
      changed = true;
    });

    if (changed) {
      rebuildMessagesFromAggregates();
    }
  }, [rebuildMessagesFromAggregates]);

  useEffect(() => {
    selectedDeviceRef.current = audioDevices.selectedDeviceId;
  }, [audioDevices.selectedDeviceId]);

  useEffect(() => {
    if (!publicKey) {
      setLastError(
        "NEXT_PUBLIC_NEXAGENT_PUBLIC_KEY is not configured."
      );
      return;
    }

    const resolvedBaseUrl =
      process.env.NEXT_PUBLIC_NEXAGENT_BASE_URL?.trim() ||
      DEFAULT_NEXAGENT_BASE_URL;

    const nexAgent = new NexAgent(publicKey, resolvedBaseUrl);
    nexAgentRef.current = nexAgent;
    setCallState("ready");

    const handleCallStart = async () => {
      setCallState("connected");
      setAssistantSpeaking(false);
      setMuted(nexAgent.isMuted());
      const deviceId = selectedDeviceRef.current;
      if (deviceId) {
        try {
          await nexAgent.setInputDevicesAsync({ audioSource: deviceId });
        } catch (error) {
          console.error("Failed to apply microphone selection", error);
          setLastError("Unable to switch microphone for the call.");
        }
      }
    };

    const handleCallEnd = () => {
      setCallState("ready");
      setAssistantSpeaking(false);
      setMuted(false);
      finalizeActiveTurns();
    };

    const handleSpeechStart = () => setAssistantSpeaking(true);
    const handleSpeechEnd = () => setAssistantSpeaking(false);

    const handleMessage = (message: any) => {
      const isTranscript =
        message?.type === "transcript" ||
        message?.type === "transcript[transcriptType='final']";

      if (!isTranscript || typeof message.transcript !== "string") {
        return;
      }

      const role =
        message.role === "assistant" || message.role === "model"
          ? "assistant"
          : "user";
      const isFinal =
        message.transcriptType === "final" ||
        message?.type === "transcript[transcriptType='final']";

      const trimmedTranscript = message.transcript.trim();
      const messageId =
        typeof message.id === "string" && message.id.length > 0
          ? message.id
          : null;
      const treatAsFinal = isFinal;

      const bubbles = transcriptAggregatesRef.current;

      const findBubbleByMessageId = (id: string) => {
        for (let index = bubbles.length - 1; index >= 0; index -= 1) {
          const bubble = bubbles[index];
          if (bubble.activeSegment?.id === id) {
            return bubble;
          }
          if (bubble.segments.some((turn) => turn.id === id)) {
            return bubble;
          }
        }
        return undefined;
      };

      const findLatestBubbleWithActiveSegment = () => {
        for (let index = bubbles.length - 1; index >= 0; index -= 1) {
          const bubble = bubbles[index];
          if (bubble.role === role && bubble.activeSegment) {
            return bubble;
          }
        }
        return undefined;
      };

      const now = Date.now();
      let targetBubble: TranscriptBubble | undefined;

      if (messageId) {
        targetBubble = findBubbleByMessageId(messageId);
      }

      if (!targetBubble && !messageId) {
        const lastBubble = bubbles[bubbles.length - 1];
        if (
          lastBubble?.role === role &&
          (treatAsFinal || lastBubble.activeSegment)
        ) {
          targetBubble = lastBubble;
        }
      }

      if (!targetBubble && !messageId) {
        targetBubble = findLatestBubbleWithActiveSegment();
      }

      const shouldStartNewBubble =
        trimmedTranscript.length > 0 && !targetBubble;

      if (shouldStartNewBubble) {
        bubbleIdCounterRef.current += 1;
        targetBubble = {
          id: `bubble-${bubbleIdCounterRef.current}`,
          role,
          createdAt: now,
          lastUpdated: now,
          segments: [],
        };
        bubbles.push(targetBubble);
      }

      if (!targetBubble) {
        return;
      }

      targetBubble.lastUpdated = now;

      if (!trimmedTranscript) {
        if (treatAsFinal && targetBubble.activeSegment) {
          targetBubble.activeSegment = undefined;
          rebuildMessagesFromAggregates();
        }
        return;
      }

      if (treatAsFinal) {
        const targetId = messageId ?? targetBubble.activeSegment?.id ?? null;
        targetBubble.segments =
          trimmedTranscript.length > 0
            ? [
                {
                  id: targetId,
                  text: trimmedTranscript,
                },
              ]
            : [];
        targetBubble.activeSegment = undefined;
      } else {
        const activeId = messageId ?? targetBubble.activeSegment?.id ?? null;
        targetBubble.activeSegment = {
          id: activeId,
          text: trimmedTranscript,
        };
      }

      rebuildMessagesFromAggregates();
    };

    const handleError = (error: any) => {
      const message =
        typeof error === "string"
          ? error
          : error?.message || "An unexpected error occurred.";
      setLastError(message);
      setCallState("ready");
    };

    nexAgent.on("call-start", handleCallStart);
    nexAgent.on("call-end", handleCallEnd);
    nexAgent.on("speech-start", handleSpeechStart);
    nexAgent.on("speech-end", handleSpeechEnd);
    nexAgent.on("message", handleMessage);
    nexAgent.on("error", handleError);

    return () => {
      nexAgent.removeListener("call-start", handleCallStart);
      nexAgent.removeListener("call-end", handleCallEnd);
      nexAgent.removeListener("speech-start", handleSpeechStart);
      nexAgent.removeListener("speech-end", handleSpeechEnd);
      nexAgent.removeListener("message", handleMessage);
      nexAgent.removeListener("error", handleError);
      nexAgent.stop();
      nexAgentRef.current = null;
    };
  }, [publicKey, finalizeActiveTurns, rebuildMessagesFromAggregates]);

  const startDisabled = useMemo(() => {
    if (!publicKey) {
      return true;
    }
    if (!assistantId) {
      return true;
    }
    if (audioDevices.loading) {
      return true;
    }
    if (audioDevices.error) {
      return true;
    }
    return false;
  }, [publicKey, assistantId, audioDevices.loading, audioDevices.error]);

  const startCall = useCallback(async () => {
    const nexAgent = nexAgentRef.current;
    if (!nexAgent) {
      setLastError("NexAgent is not ready.");
      setCallState("ready");
      return;
    }
    if (!assistantId) {
      setLastError(
        "NEXT_PUBLIC_NEXAGENT_ASSISTANT_ID is required to start a call."
      );
      setCallState("ready");
      return;
    }

    try {
      setCallState("starting");
      setLastError(null);
      transcriptAggregatesRef.current = [];
      bubbleIdCounterRef.current = 0;
      setMessages([]);

      await nexAgent.start(assistantId);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to start the assistant.";
      setCallState("ready");
      setLastError(message);
    }
  }, [assistantId]);

  const endCall = useCallback(() => {
    nexAgentRef.current?.stop();
  }, []);

  const toggleMute = useCallback(() => {
    const nexAgent = nexAgentRef.current;
    if (!nexAgent || callState !== "connected") {
      return;
    }
    const nextMuted = !muted;
    try {
      nexAgent.setMuted(nextMuted);
      setMuted(nextMuted);
    } catch (error) {
      console.error("Error toggling mute", error);
      setLastError("Unable to change microphone state.");
    }
  }, [muted, callState]);

  return (
    <div className="page">
      {lastError && (
        <div className="card" style={{ border: "1px solid #fecaca", background: "#fee2e2", color: "#991b1b" }}>
          <strong>Error:</strong> {lastError}
        </div>
      )}
      {callState === "connected" ? (
        <SessionView
          messages={messages}
          muted={muted}
          onToggleMute={toggleMute}
          onEnd={endCall}
          assistantSpeaking={assistantSpeaking}
        />
      ) : (
        <SetupPanel
          selectedDeviceId={audioDevices.selectedDeviceId}
          onDeviceChange={(deviceId) => {
            audioDevices.setSelectedDeviceId(deviceId || null);
          }}
          onDeviceRefresh={audioDevices.refresh}
          devices={audioDevices.devices}
          deviceLoading={audioDevices.loading}
          deviceError={audioDevices.error}
          onStart={startCall}
          callState={callState}
          disabled={startDisabled}
        />
      )}
    </div>
  );
}

export default NexAgentDemo;
