import type { ChatThread, Message } from "@/types/chat";
import { uuid } from "./uuid";
import { loadAudio } from "./audio-storage";

const KEY = "humana_chat_threads";

export function loadThreads(): ChatThread[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveThreads(threads: ChatThread[]): void {
  if (typeof window === "undefined") return;
  // Replace live blob: URLs with stable idb:{id} references before persisting.
  // The actual blob lives in IndexedDB (2-day TTL).
  const persisted = threads.map(t => ({
    ...t,
    messages: t.messages.map(m => ({
      ...m,
      attachments: m.attachments?.map(a =>
        a.type === "audio" ? { ...a, content: `idb:${a.id}` } : a
      ),
    })),
  }));
  localStorage.setItem(KEY, JSON.stringify(persisted));
}

/** After loadThreads(), call this to swap idb: references back to fresh blob URLs. */
export async function hydrateAudio(threads: ChatThread[]): Promise<ChatThread[]> {
  return Promise.all(threads.map(async t => ({
    ...t,
    messages: await Promise.all(t.messages.map(async m => {
      if (!m.attachments?.some(a => a.type === "audio" && a.content.startsWith("idb:")))
        return m;
      const atts = await Promise.all(m.attachments.map(async a => {
        if (a.type !== "audio" || !a.content.startsWith("idb:")) return a;
        const url = await loadAudio(a.id);
        return url ? { ...a, content: url } : null; // null = expired / not found
      }));
      return { ...m, attachments: atts.filter(Boolean) as NonNullable<typeof m.attachments> };
    })),
  })));
}

export function createThread(): ChatThread {
  return {
    id: uuid(),
    title: "New Chat",
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function saveMessage(threads: ChatThread[], threadId: string, msg: Message): ChatThread[] {
  return threads.map(t =>
    t.id !== threadId ? t : { ...t, messages: [...t.messages, msg], updatedAt: Date.now() }
  );
}

export function setThreadTitle(threads: ChatThread[], threadId: string, title: string): ChatThread[] {
  return threads.map(t => t.id !== threadId ? t : { ...t, title });
}

export function deleteThread(threads: ChatThread[], threadId: string): ChatThread[] {
  return threads.filter(t => t.id !== threadId);
}

export function groupThreadsByDate(threads: ChatThread[]): Record<string, ChatThread[]> {
  const now = Date.now();
  const DAY = 86_400_000;
  const groups: Record<string, ChatThread[]> = { Today: [], Yesterday: [], "Past 7 Days": [], Older: [] };

  [...threads]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .forEach(t => {
      const diff = now - t.updatedAt;
      if (diff < DAY)              groups["Today"].push(t);
      else if (diff < 2 * DAY)     groups["Yesterday"].push(t);
      else if (diff < 7 * DAY)     groups["Past 7 Days"].push(t);
      else                         groups["Older"].push(t);
    });

  return groups;
}
