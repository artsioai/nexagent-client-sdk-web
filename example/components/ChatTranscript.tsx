import { useEffect, useRef } from "react";

export type TranscriptRole = "assistant" | "user" | "system";

export interface TranscriptMessage {
  id: string;
  role: TranscriptRole;
  text: string;
  timestamp: number;
  isFinal: boolean;
}

interface ChatTranscriptProps {
  messages: TranscriptMessage[];
}

const roleLabels: Record<TranscriptRole, string> = {
  assistant: "Assistant",
  user: "You",
  system: "System",
};

export function ChatTranscript({ messages }: ChatTranscriptProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const ordered = [...messages].sort((a, b) => a.timestamp - b.timestamp);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
  }, [ordered]);

  if (ordered.length === 0) {
    return (
      <div className="transcript-empty">
        Conversation transcripts will appear once the call starts.
      </div>
    );
  }

  return (
    <div className="transcript">
      {ordered.map((message) => (
        <div key={message.id} className="transcript-group">
          <span className={`transcript-label ${message.role}`}>
            {roleLabels[message.role]}
            {!message.isFinal ? " · live" : ""}
          </span>
          <div
            className={[
              "bubble",
              message.role,
              !message.isFinal ? "live" : "",
            ].join(" ")}
          >
            {message.text}
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

export default ChatTranscript;
