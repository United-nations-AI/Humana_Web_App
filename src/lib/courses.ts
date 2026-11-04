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
  {
    id: "protecting-human-rights",
    title: "Protecting Human Rights: International Law and Institutions",
    tag: "International Law",
    level: "Beginner",
    duration: "1.5 Hours",
    summary:
      "How human rights are protected in practice: international human rights law, the United Nations mechanisms, national human rights institutions, the rule of law and accountability, and the role of human rights defenders.",
    description:
      "Protecting Human Rights: International Law and Institutions explains the legal framework and the institutions that turn human rights principles into protection. You will learn what international human rights law is and the principles of universality and indivisibility behind it, how the United Nations promotes and monitors human rights through the Human Rights Council, Special Rapporteurs and treaty bodies, what National Human Rights Institutions and independent oversight bodies do, why the rule of law, judicial independence and access to justice matter, and how human rights defenders and partnerships between civil society and public institutions help protect rights for everyone.",
    outcomes: [
      "Explain the purpose of international human rights law, the Universal Declaration and the principles of universality and indivisibility",
      "Describe how the United Nations human rights mechanisms, including treaty monitoring bodies and Special Rapporteurs, promote accountability",
      "Explain the role and independence of National Human Rights Institutions and oversight bodies in protecting rights at home",
      "Understand the rule of law, judicial independence, access to justice and fair hearings as foundations of accountability",
      "Describe how human rights defenders and partnerships between civil society and institutions strengthen protection",
    ],
    passMark: 0.8,
    modules: [
      {
        id: "module-1",
        title: "International Human Rights Law",
        description: "The purpose of international human rights law, the Universal Declaration, treaties, and the principles of universality and indivisibility.",
        lessons: [
          { id: "module-1-video", title: "International Human Rights Law", videoUrl: "https://www.youtube.com/watch?v=2VXNTQhHPM4" },
        ],
      },
      {
        id: "module-2",
        title: "International Human Rights Framework",
        description: "The United Nations, OHCHR, the Human Rights Council, Special Rapporteurs, treaty monitoring bodies and State reporting.",
        lessons: [
          { id: "module-2-video", title: "International Human Rights Framework", videoUrl: "https://www.youtube.com/watch?v=Ka90qXRNeXM" },
        ],
      },
      {
        id: "module-3",
        title: "National Human Rights Institutions",
        description: "What National Human Rights Institutions do, why independence matters, and how public institutions and oversight bodies protect rights.",
        lessons: [
          { id: "module-3-video", title: "National Human Rights Institutions", videoUrl: "https://www.youtube.com/watch?v=jgFk-ex8Dts" },
        ],
      },
      {
        id: "module-4",
        title: "Courts, Justice and Accountability",
        description: "The rule of law, judicial independence, access to justice, fair hearings and why accountability protects human rights.",
        lessons: [
          { id: "module-4-video", title: "Courts, Justice and Accountability", videoUrl: "https://www.youtube.com/watch?v=W6LGX86Fq-o" },
        ],
      },
      {
        id: "module-5",
        title: "Human Rights Defenders",
        description: "Human rights defenders, effective and peaceful advocacy, and partnerships between civil society, communities and public institutions.",
        lessons: [
          { id: "module-5-video", title: "Human Rights Defenders", videoUrl: "https://www.youtube.com/watch?v=zj5MBoCN6o0" },
        ],
      },
    ],
    quiz: [
      { id: "q01", moduleId: "module-1", question: "What is the primary purpose of international human rights law?", options: ["To regulate international trade", "To govern military alliances", "To establish standards for protecting the rights and freedoms of all people", "To replace national constitutions"] },
      { id: "q02", moduleId: "module-1", question: "The Universal Declaration of Human Rights (UDHR) was adopted in:", options: ["1919", "1945", "1948", "1966"] },
      { id: "q03", moduleId: "module-1", question: "The Universal Declaration of Human Rights was adopted by the:", options: ["International Court of Justice", "United Nations General Assembly", "European Parliament", "International Criminal Court"] },
      { id: "q04", moduleId: "module-1", question: "International human rights treaties are designed to:", options: ["Create legally binding obligations for States that choose to become parties to them", "Replace all national laws", "Govern international trade", "Eliminate national courts"] },
      { id: "q05", moduleId: "module-1", question: "Which statement best describes the principle of universality?", options: ["Human rights apply only to citizens.", "Human rights vary according to wealth.", "Human rights apply only in democratic countries.", "Human rights belong equally to every person."] },
      { id: "q06", moduleId: "module-1", question: "Human rights are often described as indivisible because:", options: ["Governments may choose only one category of rights.", "They are intended to be enjoyed together and should not be separated into more or less important rights.", "Only civil rights are important.", "Economic rights can replace political rights."] },
      { id: "q07", moduleId: "module-1", question: "Which category includes the right to education?", options: ["Economic, social and cultural rights", "Military rights", "Commercial rights", "Electoral rights only"] },
      { id: "q08", moduleId: "module-2", question: "Which organisation has the primary global responsibility for promoting international human rights?", options: ["World Trade Organization", "International Monetary Fund", "G7", "United Nations"] },
      { id: "q09", moduleId: "module-2", question: "The Office of the United Nations High Commissioner for Human Rights (OHCHR) primarily works to:", options: ["Conduct military operations", "Manage international trade", "Promote and protect internationally recognised human rights", "Regulate banking"] },
      { id: "q10", moduleId: "module-2", question: "The Human Rights Council is responsible for:", options: ["Promoting dialogue and addressing human rights issues through international cooperation", "Approving national budgets", "Conducting criminal trials", "Supervising elections"] },
      { id: "q11", moduleId: "module-2", question: "A Special Rapporteur is generally:", options: ["A judge of the International Court of Justice", "An independent expert appointed to examine or report on specific human rights themes or country situations", "A government minister", "A police investigator"] },
      { id: "q12", moduleId: "module-2", question: "Treaty monitoring bodies generally:", options: ["Replace domestic courts", "Draft national legislation", "Collect taxes", "Review how participating States implement their treaty obligations"] },
      { id: "q13", moduleId: "module-2", question: "Periodic reporting by States helps to:", options: ["Promote accountability and dialogue regarding treaty implementation", "Replace elections", "Eliminate national governments", "Conduct criminal investigations"] },
      { id: "q14", moduleId: "module-2", question: "International cooperation on human rights is intended to:", options: ["Replace national sovereignty", "Prevent legal reform", "Encourage States to improve respect for human rights through dialogue and shared commitments", "Eliminate domestic institutions"] },
      { id: "q15", moduleId: "module-3", question: "A National Human Rights Institution (NHRI) is generally established to:", options: ["Replace parliament", "Promote and protect human rights within a country", "Manage elections", "Supervise businesses"] },
      { id: "q16", moduleId: "module-3", question: "One important function of many NHRIs is to:", options: ["Control national budgets", "Conduct military operations", "Approve court judgments", "Educate the public about human rights"] },
      { id: "q17", moduleId: "module-3", question: "An independent NHRI is expected to:", options: ["Support only government policies", "Represent private companies", "Operate impartially and independently of improper influence", "Promote one political party"] },
      { id: "q18", moduleId: "module-3", question: "Human rights education is important because it:", options: ["Helps individuals understand their rights and responsibilities", "Eliminates all legal disputes", "Replaces formal education", "Prevents public discussion"] },
      { id: "q19", moduleId: "module-3", question: "Public institutions contribute to protecting human rights by:", options: ["Ignoring complaints", "Acting fairly, transparently and consistently with the law", "Restricting public participation unnecessarily", "Preventing access to information"] },
      { id: "q20", moduleId: "module-3", question: "Which principle strengthens confidence in public institutions?", options: ["Secrecy", "Discrimination", "Exclusion", "Accountability"] },
      { id: "q21", moduleId: "module-3", question: "Independent oversight bodies contribute to good governance by:", options: ["Monitoring compliance with laws and standards", "Replacing courts", "Conducting elections", "Managing political parties"] },
      { id: "q22", moduleId: "module-4", question: "The rule of law means that:", options: ["Governments are above the law", "Laws apply only to citizens", "Everyone, including public authorities, is subject to the law", "Judges create laws without limits"] },
      { id: "q23", moduleId: "module-4", question: "Judicial independence helps ensure that:", options: ["Governments control judicial outcomes", "Courts can make decisions fairly and without improper influence", "Judges follow political instructions", "Courts replace legislatures"] },
      { id: "q24", moduleId: "module-4", question: "Access to justice generally means:", options: ["Only lawyers may use the courts", "Courts should hear only criminal cases", "Legal rights apply only to businesses", "People should have fair opportunities to seek legal remedies through appropriate procedures"] },
      { id: "q25", moduleId: "module-4", question: "A fair hearing generally includes:", options: ["An impartial decision-maker and an opportunity for each party to present their case", "Secret evidence only", "Automatic conviction", "Decisions without explanation"] },
      { id: "q26", moduleId: "module-4", question: "Accountability contributes to human rights protection because it:", options: ["Eliminates judicial review", "Prevents public participation", "Encourages individuals and institutions to act responsibly and answer for their actions", "Reduces transparency"] },
      { id: "q27", moduleId: "module-5", question: "A human rights defender is generally understood to be:", options: ["Only a lawyer", "A person who peacefully promotes or protects human rights", "Only a government official", "Only a judge"] },
      { id: "q28", moduleId: "module-5", question: "Effective human rights advocacy should be based on:", options: ["Personal attacks", "Rumours", "Misinformation", "Accurate information, respect for others and peaceful engagement"] },
      { id: "q29", moduleId: "module-5", question: "Partnerships between civil society, communities and public institutions can:", options: ["Strengthen efforts to promote and protect human rights", "Prevent public participation", "Eliminate independent organisations", "Replace democratic institutions"] },
      { id: "q30", moduleId: "module-5", question: "After completing this course, learners should be able to:", options: ["Replace international courts", "Draft international treaties independently", "Explain the role of international human rights law, institutions and accountability mechanisms in protecting human rights", "Eliminate all human rights violations"] },
    ],
  },
  {
    id: "human-rights-in-the-digital-age",
    code: "DIG",
    title: "Human Rights in the Digital Age: Technology, Privacy and Artificial Intelligence",
    tag: "Digital Rights",
    level: "Beginner",
    duration: "2 Hours",
    summary:
      "Human rights online: digital rights and inclusion, privacy and personal data, ethical and accountable artificial intelligence, online safety and digital citizenship, and the future of rights and technology.",
    description:
      "Human Rights in the Digital Age: Technology, Privacy and Artificial Intelligence examines how human rights apply when life moves online. You will learn what digital rights are and why digital inclusion and literacy matter, how privacy and personal data are protected and how to keep your own information safe, what artificial intelligence is and why fairness, transparency, human oversight and accountability are essential to its responsible use, how to practise safe and respectful digital citizenship and think critically about online information, and how governments, businesses, civil society and individuals can shape technology that respects human rights.",
    outcomes: [
      "Explain what digital rights are and how digital inclusion and digital literacy support human rights",
      "Describe privacy and personal data and apply practical steps such as strong passwords, multi-factor authentication and recognising phishing",
      "Recognise the ethical principles of fairness, transparency, human oversight and accountability in artificial intelligence",
      "Practise responsible digital citizenship, respond appropriately to cyberbullying and verify information before sharing it",
      "Understand how emerging technologies can be developed and used in ways that respect human rights",
    ],
    passMark: 0.8,
    modules: [
      {
        id: "module-1",
        title: "Digital Rights and Human Rights",
        description: "What digital rights are, the right to seek and share information online, digital inclusion, the digital divide and digital literacy.",
        lessons: [
          { id: "module-1-video", title: "Digital Rights and Human Rights", videoUrl: "https://www.youtube.com/watch?v=_cg648Y-wHk" },
        ],
      },
      {
        id: "module-2",
        title: "Privacy and Personal Data",
        description: "Why privacy matters, what counts as personal data, and practical steps to protect your information online.",
        lessons: [
          { id: "module-2-video", title: "Privacy and Personal Data", videoUrl: "https://www.youtube.com/watch?v=aEv0I2sZKek" },
        ],
      },
      {
        id: "module-3",
        title: "Artificial Intelligence and Ethics",
        description: "What artificial intelligence is, and why fairness, transparency, human oversight and accountability matter in its use.",
        lessons: [
          { id: "module-3-video", title: "Artificial Intelligence and Ethics", videoUrl: "https://www.youtube.com/watch?v=UybsD-W2QJU" },
        ],
      },
      {
        id: "module-4",
        title: "Online Safety and Responsible Digital Citizenship",
        description: "Digital citizenship, cyberbullying, reporting harmful behaviour, respectful online communities and critical thinking.",
        lessons: [
          { id: "module-4-video", title: "Online Safety and Responsible Digital Citizenship", videoUrl: "https://www.youtube.com/watch?v=0y9jsq6x1tM" },
        ],
      },
      {
        id: "module-5",
        title: "The Future of Human Rights and Technology",
        description: "Emerging technologies, ethical technology development, collaboration across sectors and digital human rights education.",
        lessons: [
          { id: "module-5-video", title: "The Future of Human Rights and Technology", videoUrl: "https://www.youtube.com/watch?v=qbZ4UNwdaOM" },
        ],
      },
    ],
    quiz: [
      { id: "q01", moduleId: "module-1", question: "Digital rights are best understood as:", options: ["Rights that apply only to technology companies", "Human rights as they apply in digital and online environments", "Rules for buying computers", "Rights that apply only to social media users"] },
      { id: "q02", moduleId: "module-1", question: "Which human right is closely connected to access to information online?", options: ["Right to own a business", "Right to vote in every country", "Right to travel without restrictions", "Freedom to seek, receive and impart information"] },
      { id: "q03", moduleId: "module-1", question: "Digital technologies can support human rights by:", options: ["Improving access to education, healthcare and communication", "Preventing all forms of disagreement", "Eliminating governments", "Replacing legal systems"] },
      { id: "q04", moduleId: "module-1", question: "Which statement best describes digital inclusion?", options: ["Limiting internet access to professionals", "Restricting technology to cities", "Ensuring everyone has fair opportunities to access and use digital technologies", "Providing internet only to adults"] },
      { id: "q05", moduleId: "module-1", question: "Which factor may contribute to the digital divide?", options: ["Universal internet access", "Unequal access to technology and internet services", "Equal educational opportunities", "Public libraries"] },
      { id: "q06", moduleId: "module-1", question: "Why is digital literacy important?", options: ["It replaces formal education", "It eliminates cybercrime", "It guarantees internet access", "It helps people use technology safely, responsibly and effectively"] },
      { id: "q07", moduleId: "module-2", question: "Privacy is important because it:", options: ["Helps protect personal autonomy, dignity and personal information", "Prevents communication", "Eliminates technology", "Restricts education"] },
      { id: "q08", moduleId: "module-2", question: "Personal data includes:", options: ["Public weather reports", "Television programmes", "Information that identifies or relates to an individual", "Newspaper advertisements"] },
      { id: "q09", moduleId: "module-2", question: "Which of the following is an example of personal data?", options: ["Today's weather forecast", "A country's population", "A public holiday calendar", "Full name and email address"] },
      { id: "q10", moduleId: "module-2", question: "One way to improve online privacy is to:", options: ["Share passwords with friends", "Use strong, unique passwords and enable multi-factor authentication where available", "Use the same password for every account", "Ignore software updates"] },
      { id: "q11", moduleId: "module-2", question: "Phishing is:", options: ["A fraudulent attempt to obtain sensitive information by pretending to be a trusted source", "A software update", "A search engine", "A type of internet connection"] },
      { id: "q12", moduleId: "module-2", question: "Before sharing personal information online, it is generally advisable to:", options: ["Share everything publicly", "Ignore privacy policies", "Consider whether sharing is necessary and review privacy settings", "Accept every request without checking"] },
      { id: "q13", moduleId: "module-3", question: "Artificial Intelligence (AI) refers to:", options: ["Every type of computer software", "Internet connections", "Mobile phone networks", "Computer systems designed to perform tasks that normally require human intelligence"] },
      { id: "q14", moduleId: "module-3", question: "Why is fairness important in AI?", options: ["AI should favour certain groups", "AI systems should avoid unjustified discrimination and treat people equitably", "AI should ignore evidence", "Fairness is not relevant to AI"] },
      { id: "q15", moduleId: "module-3", question: "Transparency in AI means:", options: ["Keeping all AI decisions secret", "Preventing public understanding", "Providing appropriate information about how AI systems operate and are used", "Eliminating human oversight"] },
      { id: "q16", moduleId: "module-3", question: "Human oversight of AI is important because:", options: ["People remain responsible for decisions and can review AI-assisted outcomes", "AI should always replace human judgement", "Computers should make every important decision independently", "Human involvement is unnecessary"] },
      { id: "q17", moduleId: "module-3", question: "Which principle supports responsible AI development?", options: ["Secrecy", "Discrimination", "Exclusion", "Accountability"] },
      { id: "q18", moduleId: "module-3", question: "An organisation using AI responsibly should:", options: ["Regularly review systems for accuracy, fairness and appropriate safeguards", "Ignore possible errors", "Avoid testing AI systems", "Never explain AI use"] },
      { id: "q19", moduleId: "module-4", question: "Digital citizenship involves:", options: ["Spending as much time online as possible", "Sharing all personal information", "Using digital technologies responsibly, ethically and respectfully", "Ignoring online safety"] },
      { id: "q20", moduleId: "module-4", question: "Cyberbullying is:", options: ["Friendly online discussion", "The use of digital technologies to intimidate, harass or harm others", "Educational gaming", "A cybersecurity programme"] },
      { id: "q21", moduleId: "module-4", question: "If you encounter harmful online behaviour, an appropriate response may include:", options: ["Reporting the behaviour through the platform's reporting tools and seeking support if needed", "Sharing harmful content further", "Responding with abuse", "Ignoring serious threats in all circumstances"] },
      { id: "q22", moduleId: "module-4", question: "Which practice helps create respectful online communities?", options: ["Posting abusive comments", "Sharing false information intentionally", "Encouraging harassment", "Communicating courteously and respecting different viewpoints"] },
      { id: "q23", moduleId: "module-4", question: "Critical thinking online involves:", options: ["Believing everything immediately", "Ignoring evidence", "Evaluating information carefully before accepting or sharing it", "Sharing information without reading it"] },
      { id: "q24", moduleId: "module-4", question: "Why is it important to verify information before sharing it?", options: ["To slow internet speeds", "To reduce the spread of inaccurate or misleading information", "To prevent communication", "To avoid learning new information"] },
      { id: "q25", moduleId: "module-5", question: "Emerging technologies create opportunities by:", options: ["Supporting innovation while requiring careful consideration of ethical and human rights impacts", "Eliminating the need for human judgement", "Preventing education", "Replacing democratic institutions"] },
      { id: "q26", moduleId: "module-5", question: "Ethical technology development should include:", options: ["Ignoring privacy", "Avoiding public consultation", "Eliminating regulation", "Respect for human rights, fairness, accountability and transparency"] },
      { id: "q27", moduleId: "module-5", question: "Collaboration between governments, businesses and civil society can help:", options: ["Prevent innovation", "Promote responsible technology and protect human rights", "Eliminate education", "Restrict communication unnecessarily"] },
      { id: "q28", moduleId: "module-5", question: "Individuals contribute to a safer digital environment by:", options: ["Sharing passwords", "Ignoring online security", "Protecting their personal information, respecting others and reporting harmful behaviour", "Promoting misinformation"] },
      { id: "q29", moduleId: "module-5", question: "One important goal of digital human rights education is to:", options: ["Help people understand both the opportunities and responsibilities of using technology", "Prevent technological development", "Replace digital innovation", "Eliminate online communication"] },
      { id: "q30", moduleId: "module-5", question: "After completing this course, learners should be able to:", options: ["Build advanced AI systems independently", "Eliminate all cybercrime", "Use digital technologies responsibly, understand privacy principles, recognise ethical issues in AI and contribute to safer online communities", "Replace national cybersecurity agencies"] },
    ],
  },
  {
    id: "human-rights-leadership",
    code: "LEAD",
    title: "Human Rights Leadership: Advocacy, Communication and Positive Change",
    tag: "Leadership",
    level: "Beginner",
    duration: "2.5 Hours",
    summary:
      "Leading for human rights: the principles of ethical leadership, communication and public engagement, evidence-based advocacy, community project planning, and creating change that lasts.",
    description:
      "Human Rights Leadership: Advocacy, Communication and Positive Change develops the skills to lead others in promoting human dignity, equality and justice. You will learn the principles and qualities of human rights leadership, including integrity, trust and empathy, how to communicate clearly, listen actively and engage the public constructively, how to plan evidence-based advocacy that identifies the issue, the objectives and the stakeholders, how to plan, monitor and evaluate community projects with volunteers and partners, and how accountability, reflective practice and mentoring create sustainable positive change.",
    outcomes: [
      "Describe the qualities of a human rights leader, including integrity, trust, empathy and inclusive decision-making",
      "Communicate clearly, listen actively, present reliable evidence and engage the public respectfully",
      "Plan evidence-based advocacy by identifying the issue, objectives, audience and stakeholders and collaborating with others",
      "Plan a community project with clear, measurable objectives and monitor and evaluate its progress",
      "Sustain positive change through accountability, reflective practice and mentoring future leaders",
    ],
    passMark: 0.8,
    modules: [
      {
        id: "module-1",
        title: "Principles of Human Rights Leadership",
        description: "What a human rights leader is, and the qualities of integrity, trust, empathy and inclusive decision-making.",
        lessons: [
          { id: "module-1-video", title: "Principles of Human Rights Leadership", videoUrl: "https://www.youtube.com/watch?v=daM83TkoJJw" },
        ],
      },
      {
        id: "module-2",
        title: "Communication and Public Engagement",
        description: "Listening before responding, active listening, clear communication, reliable evidence and respectful dialogue.",
        lessons: [
          { id: "module-2-video", title: "Communication and Public Engagement", videoUrl: "https://www.youtube.com/watch?v=4rWtnHmCbjY" },
        ],
      },
      {
        id: "module-3",
        title: "Advocacy and Influencing Change",
        description: "What advocacy is, planning an initiative, evidence-based advocacy, stakeholders, awareness campaigns and collaboration.",
        lessons: [
          { id: "module-3-video", title: "Advocacy and Influencing Change", videoUrl: "https://www.youtube.com/watch?v=QKdNbqRubys" },
        ],
      },
      {
        id: "module-4",
        title: "Project Planning and Community Leadership",
        description: "Assessing needs, measurable objectives, volunteers, partnerships, and monitoring and evaluating a project.",
        lessons: [
          { id: "module-4-video", title: "Project Planning and Community Leadership", videoUrl: "https://www.youtube.com/watch?v=SUj5qzh7o7k" },
        ],
      },
      {
        id: "module-5",
        title: "Creating Sustainable Positive Change",
        description: "Lasting change through participation, leadership accountability, reflective practice and mentoring future leaders.",
        lessons: [
          { id: "module-5-video", title: "Creating Sustainable Positive Change", videoUrl: "https://www.youtube.com/watch?v=7xqu7Z1L0Xg" },
        ],
      },
    ],
    quiz: [
      { id: "q01", moduleId: "module-1", question: "A human rights leader is best described as someone who:", options: ["Makes decisions without consulting others", "Supports only one group of people", "Uses influence to promote respect for human dignity, equality and justice", "Exercises authority without accountability"] },
      { id: "q02", moduleId: "module-1", question: "An important quality of effective leadership is:", options: ["Integrity", "Intimidation", "Favouritism", "Secrecy"] },
      { id: "q03", moduleId: "module-1", question: "Integrity means:", options: ["Winning every argument", "Following public opinion regardless of the facts", "Never admitting mistakes", "Acting honestly, ethically and consistently with your values"] },
      { id: "q04", moduleId: "module-1", question: "Which leadership skill helps build trust?", options: ["Ignoring feedback", "Keeping promises and communicating honestly", "Sharing confidential information unnecessarily", "Refusing to cooperate"] },
      { id: "q05", moduleId: "module-1", question: "Empathy is the ability to:", options: ["Persuade others through pressure", "Ignore different viewpoints", "Understand and appreciate another person's perspective and experiences", "Avoid communication"] },
      { id: "q06", moduleId: "module-1", question: "Human rights leaders should encourage:", options: ["Respectful participation and inclusive decision-making", "Discrimination", "Intimidation", "Exclusion"] },
      { id: "q07", moduleId: "module-2", question: "Effective communication begins with:", options: ["Speaking without preparation", "Listening carefully before responding", "Ignoring questions", "Interrupting others"] },
      { id: "q08", moduleId: "module-2", question: "Active listening involves:", options: ["Waiting only for your turn to speak", "Ignoring opposing opinions", "Changing the subject", "Paying attention, asking clarifying questions and responding respectfully"] },
      { id: "q09", moduleId: "module-2", question: "Clear communication is important because it:", options: ["Helps people understand information accurately", "Prevents cooperation", "Creates unnecessary confusion", "Discourages participation"] },
      { id: "q10", moduleId: "module-2", question: "When presenting evidence, it is important to:", options: ["Depend on rumours", "Ignore conflicting information", "Use reliable, accurate and verifiable sources", "Present opinions as facts"] },
      { id: "q11", moduleId: "module-2", question: "Respectful dialogue is strengthened by:", options: ["Personal attacks", "Insults", "Refusing discussion", "Remaining courteous even when opinions differ"] },
      { id: "q12", moduleId: "module-2", question: "Constructive public engagement aims to:", options: ["Prevent public involvement", "Encourage participation and informed discussion", "Silence differing opinions", "Promote conflict"] },
      { id: "q13", moduleId: "module-3", question: "Advocacy is best described as:", options: ["Activities intended to raise awareness and encourage positive change using lawful and peaceful means", "Forcing others to agree", "Winning political elections", "Controlling public opinion"] },
      { id: "q14", moduleId: "module-3", question: "Before beginning an advocacy initiative, it is helpful to:", options: ["Begin campaigning without planning", "Ignore evidence", "Clearly identify the issue, objectives and intended audience", "Avoid consulting others"] },
      { id: "q15", moduleId: "module-3", question: "Evidence-based advocacy relies primarily on:", options: ["Personal rumours", "Reliable information, research and documented facts", "Speculation", "Emotional reactions alone"] },
      { id: "q16", moduleId: "module-3", question: "Why is identifying stakeholders important?", options: ["It replaces evidence", "It guarantees agreement", "It eliminates differing opinions", "It helps understand who may be affected or able to contribute to solutions"] },
      { id: "q17", moduleId: "module-3", question: "Which communication method is often effective for increasing public awareness?", options: ["Educational campaigns using accurate and accessible information", "Spreading misinformation", "Personal attacks", "Anonymous rumours"] },
      { id: "q18", moduleId: "module-3", question: "Successful advocacy initiatives are often strengthened by:", options: ["Working in complete isolation", "Ignoring local knowledge", "Collaboration with communities and organisations", "Discouraging participation"] },
      { id: "q19", moduleId: "module-4", question: "A well-planned community project usually begins with:", options: ["Spending resources immediately", "Ignoring local priorities", "Avoiding consultation", "Assessing community needs and setting clear objectives"] },
      { id: "q20", moduleId: "module-4", question: "Setting measurable objectives helps because it:", options: ["Prevents planning", "Makes progress easier to monitor and evaluate", "Eliminates cooperation", "Makes projects more complicated"] },
      { id: "q21", moduleId: "module-4", question: "Volunteers contribute to community initiatives by:", options: ["Preventing participation", "Replacing public institutions", "Sharing their time, skills and experience", "Ignoring community needs"] },
      { id: "q22", moduleId: "module-4", question: "Partnerships between organisations can:", options: ["Increase knowledge, resources and effectiveness", "Reduce cooperation", "Prevent innovation", "Eliminate accountability"] },
      { id: "q23", moduleId: "module-4", question: "Monitoring a project helps to:", options: ["Prevent evaluation", "Assess progress and identify areas for improvement", "Avoid accountability", "Ignore outcomes"] },
      { id: "q24", moduleId: "module-4", question: "Evaluation is important because it:", options: ["Guarantees future funding", "Removes the need for planning", "Prevents public participation", "Helps determine whether project objectives have been achieved and identifies lessons for future improvement"] },
      { id: "q25", moduleId: "module-5", question: "Long-term positive change is more likely when:", options: ["Communities participate actively and initiatives are regularly reviewed", "Projects are never evaluated", "Communication is avoided", "Only one individual makes decisions"] },
      { id: "q26", moduleId: "module-5", question: "Leadership accountability means:", options: ["Avoiding questions", "Never admitting mistakes", "Accepting responsibility for decisions and actions and being open to appropriate scrutiny", "Ignoring feedback"] },
      { id: "q27", moduleId: "module-5", question: "Reflective practice helps leaders by:", options: ["Preventing learning", "Avoiding feedback", "Eliminating teamwork", "Encouraging them to learn from experience and improve future decisions"] },
      { id: "q28", moduleId: "module-5", question: "Mentoring future leaders contributes to:", options: ["Reducing knowledge sharing", "Building long-term organisational capacity and continuity", "Limiting opportunities for others", "Preventing innovation"] },
      { id: "q29", moduleId: "module-5", question: "Which statement best reflects responsible human rights leadership?", options: ["Promoting human dignity through ethical conduct, evidence-based advocacy and respectful engagement", "Using intimidation to influence others", "Ignoring community concerns", "Sharing unverified information"] },
      { id: "q30", moduleId: "module-5", question: "After completing this course, participants should be able to:", options: ["Resolve every human rights challenge independently", "Replace public institutions", "Demonstrate leadership skills that support ethical advocacy, effective communication, collaborative project management and sustainable community engagement", "Guarantee that every advocacy initiative will succeed"] },
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
