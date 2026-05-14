"use client";
import dynamic from "next/dynamic";
import ChatDisclaimer from "./ChatDisclaimer";

const ChatLayout = dynamic(() => import("./ChatLayout"), {
  ssr: false,
  loading: () => (
    <div className="chat-loading-shell">
      <div className="chat-loading-dot" />
    </div>
  ),
});

export default function ChatPageClient({ initialThreadId }: { initialThreadId?: string }) {
  return (
    <ChatDisclaimer>
      <ChatLayout initialThreadId={initialThreadId} />
    </ChatDisclaimer>
  );
}
