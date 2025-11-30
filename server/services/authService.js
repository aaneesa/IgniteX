import bcrypt from "bcryptjs";
import prisma from "../prisma/prisma.js";
import { generateToken } from "../jwt.js";

export const registerUser = async ({ username, email, password }) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { username, email, password: hashedPassword },
  });

  const token = generateToken(user);

  return { user, token };
};

export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid email or password");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Invalid email or password");

  const token = generateToken(user);

  return { user, token };
};
