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
  const newDrink = await prisma.drink.create({
    data: {
      name: data.name,
      instructions: data.instructions,
      image: data.image,
      categoryId: parseInt(data.categoryId),
      typeId: data.typeId ? parseInt(data.typeId) : undefined,
    },
  });

  if (Array.isArray(data.ingredients)) {
    for (const ing of data.ingredients) {
      await prisma.drinkIngredient.create({
        data: {
          drinkId: newDrink.id,
          ingredientId: ing.ingredientId,
          amount: ing.amount,
        },
      });
    }
  }

  return await prisma.drink.findUnique({
    where: { id: newDrink.id },
    include: {
      ingredients: { include: { ingredient: true } },
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

async function getRandomDrink() {
  const count = await prisma.drink.count();
  if (count === 0) return null;

  const randomIndex = Math.floor(Math.random() * count);

  const [randomDrink] = await prisma.drink.findMany({
    skip: randomIndex,
    take: 1,
    include: {
      ingredients: { include: { ingredient: true } },
      category: true,
      type: true,
    },
  });

  return randomDrink || null;
}

export { getAllDrinks, getDrinkById, getDrinkByName, createDrink, updateDrink, deleteDrink, getRandomDrink };
