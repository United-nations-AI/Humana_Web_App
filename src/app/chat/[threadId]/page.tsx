import type { Metadata } from "next";
import ChatPageClient from "@/components/chat/ChatPageClient";

export const metadata: Metadata = {
  title: "Chat — Humana AI",
  description: "Your Humana AI conversation",
};

// Next.js 16: params is a Promise
export default async function ThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;
  return <ChatPageClient initialThreadId={threadId} />;
}
