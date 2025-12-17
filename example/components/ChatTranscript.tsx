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

  // Collapse adjacent messages from the same role when the later one is just a
  // refined version of the previous (common with streaming transcripts).
  const condensed = ordered.reduce<TranscriptMessage[]>((list, current) => {
    const previous = list[list.length - 1];
    if (previous && previous.role === current.role) {
      const prevText = previous.text.trim();
      const nextText = current.text.trim();
      const isSame = prevText === nextText;
      const isRefinement =
        nextText.startsWith(prevText) && nextText.length - prevText.length <= 3;

      if (isSame || isRefinement) {
        // Keep the latest content and prefer final flag if either is final.
        list[list.length - 1] = {
          ...current,
          isFinal: previous.isFinal || current.isFinal,
        };
        return list;
      }
    }
    list.push(current);
    return list;
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
  }, [condensed]);

  if (condensed.length === 0) {
    return (
      <div className="transcript-empty">
        Conversation transcripts will appear once the call starts.
      </div>
    );
  }

  return (
    <div className="transcript">
      {condensed.map((message) => (
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
