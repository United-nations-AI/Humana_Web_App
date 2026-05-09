"use client";
import dynamic from "next/dynamic";

const ChatLayout = dynamic(() => import("./ChatLayout"), {
  ssr: false,
  loading: () => (
    <div className="chat-loading-shell">
      <div className="chat-loading-dot" />
    </div>
  ),
});

export default function ChatPageClient({ initialThreadId }: { initialThreadId?: string }) {
  return <ChatLayout initialThreadId={initialThreadId} />;
}
