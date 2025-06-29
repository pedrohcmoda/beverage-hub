import express from "express";
import {
  getAllDrinks,
  getDrinkById,
  getDrinkByName,
  createDrink,
  updateDrink,
  deleteDrink,
  getRandomDrink,
} from "../models/drinkModel.js";
import upload from "../config/upload.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const drinks = await getAllDrinks();
    res.json(drinks);
  } catch (error) {
    console.error("Error fetching drinks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/random", async (req, res) => {
  try {
    const randomDrink = await getRandomDrink();
    res.json(randomDrink);
  } catch (error) {
    console.error("Error fetching drinks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const drink = await getDrinkById(parseInt(req.params.id));
    if (!drink) return res.status(404).json({ error: "Drink not found" });
    res.json(drink);
  } catch (error) {
    console.error("Error fetching drink:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/name/:name", async (req, res) => {
  try {
    const drink = await getDrinkByName(req.params.name);
    if (!drink) return res.status(404).json({ error: "Drink not found" });
    res.json(drink);
  } catch (error) {
    console.error("Error fetching drink:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Nenhuma imagem enviada." });
  }
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const drinkData = req.body;
    if (req.body["ingredients[0][ingredientId]"]) {
      const ingredients = [];
      let idx = 0;
      while (req.body[`ingredients[${idx}][ingredientId]`]) {
        ingredients.push({
          ingredientId: req.body[`ingredients[${idx}][ingredientId]`],
          amount: req.body[`ingredients[${idx}][amount]`] || "",
        });
        idx++;
      }
      drinkData.ingredients = ingredients;
    }
    if (req.file) {
      drinkData.image = `/uploads/${req.file.filename}`;
    }
    const newDrink = await createDrink(drinkData);
    res.status(201).json(newDrink);
  } catch (error) {
    console.error("Error creating drink:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const drinkData = req.body;
    if (req.body["ingredients[0][ingredientId]"]) {
      const ingredients = [];
      let idx = 0;
      while (req.body[`ingredients[${idx}][ingredientId]`]) {
        ingredients.push({
          ingredientId: req.body[`ingredients[${idx}][ingredientId]`],
          amount: req.body[`ingredients[${idx}][amount]`] || "",
        });
        idx++;
      }
      drinkData.ingredients = ingredients;
    }
    if (req.file) {
      drinkData.image = `/uploads/${req.file.filename}`;
    }
    const updatedDrink = await updateDrink(parseInt(req.params.id), drinkData);
    res.json(updatedDrink);
  } catch (error) {
    console.error("Error updating drink:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await deleteDrink(parseInt(req.params.id));
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting drink:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
