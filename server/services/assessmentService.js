import prisma from "../prisma/prisma.js";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
function tryParseJSON(text) {
  if (!text || typeof text !== "string") return null;
  try { return JSON.parse(text); } catch {}
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first !== -1 && last !== -1 && last > first) {
    try { return JSON.parse(text.slice(first, last + 1)); } catch {}
  }
  const aFirst = text.indexOf("[");
  const aLast = text.lastIndexOf("]");
  if (aFirst !== -1 && aLast !== -1 && aLast > aFirst) {
    try { return JSON.parse(text.slice(aFirst, aLast + 1)); } catch {}
  }
  return null;
}
export const createAssessment = async (userId, category) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  const prompt = `
You are an expert interview coach. Generate exactly 10 **multiple-choice questions** for the category "${category}" aimed at preparing a ${user?.industry ?? "general"} professional.

Each question should have:
- "q": question text
- "options": array of 4 answer options
- "correctIndex": index (0-3) of the correct option

Return STRICT JSON like this:

{
  "questions": [
    {
      "q": "<question text>",
      "options": ["option1", "option2", "option3", "option4"],
      "correctIndex": 0
    }
  ],
  "quizScore": <number 0-100>,
  "improvementTip": "<short tip>"
}

Do NOT include any explanatory text outside JSON.
`;


  const response = await fetch(`${GEMINI_URL}?key=${process.env.API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });

  const result = await response.json().catch(() => null);

  const raw =
    result?.candidates?.[0]?.content?.parts?.[0]?.text ||
    result?.response?.[0]?.candidates?.[0]?.content?.parts?.[0]?.text ||
    result?.output?.[0]?.content?.parts?.[0]?.text ||
    result?.output?.text ||
    (typeof result === "string" ? result : null);

  const parsed = tryParseJSON(raw);
  if (!parsed) throw new Error("Failed to parse AI response.");

  const questions = Array.isArray(parsed.questions) ? parsed.questions : [];
  if (questions.length !== 10) {
    if (questions.length > 0) parsed.questions = questions.slice(0, 10);
    else throw new Error("AI returned invalid questions array");
  }

  const formattedQuestions = parsed.questions.map((q, index) => ({
  qId: index + 1,
  question: q.q,
  options: q.options,         
  correctIndex: q.correctIndex 
}));


  const assessment = await prisma.assessment.create({
    data: {
      userId,
      category,
      quizScore: parsed.quizScore ?? 0,
      questions: formattedQuestions,
      improvementTip: parsed.improvementTip ?? null,
    },
  });

  return assessment;
};
export const getAssessments = async (userId, query) => {
  const {
    page = 1,
    limit = 5,
    search = "",
    category = "",
    sort = "createdAt",
    order = "desc",
  } = query;

  const skip = (Number(page) - 1) * Number(limit);

  const where = { userId };
  if (search) {
    where.OR = [
      { category: { contains: search, mode: "insensitive" } },
      { improvementTip: { contains: search, mode: "insensitive" } },
    ];
  }

  if (category) where.category = category;

  const [assessments, total] = await Promise.all([
    prisma.assessment.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { [sort]: order },
    }),
    prisma.assessment.count({ where }),
  ]);

  return {
    assessments,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit) || 1),
  };
};

export const getAssessmentById = async (id) => {
  const assessment = await prisma.assessment.findUnique({ where: { id } });
  if (!assessment) throw new Error("Assessment not found");
  return assessment;
};

export const updateAssessment = async (id, body) => {
  const data = {};
  if (body.category) data.category = body.category;
  if (body.questions) data.questions = body.questions;
  if (typeof body.quizScore !== "undefined") data.quizScore = body.quizScore;
  if (typeof body.improvementTip !== "undefined") data.improvementTip = body.improvementTip;

  if (Object.keys(data).length === 0) throw new Error("No updatable fields provided");

  const updated = await prisma.assessment.update({
    where: { id },
    data,
  });
  return updated;
};

export const deleteAssessment = async (id) => {
  await prisma.assessment.delete({ where: { id } });
  return true;
};

export const attemptAssessment = async (id, userAnswers) => {
  const assessment = await getAssessmentById(id);
  if (!Array.isArray(assessment.questions)) throw new Error("No questions found");

  let correct = 0;
  const total = assessment.questions.length;
  const details = [];
  const answerMap = {};
  userAnswers.forEach(a => {
    answerMap[a.qId] = a.selectedIndex;
  });

  for (const q of assessment.questions) {
    const correctIndex = q.correctIndex;
    const userIndex = answerMap[q.qId];

    const isCorrect = userIndex === correctIndex;
    if (isCorrect) correct++;

    details.push({
      qId: q.qId,
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      userIndex,
      isCorrect
    });
  }

  const score = total === 0 ? 0 : (correct / total) * 100;
  const improvementTip = score >= 80
    ? "Great job — keep practicing advanced problems."
    : "Review fundamentals and practice similar questions.";

  await prisma.assessment.update({
    where: { id },
    data: { quizScore: score, improvementTip }
  });

  return { score, total, correct, details, improvementTip };
};


