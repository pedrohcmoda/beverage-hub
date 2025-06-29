import { prisma } from "../config/db.js";

async function getAllIngredients() {
  return await prisma.ingredient.findMany({});
}

async function getIngredientById(id) {
  return await prisma.ingredient.findUnique({
    where: { id },
    include: {
      drinks: true,
    },
  });
}

async function createIngredient(data) {
  return await prisma.ingredient.create({
    data,
    include: {
      drinks: true,
    },
  });
}

async function updateIngredient(id, data) {
  return await prisma.ingredient.update({
    where: { id },
    data,
    include: {
      drinks: true,
    },
  });
}

async function deleteIngredient(id) {
  return await prisma.ingredient.delete({ where: { id } });
}

export {
  getAllIngredients,
  getIngredientById,
  createIngredient,
  updateIngredient,
  deleteIngredient,
};