import type { Course, Lesson } from "@/types/learn";

/* ────────────────────────────────────────────────────────────────────────────
   Course catalogue (public data — no quiz answers here).
   Quiz answer keys live in lib/learn-server.ts and never reach the browser.
   ──────────────────────────────────────────────────────────────────────────── */

export const LEARN_INTRO = {
  eyebrow: "Learning Platform",
  heading: "Learn Your Rights.\nEarn a Certificate.",
  lede:
    "Humana AI gives every person free access to human rights knowledge. The learning platform turns that mission into structured, self-paced video courses on human rights and international law, with a certificate of completion at the end.",
  about:
    "Each course is organised into modules. Every module is a short video lesson you watch in order, with your progress saved as you go. When all modules are complete, a final questionnaire checks what you have learned. Score 80% or higher and you receive a personalised certificate issued by Humana AI and Qatar CPD. No account, no payment, no barriers.",
};

export const COURSES: Course[] = [
  {
    id: "foundations-of-human-rights",
    title: "Foundations of Human Rights: Understanding Your Rights and Responsibilities",
    tag: "Foundations",
    level: "Beginner",
    duration: "1.5 Hours",
    accreditation: { body: "The CPD Certification Service", certificateNumber: "900304", certifiedOn: "16 October 2026" },
    summary:
      "The foundations of human rights: what they are, the international framework that protects them, the responsibilities that come with them, and how to promote them.",
    description:
      "Foundations of Human Rights: Understanding Your Rights and Responsibilities introduces the core ideas every person should know. You will learn what human rights are and the principles of dignity, equality and universality behind them, how the Universal Declaration and international treaties form the foundation of international human rights, how rights go hand in hand with responsibilities and participation, and how to become a responsible advocate for human rights in everyday life.",
    outcomes: [
      "Explain what human rights are and how dignity, equality and universality apply in everyday life",
      "Describe the Universal Declaration, international treaties, and what States are expected to do",
      "Understand the responsibilities that come with rights and how participation strengthens communities",
      "Advocate for human rights responsibly using accurate information and respectful communication",
    ],
    passMark: 0.8,
    modules: [
      {
        id: "module-1",
        title: "Human Rights in Everyday Life",
        description: "What human rights are, the principles of dignity, equality and universality, and how they show up in daily life.",
        lessons: [
          { id: "module-1-video", title: "Human Rights in Everyday Life", videoUrl: "https://youtu.be/GySbcbcX6fc" },
        ],
      },
      {
        id: "module-2",
        title: "Understanding International Human Rights",
        description: "The Universal Declaration, international treaties, State obligations, and the different categories of rights.",
        lessons: [
          { id: "module-2-video", title: "Understanding International Human Rights", videoUrl: "https://youtu.be/_v2V5gRwlHw" },
        ],
      },
      {
        id: "module-3",
        title: "Rights, Responsibilities and Participation",
        description: "Why rights come with responsibilities, and how dialogue, accurate information and participation strengthen communities.",
        lessons: [
          { id: "module-3-video", title: "Rights, Responsibilities and Participation", videoUrl: "https://youtu.be/EeXbwbMSb6c" },
        ],
      },
      {
        id: "module-4",
        title: "Becoming a Human Rights Advocate",
        description: "Responsible advocacy, active listening, community initiatives, and applying human rights principles in everyday life.",
        lessons: [
          { id: "module-4-video", title: "Becoming a Human Rights Advocate", videoUrl: "https://youtu.be/-KLa4NeOvDc" },
        ],
      },
    ],
    quiz: [
      { id: "q01", moduleId: "module-1", question: "What are human rights?", options: ["Privileges earned through education", "Rights that belong to every person because they are human", "Benefits provided only by governments", "Rights available only to citizens"] },
      { id: "q02", moduleId: "module-1", question: "Human rights are based on the principle that every person possesses:", options: ["Political influence", "Equal wealth", "Inherent dignity and worth", "Employment"] },
      { id: "q03", moduleId: "module-1", question: "Which of the following best describes the principle of equality?", options: ["Everyone should be treated exactly the same in every situation.", "Only citizens should receive equal treatment.", "Governments decide who deserves equality.", "Every person should have equal dignity and equal protection under the law without unjustified discrimination."] },
      { id: "q04", moduleId: "module-1", question: "Which characteristic should never justify discrimination?", options: ["Race", "Religion", "Disability", "All of the above"] },
      { id: "q05", moduleId: "module-1", question: "Human rights apply:", options: ["Only during peacetime", "Only to adults", "To every person everywhere", "Only in democratic countries"] },
      { id: "q06", moduleId: "module-1", question: "Human dignity means:", options: ["Only successful people deserve respect.", "Governments determine who has dignity.", "Dignity depends on wealth.", "Every person has inherent worth and deserves respect."] },
      { id: "q07", moduleId: "module-1", question: "Which of the following is an example of respecting another person's human rights?", options: ["Allowing everyone an opportunity to express their views respectfully.", "Refusing services because of nationality.", "Excluding someone because of their religion.", "Preventing people from accessing education."] },
      { id: "q08", moduleId: "module-1", question: "Human rights are often described as universal because they:", options: ["Apply equally to all people.", "Apply only within the United Nations.", "Depend on nationality.", "Change from one country to another."] },
      { id: "q09", moduleId: "module-2", question: "The Universal Declaration of Human Rights was adopted in:", options: ["1919", "1966", "1948", "1945"] },
      { id: "q10", moduleId: "module-2", question: "The Universal Declaration of Human Rights was adopted by:", options: ["European Union", "International Court of Justice", "United Nations General Assembly", "NATO"] },
      { id: "q11", moduleId: "module-2", question: "The Universal Declaration of Human Rights is primarily intended to:", options: ["Govern international trade.", "Create international criminal offences.", "Replace national constitutions.", "Establish a common standard of fundamental rights and freedoms."] },
      { id: "q12", moduleId: "module-2", question: "International human rights treaties help to:", options: ["Eliminate governments.", "Create new countries.", "Replace all national laws.", "Define legal obligations accepted by participating States."] },
      { id: "q13", moduleId: "module-2", question: "Governments that accept human rights obligations are generally expected to:", options: ["Respect, protect and fulfil human rights.", "Protect only citizens.", "Protect only economic rights.", "Ignore international agreements."] },
      { id: "q14", moduleId: "module-2", question: "Which of the following is an example of a civil and political right?", options: ["Right to health", "Freedom of expression", "Right to clean drinking water", "Right to housing"] },
      { id: "q15", moduleId: "module-2", question: "Which of the following is an example of an economic or social right?", options: ["Freedom of assembly", "Right to education", "Right to vote", "Freedom of religion"] },
      { id: "q16", moduleId: "module-2", question: "Why are human rights often described as interconnected?", options: ["Because protecting one right often supports the enjoyment of others.", "Because governments can choose only one right to protect.", "Because only economic rights matter.", "Because rights operate independently of one another."] },
      { id: "q17", moduleId: "module-3", question: "Having human rights also means individuals should:", options: ["Follow only personal interests.", "Prevent others from expressing opinions.", "Ignore community rules.", "Respect the rights of others."] },
      { id: "q18", moduleId: "module-3", question: "Constructive dialogue is important because it:", options: ["Encourages peaceful understanding and problem-solving.", "Guarantees agreement.", "Eliminates disagreement entirely.", "Prevents public participation."] },
      { id: "q19", moduleId: "module-3", question: "Community participation can strengthen human rights by:", options: ["Discouraging cooperation.", "Encouraging people to contribute to decisions affecting their lives.", "Preventing public discussion.", "Limiting access to information."] },
      { id: "q20", moduleId: "module-3", question: "Which action best demonstrates responsible citizenship?", options: ["Ignoring the law.", "Spreading misinformation.", "Respecting others and participating constructively in community life.", "Excluding minority groups."] },
      { id: "q21", moduleId: "module-3", question: "Why is access to accurate information important?", options: ["It prevents public discussion.", "It replaces legal systems.", "It supports informed decisions and meaningful participation.", "It reduces the need for education."] },
      { id: "q22", moduleId: "module-3", question: "Respectful disagreement means:", options: ["Using offensive language.", "Listening to different viewpoints without personal attacks.", "Refusing to hear opposing opinions.", "Preventing discussion."] },
      { id: "q23", moduleId: "module-3", question: "One way individuals can contribute positively to society is by:", options: ["Volunteering in community activities.", "Ignoring community concerns.", "Discriminating against others.", "Preventing participation."] },
      { id: "q24", moduleId: "module-4", question: "Responsible advocacy should be based on:", options: ["Rumours.", "Misinformation.", "Accurate information and respectful communication.", "Personal attacks."] },
      { id: "q25", moduleId: "module-4", question: "Before acting on a human rights concern, it is generally helpful to:", options: ["Ignore differing perspectives.", "Avoid discussion.", "Understand the issue and gather reliable information.", "Assume facts without evidence."] },
      { id: "q26", moduleId: "module-4", question: "Which skill is important when promoting human rights?", options: ["Active listening", "Intimidation", "Exclusion", "Silence"] },
      { id: "q27", moduleId: "module-4", question: "Successful community initiatives often involve:", options: ["Secrecy.", "Conflict.", "Isolation.", "Cooperation and participation."] },
      { id: "q28", moduleId: "module-4", question: "Lifelong learning helps people:", options: ["Replace practical experience entirely.", "Continue improving their knowledge and understanding.", "Avoid learning new information.", "Ignore changing circumstances."] },
      { id: "q29", moduleId: "module-4", question: "Which statement best reflects the purpose of human rights education?", options: ["To encourage political disagreement.", "To help people understand, respect and promote human rights.", "To replace national legal systems.", "To promote only one culture."] },
      { id: "q30", moduleId: "module-4", question: "After completing this course, participants are encouraged to:", options: ["Apply human rights principles respectfully in their daily lives and communities.", "Keep the information private.", "Ignore community issues.", "Avoid further learning."] },
    ],
  },
  {
    id: "human-rights-in-communities",
    title: "Human Rights in Communities: Building Respect, Inclusion and Equality",
    tag: "Communities",
    level: "Beginner",
    duration: "1.5 Hours",
    summary:
      "How communities work, what equality and inclusion mean in practice, how to recognise and prevent discrimination, how to resolve community challenges, and how to build a culture of human rights.",
    description:
      "Human Rights in Communities: Building Respect, Inclusion and Equality looks at how human rights are lived out where people actually meet: neighbourhoods, workplaces, schools and online. You will learn what makes a community and why diversity strengthens it, what equality, inclusion and accessibility require in practice, how to recognise discrimination and harassment and the steps that help prevent them, how constructive dialogue and participation resolve community challenges, and how everyday leadership builds a lasting culture of human rights.",
    outcomes: [
      "Describe what a community is and explain why diversity and social inclusion strengthen it",
      "Explain equality, inclusion and accessibility, and recognise how unconscious bias influences decisions",
      "Recognise discrimination and harassment and identify practical steps to prevent and respond to them",
      "Use constructive dialogue, participation and volunteering to help resolve community challenges",
      "Contribute to a culture of human rights through empathy, respectful challenge and inclusive leadership",
    ],
    passMark: 0.8,
    modules: [
      {
        id: "module-1",
        title: "Understanding Communities",
        description: "What a community is, why diversity and social inclusion matter, and what builds community cohesion.",
        lessons: [
          { id: "module-1-video", title: "Understanding Communities", videoUrl: "https://www.youtube.com/watch?v=oFAmU8Gj7I4" },
        ],
      },
      {
        id: "module-2",
        title: "Equality and Inclusion",
        description: "Equality, inclusion and accessibility in practice, unconscious bias, and respecting cultural diversity.",
        lessons: [
          { id: "module-2-video", title: "Equality and Inclusion", videoUrl: "https://www.youtube.com/watch?v=2l9kIULLRV8" },
        ],
      },
      {
        id: "module-3",
        title: "Preventing Discrimination",
        description: "What discrimination and harassment are, what contributes to them, and how education and fair treatment prevent them.",
        lessons: [
          { id: "module-3-video", title: "Preventing Discrimination", videoUrl: "https://www.youtube.com/watch?v=yrltW1MPA2Y" },
        ],
      },
      {
        id: "module-4",
        title: "Resolving Community Challenges",
        description: "Constructive dialogue, conflict resolution, community participation and the value of volunteering.",
        lessons: [
          { id: "module-4-video", title: "Resolving Community Challenges", videoUrl: "https://www.youtube.com/watch?v=iFCbU1kwRHQ" },
        ],
      },
      {
        id: "module-5",
        title: "Building a Human Rights Culture",
        description: "Everyday respect for dignity, inclusive leadership, challenging stereotypes, and contributing positively to your community.",
        lessons: [
          { id: "module-5-video", title: "Building a Human Rights Culture", videoUrl: "https://www.youtube.com/watch?v=iHMW1jFXjy0" },
        ],
      },
    ],
    quiz: [
      { id: "q01", moduleId: "module-1", question: "A community is best described as:", options: ["Only people who live in the same country", "A group of people connected by location, interests, identity, work, education, or shared experiences", "Only members of one religion", "A political organisation"] },
      { id: "q02", moduleId: "module-1", question: "Healthy communities are strengthened by:", options: ["Cooperation and mutual respect", "Exclusion of minority groups", "Discrimination", "Isolation"] },
      { id: "q03", moduleId: "module-1", question: "Why is diversity valuable within a community?", options: ["It prevents cooperation", "It reduces equality", "It encourages different perspectives, ideas and experiences", "It limits innovation"] },
      { id: "q04", moduleId: "module-1", question: "Social inclusion means:", options: ["Only selected groups can participate", "People should remain separated", "Communities should avoid differences", "Everyone has the opportunity to participate fully in society"] },
      { id: "q05", moduleId: "module-1", question: "Which action best promotes community cohesion?", options: ["Encouraging respectful dialogue among different groups", "Spreading stereotypes", "Ignoring community concerns", "Preventing public participation"] },
      { id: "q06", moduleId: "module-1", question: "Communities benefit when people:", options: ["Refuse to cooperate", "Exclude newcomers", "Respect different backgrounds and viewpoints", "Promote hostility"] },
      { id: "q07", moduleId: "module-1", question: "A person's identity may include:", options: ["Culture", "Language", "Religion", "All of the above"] },
      { id: "q08", moduleId: "module-2", question: "Equality means:", options: ["Everyone must be identical", "Every person deserves equal dignity, respect and protection under the law", "Everyone must have identical opinions", "Governments choose who deserves equality"] },
      { id: "q09", moduleId: "module-2", question: "Inclusion is achieved when:", options: ["Certain groups are excluded", "Only majority opinions matter", "Participation is restricted", "Everyone has opportunities to participate without unjustified barriers"] },
      { id: "q10", moduleId: "module-2", question: "Accessibility helps ensure:", options: ["People with disabilities can participate equally", "Buildings become more expensive", "Fewer people participate", "Only professionals can enter public buildings"] },
      { id: "q11", moduleId: "module-2", question: "Which example demonstrates inclusive behaviour?", options: ["Refusing reasonable adjustments", "Ignoring communication barriers", "Providing information in accessible formats", "Preventing participation"] },
      { id: "q12", moduleId: "module-2", question: "Unconscious bias refers to:", options: ["Criminal behaviour", "Automatic assumptions that may influence decisions without our awareness", "Government policy", "International law"] },
      { id: "q13", moduleId: "module-2", question: "One effective way to reduce bias is to:", options: ["Reflect on personal assumptions and seek diverse perspectives", "Ignore other viewpoints", "Avoid meeting new people", "Depend entirely on stereotypes"] },
      { id: "q14", moduleId: "module-2", question: "Respecting cultural diversity means:", options: ["Rejecting all differences", "Promoting only one culture", "Preventing cultural expression", "Valuing different traditions while respecting universal human dignity"] },
      { id: "q15", moduleId: "module-3", question: "Discrimination occurs when:", options: ["People express opinions respectfully", "Laws are discussed publicly", "A person is treated unfairly because of characteristics such as race, religion, disability or other protected characteristics", "Communities celebrate diversity"] },
      { id: "q16", moduleId: "module-3", question: "Harassment is:", options: ["Friendly discussion", "Unwanted behaviour that creates an intimidating, hostile or offensive environment", "Community volunteering", "Constructive criticism"] },
      { id: "q17", moduleId: "module-3", question: "Which of the following may contribute to discrimination?", options: ["Stereotyping individuals or groups", "Respectful communication", "Inclusive education", "Equal opportunities"] },
      { id: "q18", moduleId: "module-3", question: "Which action can help prevent discrimination?", options: ["Ignoring complaints", "Excluding minorities", "Promoting prejudice", "Providing equal opportunities and fair treatment"] },
      { id: "q19", moduleId: "module-3", question: "If someone experiences discrimination, an appropriate first step may include:", options: ["Remaining silent because nothing can change", "Responding with violence", "Seeking advice through appropriate organisational or legal procedures", "Spreading false information"] },
      { id: "q20", moduleId: "module-3", question: "Education plays an important role in reducing discrimination because it:", options: ["Encourages prejudice", "Increases understanding and awareness", "Creates division", "Prevents cooperation"] },
      { id: "q21", moduleId: "module-3", question: "Respectful workplaces and schools are characterised by:", options: ["Bullying", "Exclusion", "Intimidation", "Fair treatment and equal opportunity"] },
      { id: "q22", moduleId: "module-3", question: "Which statement is most accurate?", options: ["Everyone has a role in creating respectful and inclusive communities.", "Only governments can promote equality.", "Communities cannot influence discrimination.", "Human rights apply only in workplaces."] },
      { id: "q23", moduleId: "module-4", question: "When disagreements occur, constructive dialogue involves:", options: ["Interrupting others", "Refusing compromise", "Listening respectfully and seeking understanding", "Personal attacks"] },
      { id: "q24", moduleId: "module-4", question: "Conflict resolution is most successful when people:", options: ["Ignore concerns", "Focus on solving problems rather than blaming individuals", "Escalate disagreements", "Refuse communication"] },
      { id: "q25", moduleId: "module-4", question: "Community participation helps solve local challenges by:", options: ["Encouraging cooperation and shared responsibility", "Preventing public involvement", "Excluding stakeholders", "Limiting discussion"] },
      { id: "q26", moduleId: "module-4", question: "Volunteering contributes to communities because it:", options: ["Increases inequality", "Reduces cooperation", "Discourages participation", "Supports positive social development"] },
      { id: "q27", moduleId: "module-5", question: "A culture of human rights is strengthened when:", options: ["Communities encourage discrimination", "Only governments discuss human rights", "People consistently respect the dignity and rights of others", "Citizens ignore public issues"] },
      { id: "q28", moduleId: "module-5", question: "Which leadership quality best supports inclusive communities?", options: ["Intolerance", "Empathy", "Prejudice", "Exclusion"] },
      { id: "q29", moduleId: "module-5", question: "One important way individuals can promote equality is by:", options: ["Challenging stereotypes respectfully and supporting inclusion", "Ignoring discrimination", "Excluding others", "Sharing misinformation"] },
      { id: "q30", moduleId: "module-5", question: "After completing this course, learners should be able to:", options: ["Resolve every community dispute independently", "Replace legal institutions", "Promote inclusion, recognise discrimination and contribute positively to their communities", "Eliminate all disagreements"] },
    ],
  },
];

export function getCourse(id: string): Course | undefined {
  return COURSES.find(c => c.id === id);
}

export function allLessons(course: Course): Lesson[] {
  return course.modules.flatMap(m => m.lessons);
}

export function countLessons(course: Course): number {
  return allLessons(course).length;
}

export function hasQuiz(course: Course): boolean {
  return course.quiz.length > 0;
}

/** Accepts a YouTube watch / short / embed URL or a bare ID and returns the 11-char ID, or null. */
export function getYouTubeId(input: string): string | null {
  if (!input) return null;
  const s = input.trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  try {
    const u = new URL(s);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1).split("/")[0] || null;
    if (u.hostname.includes("youtube.com")) {
      if (u.searchParams.get("v")) return u.searchParams.get("v");
      const m = u.pathname.match(/\/(embed|shorts|live)\/([\w-]{11})/);
      if (m) return m[2];
    }
  } catch { /* not a URL */ }
  return null;
}

export function youTubeWatchUrl(input: string): string | null {
  const id = getYouTubeId(input);
  return id ? `https://www.youtube.com/watch?v=${id}` : null;
}
