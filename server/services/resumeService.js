import prisma from "../prisma/prisma.js";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
export const getResumeByUserId = async (userId) => {
  return await prisma.resume.findUnique({
    where: { userId },
  });
};
export const createResume = async (userId, content) => {
  return await prisma.resume.create({
    data: { userId, content: JSON.stringify(content) },
  });
};
export const updateResumeByUserId = async (userId, content) => {
  const existing = await getResumeByUserId(userId);
  if (!existing) throw new Error("Resume not found");

  return await prisma.resume.update({
    where: { id: existing.id },
    data: { content: JSON.stringify(content) },
  });
};
export const deleteResumeByUserId = async (userId) => {
  const existing = await getResumeByUserId(userId);
  if (!existing) throw new Error("Resume not found");

  await prisma.resume.delete({ where: { id: existing.id } });
  return true;
};
export const improveResumeAI = async (userId, current, type) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const prompt = `
As an expert resume writer, improve the following ${type} description for a ${user.industry} professional.
Make it impactful, quantifiable, aligned with industry standards.

Current content:
${current}

Requirements:
1. Use action verbs
2. Add metrics/results
3. Highlight relevant technical skills
4. Keep it concise but detailed
5. Use industry-specific keywords
6. Output only the optimized text.
`;

  const response = await fetch(`${GEMINI_URL}?key=${process.env.API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });

  const result = await response.json();

  const aiText =
    result?.candidates?.[0]?.content?.parts?.[0]?.text ||
    result?.response?.[0]?.candidates?.[0]?.content?.parts?.[0]?.text ||
    result?.output?.[0]?.content?.parts?.[0]?.text;

  if (!aiText) throw new Error("Gemini returned no content");
  return aiText.trim();
};
