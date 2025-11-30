import prisma from "../prisma/prisma.js";
export const saveContactMessage = async ({name, email, message}) => {
  try {
    const newMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        message,
      },
    });
    return newMessage;
  } catch (error) {
    console.error("Error saving contact message:", error);
    throw new Error("Could not save contact message");
  }
};