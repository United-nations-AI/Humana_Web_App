import type { Metadata } from "next";
import AdminLearnDashboard from "@/components/learn/AdminLearnDashboard";

export const metadata: Metadata = {
  title: "Learning Admin — Humana AI",
  robots: { index: false, follow: false },
};

export default function AdminLearnPage() {
  return <AdminLearnDashboard />;
}
