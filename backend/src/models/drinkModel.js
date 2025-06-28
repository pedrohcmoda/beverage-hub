import { prisma } from "../config/db.js";

async function getAllDrinks() {
  return await prisma.drink.findMany({
    include: {
      ingredients: {
        include: { ingredient: true },
      },
      category: true,
      type: true,
    },
  });
}

async function getDrinkById(id) {
  return await prisma.drink.findUnique({
    where: { id },
    include: {
      ingredients: {
        include: { ingredient: true },
      },
      category: true,
      type: true,
    },
  });
}

async function getDrinkByName(name) {
  return await prisma.drink.findMany({
    where: {
      name: {
        contains: name,
        mode: "insensitive",
      },
    },
    include: {
      ingredients: {
        include: { ingredient: true },
      },
      category: true,
      type: true,
    },
  });
}

async function createDrink(data) {
  return await prisma.drink.create({
    data,
    include: {
      ingredients: {
        include: { ingredient: true },
      },
      category: true,
      type: true,
    },
  });
}

async function updateDrink(id, data) {
  return await prisma.drink.update({
    where: { id },
    data,
    include: {
      ingredients: {
        include: { ingredient: true },
      },
      category: true,
      type: true,
    },
  });
}

async function deleteDrink(id) {
  return await prisma.drink.delete({ where: { id } });
}

export { getAllDrinks, getDrinkById, getDrinkByName, createDrink, updateDrink, deleteDrink };
