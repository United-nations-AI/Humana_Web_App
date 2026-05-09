import type { Metadata } from "next";
import ChatPageClient from "@/components/chat/ChatPageClient";

export const metadata: Metadata = {
  title: "Chat — Humana AI",
  description: "Talk to Humana AI about human rights, international law, and your freedoms. Free, no login required.",
};

// No threadId — ChatLayout will redirect to the latest thread or create a new one
export default function ChatPage() {
  return <ChatPageClient />;
}
