import { prisma } from "../config/db.js";

async function getAllCategories() {
  return await prisma.category.findMany({});
}

async function getCategoryById(id) {
  return await prisma.category.findUnique({
    where: { id },
    include: {
      drinks: true,
    },
  });
}

async function createCategory(data) {
  return await prisma.category.create({
    data,
    include: {
      drinks: true,
    },
  });
}

async function updateCategory(id, data) {
  return await prisma.category.update({
    where: { id },
    data,
    include: {
      drinks: true,
    },
  });
}

async function deleteCategory(id) {
  return await prisma.category.delete({ where: { id } });
}

export { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
