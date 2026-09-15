import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COURSES, getCourse } from "@/lib/courses";
import { CoursePlayerDynamic as CoursePlayer } from "@/components/learn/LearnDynamic";

type Params = Promise<{ courseId: string }>;

export function generateStaticParams() {
  return COURSES.map(c => ({ courseId: c.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const course = getCourse((await params).courseId);
  return {
    title: course ? `${course.title} — Humana AI Learning` : "Course — Humana AI",
    description: course?.summary,
  };
}

export default async function CoursePage({ params }: { params: Params }) {
  const course = getCourse((await params).courseId);
  if (!course) notFound();
  return <CoursePlayer course={course} />;
}
