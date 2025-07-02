import express from "express";
import {
  getAllIngredients,
  getIngredientById,
  createIngredient,
  updateIngredient,
  deleteIngredient,
} from "../models/ingredientModel.js";
import { authenticateJWT } from "../config/auth.js";
import { cache } from "../config/cache.js";

const router = express.Router();

router.get("/", authenticateJWT, async (req, res) => {
  try {
    const cached = cache.get("ingredients");
    if (cached) return res.json(cached);
    const ingredients = await getAllIngredients();
    cache.set("ingredients", ingredients);
    res.json(ingredients);
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", authenticateJWT, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: "Ingredient ID must be a valid number." });
    }
    const cached = cache.get(`ingredient_${id}`);
    if (cached) return res.json(cached);
    const ingredient = await getIngredientById(id);
    if (!ingredient) return res.status(404).json({ error: "Ingredient not found" });
    cache.set(`ingredient_${id}`, ingredient);
    res.json(ingredient);
  } catch (error) {
    console.error("Error fetching ingredient:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", authenticateJWT, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({ error: "Ingredient name is required and must be valid text." });
    }
    if (name.trim().length > 100) {
      return res.status(400).json({ error: "Ingredient name must have at most 100 characters." });
    }
    const newIngredient = await createIngredient({ name: name.trim() });
    cache.del("ingredients");  
    res.status(201).json(newIngredient);
  } catch (error) {
    console.error("Error creating ingredient:", error);
    if (error.code === "P2002") {
      return res.status(409).json({ error: "An ingredient with this name already exists." });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", authenticateJWT, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: "Ingredient ID must be a valid number." });
    }
    const { name } = req.body;
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({ error: "Ingredient name is required and must be valid text." });
    }
    if (name.trim().length > 100) {
      return res.status(400).json({ error: "Ingredient name must have at most 100 characters." });
    }
    const updatedIngredient = await updateIngredient(id, { name: name.trim() });
    cache.del("ingredients");  
    cache.del(`ingredient_${id}`);
    res.json(updatedIngredient);
  } catch (error) {
    console.error("Error updating ingredient:", error);
    if (error.code === "P2002") {
      return res.status(409).json({ error: "An ingredient with this name already exists." });
    }
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Ingredient not found." });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    await deleteIngredient(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting ingredient:", error);
    if (error.code === "P2003") {
      return res
        .status(400)
        .json({
          error: "Cannot delete ingredient because it is being used in some drink.",
        });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
