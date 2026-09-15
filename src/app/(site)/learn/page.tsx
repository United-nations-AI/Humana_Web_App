import type { Metadata } from "next";
import { LearnCatalogDynamic as LearnCatalog } from "@/components/learn/LearnDynamic";

export const metadata: Metadata = {
  title: "Learning Platform — Humana AI",
  description: "Free, self-paced video courses on human rights and international law. Complete a course, pass the quiz, and earn a certificate.",
};

export default function LearnPage() {
  return <LearnCatalog />;
}
