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

router.post("/", async (req, res) => {
  try {
    const newDrink = await createDrink(req.body);
    res.status(201).json(newDrink);
  } catch (error) {
    console.error("Error creating drink:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedDrink = await updateDrink(parseInt(req.params.id), req.body);
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
