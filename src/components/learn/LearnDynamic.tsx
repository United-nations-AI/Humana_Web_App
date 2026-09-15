"use client";
/* Learn components read localStorage (learner name + progress), so they are
   loaded client-only, mirroring how ChatPageClient loads ChatLayout. */
import dynamic from "next/dynamic";

const Loading = () => (
  <div className="learn-loading"><div className="chat-loading-dot" /></div>
);

export const LearnCatalogDynamic      = dynamic(() => import("./LearnCatalog"),      { ssr: false, loading: Loading });
export const CoursePlayerDynamic      = dynamic(() => import("./CoursePlayer"),      { ssr: false, loading: Loading });
export const CourseQuizDynamic        = dynamic(() => import("./CourseQuiz"),        { ssr: false, loading: Loading });
export const CourseCertificateDynamic = dynamic(() => import("./CourseCertificate"), { ssr: false, loading: Loading });
