export interface Lesson {
  id: string;
  title: string;
  /** YouTube link (watch / youtu.be / embed) or bare video ID. */
  videoUrl: string;
  description?: string;
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
}

/** Public shape sent to the browser — correct answers live server-side only (see lib/learn-server.ts). */
export interface QuizQuestion {
  id: string;
  moduleId: string;       // which module the question belongs to (for section headings)
  question: string;
  options: string[];
}

export interface Course {
  id: string;             // used in the URL: /learn/[id]
  title: string;
  tag: string;            // short pill label e.g. "Foundations"
  level: "Beginner" | "Intermediate" | "Advanced";
  summary: string;        // one-liner for the catalog card
  description: string;    // longer text on the course page
  outcomes: string[];     // "What you will learn" bullets
  modules: Module[];
  quiz: QuizQuestion[];
  /** fraction required to pass, e.g. 0.9 */
  passMark: number;
}

export interface UpcomingCourse {
  title: string;
  tag: string;
  summary: string;
}

/** Signed by the server after a passing quiz; required to render a certificate. */
export interface CertificateClaim {
  courseId: string;
  name: string;
  score: number;          // 0..1
  issuedAt: number;       // epoch ms
  certificateId: string;
}

export interface CourseProgress {
  completedLessons: string[];
  quizScore?: number;     // 0..1
  passed?: boolean;
  completedAt?: number;
  certificateId?: string;
  /** server-issued token (claim + signature); the only thing that unlocks the certificate page */
  certToken?: string;
}
