import prisma from "../prisma";

export async function updateOnboardingService(userId, data) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error("User not found");
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      industry: data.industry,
      experience: data.experience,
      bio: data.bio,
      skills: data.skills,
      isOnboarded: true,
    },
  });

  return updatedUser;
}

export async function getOnboardingStatusService(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isOnboarded: true },
  });

  if (!user) throw new Error("User not found");

  return { isOnboarded: user.isOnboarded };
}
