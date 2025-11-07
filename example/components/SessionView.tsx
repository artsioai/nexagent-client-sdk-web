import { ChatTranscript, TranscriptMessage } from "./ChatTranscript";

interface SessionViewProps {
  messages: TranscriptMessage[];
  onEnd: () => void;
  onToggleMute: () => void;
  muted: boolean;
  assistantSpeaking: boolean;
}

export function SessionView({
  messages,
  onEnd,
  onToggleMute,
  muted,
  assistantSpeaking,
}: SessionViewProps) {
  return (
    <div className="card">
      <div className="header">
        <h2 className="title">Live Conversation</h2>
        <p className="subtitle">
          Real-time transcripts for you and the assistant appear below.
        </p>
        <span className="status-chip">
          {assistantSpeaking ? "Assistant is speaking…" : "Listening"}
        </span>
      </div>
      <ChatTranscript messages={messages} />
      <div className="controls">
        <button className="button secondary" onClick={onToggleMute}>
          {muted ? "Unmute microphone" : "Mute microphone"}
        </button>
        <button className="button primary" onClick={onEnd}>
          End call
        </button>
      </div>
    </div>
  );
}

export default SessionView;
