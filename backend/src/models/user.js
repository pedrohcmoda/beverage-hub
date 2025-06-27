import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function findUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(data) {
  return prisma.user.create({ data });
}

export async function findUserById(id) {
  return prisma.user.findUnique({ where: { id } });
}
