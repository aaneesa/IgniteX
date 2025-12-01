import prisma from "../prisma/prisma.js";

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

function safeSplitIndustry(industryStr) {
  if (!industryStr) return { industryMain: null, specialization: null };
  const parts = industryStr.split(" - ").map(s => s.trim());
  return {
    industryMain: parts[0] || null,
    specialization: parts.slice(1).join(" - ") || parts[1] || parts[0],
  };
}
export const fetchOrGeneratePlan = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, industry: true, skills: true, experience: true, bio: true, isOnboarded: true }
  });

  if (!user || !user.isOnboarded) {
    throw new Error("User not onboarded");
  }

  const existing = await prisma.learningPlan.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });

  if (existing) {
    return existing;
  }
  const { industryMain, specialization } = safeSplitIndustry(user.industry || "");
  const skills = Array.isArray(user.skills) ? user.skills.join(", ") : (user.skills || "Not provided");

  const prompt = `
You are an expert learning advisor. Create a clear 4-week learning plan to make the user job-ready for the role.

User profile:
- Name: ${user.username}
- Industry: ${industryMain || "Not provided"}
- Specialization / Job Role: ${specialization || "Not provided"}
- Experience (years): ${user.experience ?? "Not provided"}
- Skills: ${skills}
- Bio: ${user.bio || "Not provided"}

Output ONLY valid JSON with this exact structure:

{
  "role": "<job role string>",
  "weeks": [
    {
      "week": 1,
      "title": "<title>",
      "tasks": ["task 1", "task 2", ...],
      "resources": [{ "name": "", "url": "" }]
    },
    { "week": 2, ... },
    { "week": 3, ... },
    { "week": 4, ... }
  ]
}
`;

  const res = await fetch(`${GEMINI_URL}?key=${process.env.API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        { parts: [{ text: prompt }] }
      ],
    })
  });

  const result = await res.json();
  const planText = result?.candidates?.[0]?.content?.parts?.[0]?.text || result?.response?.[0]?.candidates?.[0]?.content?.parts?.[0]?.text || result?.output?.[0]?.content?.parts?.[0]?.text;

  if (!planText) {
    console.error("Gemini response full:", JSON.stringify(result));
    throw new Error("No content from Gemini");
  }
    let planJson;
  try {
    planJson = JSON.parse(planText);
  } catch (err) {
    const firstBrace = planText.indexOf("{");
    const lastBrace = planText.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        planJson = JSON.parse(planText.slice(firstBrace, lastBrace + 1));
      } catch (err2) {
        console.error("Failed to parse JSON fallback:", err2);
        throw new Error("AI returned invalid JSON");
      }
    } else {
      console.error("Failed to parse planText:", planText);
      throw new Error("AI returned invalid JSON");
    }
  }
  const saved = await prisma.learningPlan.create({
    data: {
      userId,
      role: planJson.role || specialization || industryMain || "Unknown",
      planJson: JSON.stringify(planJson),
    }
  });

  return saved;
};
