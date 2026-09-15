import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COURSES, getCourse } from "@/lib/courses";
import { CourseQuizDynamic as CourseQuiz } from "@/components/learn/LearnDynamic";

type Params = Promise<{ courseId: string }>;

export function generateStaticParams() {
  return COURSES.map(c => ({ courseId: c.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const course = getCourse((await params).courseId);
  return { title: course ? `Quiz: ${course.title} — Humana AI` : "Quiz — Humana AI" };
}

export default async function QuizPage({ params }: { params: Params }) {
  const course = getCourse((await params).courseId);
  if (!course) notFound();
  return <CourseQuiz course={course} />;
}
