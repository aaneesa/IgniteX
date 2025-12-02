import prisma from "../prisma/prisma.js";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

// AI Resume Improvement
export const improveResumeAI = async (userId, current, type) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const prompt = `
As an expert resume writer, improve the following ${type} description for a ${user.industry} professional.
Make it more impactful, quantifiable, and aligned with industry standards.

Current content:
${current}

Requirements:
1. Use action verbs
2. Add metrics/results
3. Highlight relevant technical skills
4. Keep it concise but detailed
5. Use industry-specific keywords
6. Output only the optimized text. No explanation.
`;

  const response = await fetch(`${GEMINI_URL}?key=${process.env.API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  const result = await response.json();

  const aiText =
    result?.candidates?.[0]?.content?.parts?.[0]?.text ||
    result?.response?.[0]?.candidates?.[0]?.content?.parts?.[0]?.text ||
    result?.output?.[0]?.content?.parts?.[0]?.text;

  if (!aiText) throw new Error("Gemini returned no content");

  return aiText.trim();
};

// Create resume
export const createResume = async (userId, content) => {
  const resume = await prisma.resume.create({
    data: {
      userId,
      content: JSON.stringify(content),
    },
  });

  return resume;
};

// Get all resumes
export const getAllResumes = async ({ page = 1, limit = 10, search = "", sort = "createdAt" }) => {
  const skip = (page - 1) * limit;

  const where = search
    ? { content: { contains: search, mode: "insensitive" } }
    : {};

  const resumes = await prisma.resume.findMany({
    where,
    skip,
    take: limit,
    orderBy: { [sort]: "desc" },
  });

  const total = await prisma.resume.count({ where });

  return { resumes, total };
};

// Get resume by ID
export const getResumeById = async (resumeId) => {
  const resume = await prisma.resume.findUnique({
    where: { id: resumeId.toString() },
  });

  if (!resume) throw new Error("Resume not found");
  return resume;
};

// Update resume
export const updateResume = async (resumeId, content) => {
  return await prisma.resume.update({
    where: { id: resumeId.toString() },
    data: { content: JSON.stringify(content) },
  });
};

// Delete resume
export const deleteResume = async (resumeId) => {
  await prisma.resume.delete({ where: { id: resumeId.toString() } });
  return true;
};
