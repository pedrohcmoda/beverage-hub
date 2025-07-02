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
import { authenticateJWT } from "../config/auth.js";
import { cache } from "../config/cache.js";

const router = express.Router();

router.get("/", authenticateJWT, async (req, res) => {
  try {
    const cached = cache.get("drinks");
    if (cached) return res.json(cached);
    const drinks = await getAllDrinks();
    cache.set("drinks", drinks);
    res.json(drinks);
  } catch (error) {
    console.error("Error fetching drinks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/random", authenticateJWT, async (req, res) => {
  try {
    const randomDrink = await getRandomDrink();
    res.json(randomDrink);
  } catch (error) {
    console.error("Error fetching drinks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", authenticateJWT, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const cached = cache.get(`drink_${id}`);
    if (cached) return res.json(cached);
    const drink = await getDrinkById(id);
    if (!drink) return res.status(404).json({ error: "Drink not found" });
    cache.set(`drink_${id}`, drink);
    res.json(drink);
  } catch (error) {
    console.error("Error fetching drink:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/name/:name", authenticateJWT, async (req, res) => {
  try {
    const drink = await getDrinkByName(req.params.name);
    if (!drink) return res.status(404).json({ error: "Drink not found" });
    res.json(drink);
  } catch (error) {
    console.error("Error fetching drink:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/upload", authenticateJWT, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Nenhuma imagem enviada." });
  }
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

router.post("/", authenticateJWT, upload.single("image"), async (req, res) => {
  try {
    const drinkData = req.body;
    if (!drinkData.name || typeof drinkData.name !== "string" || drinkData.name.trim().length === 0) {
      return res.status(400).json({ error: "Nome do drink é obrigatório e deve ser um texto válido." });
    }
    if (drinkData.name.trim().length > 200) {
      return res.status(400).json({ error: "Nome do drink deve ter no máximo 200 caracteres." });
    }
    if (!drinkData.categoryId) {
      return res.status(400).json({ error: "Categoria é obrigatória." });
    }
    const categoryId = parseInt(drinkData.categoryId);
    if (isNaN(categoryId) || categoryId <= 0) {
      return res.status(400).json({ error: "ID da categoria deve ser um número válido." });
    }
    if (drinkData.instructions && typeof drinkData.instructions === "string" && drinkData.instructions.trim().length > 1000) {
      return res.status(400).json({ error: "Instruções devem ter no máximo 1000 caracteres." });
    }
    if (drinkData.alcoholType && !["ALCOOLICO", "NAO_ALCOOLICO"].includes(drinkData.alcoholType)) {
      return res.status(400).json({ error: "Tipo de álcool deve ser ALCOOLICO ou NAO_ALCOOLICO." });
    }
    
    drinkData.name = drinkData.name.trim();
    drinkData.categoryId = categoryId;
    if (drinkData.instructions) drinkData.instructions = drinkData.instructions.trim();
    
    if (req.body["ingredients[0][ingredientId]"]) {
      const ingredients = [];
      let idx = 0;
      while (req.body[`ingredients[${idx}][ingredientId]`]) {
        const ingredientId = parseInt(req.body[`ingredients[${idx}][ingredientId]`]);
        const amount = req.body[`ingredients[${idx}][amount]`] || "";
        
        if (isNaN(ingredientId) || ingredientId <= 0) {
          return res.status(400).json({ error: `Ingrediente ${idx + 1}: ID deve ser um número válido.` });
        }
        if (amount && amount.length > 50) {
          return res.status(400).json({ error: `Ingrediente ${idx + 1}: Quantidade deve ter no máximo 50 caracteres.` });
        }
        
        ingredients.push({
          ingredientId,
          amount: amount.trim(),
        });
        idx++;
      }
      drinkData.ingredients = ingredients;
    }
    
    if (req.file) {
      drinkData.image = `/uploads/${req.file.filename}`;
    }
    const newDrink = await createDrink(drinkData);
    cache.del("drinks");  
    res.status(201).json(newDrink);
  } catch (error) {
    console.error("Error creating drink:", error);
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Já existe um drink com este nome." });
    }
    if (error.code === "P2003") {
      return res.status(400).json({ error: "Categoria ou ingrediente inválido." });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", authenticateJWT, upload.single("image"), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: "ID do drink deve ser um número válido." });
    }
    
    const drinkData = req.body;
    if (!drinkData.name || typeof drinkData.name !== "string" || drinkData.name.trim().length === 0) {
      return res.status(400).json({ error: "Nome do drink é obrigatório e deve ser um texto válido." });
    }
    if (drinkData.name.trim().length > 200) {
      return res.status(400).json({ error: "Nome do drink deve ter no máximo 200 caracteres." });
    }
    if (!drinkData.categoryId) {
      return res.status(400).json({ error: "Categoria é obrigatória." });
    }
    const categoryId = parseInt(drinkData.categoryId);
    if (isNaN(categoryId) || categoryId <= 0) {
      return res.status(400).json({ error: "ID da categoria deve ser um número válido." });
    }
    if (drinkData.instructions && typeof drinkData.instructions === "string" && drinkData.instructions.trim().length > 1000) {
      return res.status(400).json({ error: "Instruções devem ter no máximo 1000 caracteres." });
    }
    if (drinkData.alcoholType && !["ALCOOLICO", "NAO_ALCOOLICO"].includes(drinkData.alcoholType)) {
      return res.status(400).json({ error: "Tipo de álcool deve ser ALCOOLICO ou NAO_ALCOOLICO." });
    }
    
    drinkData.name = drinkData.name.trim();
    drinkData.categoryId = categoryId;
    if (drinkData.instructions) drinkData.instructions = drinkData.instructions.trim();
    
    if (req.body["ingredients[0][ingredientId]"]) {
      const ingredients = [];
      let idx = 0;
      while (req.body[`ingredients[${idx}][ingredientId]`]) {
        const ingredientId = parseInt(req.body[`ingredients[${idx}][ingredientId]`]);
        const amount = req.body[`ingredients[${idx}][amount]`] || "";
        
        if (isNaN(ingredientId) || ingredientId <= 0) {
          return res.status(400).json({ error: `Ingrediente ${idx + 1}: ID deve ser um número válido.` });
        }
        if (amount && amount.length > 50) {
          return res.status(400).json({ error: `Ingrediente ${idx + 1}: Quantidade deve ter no máximo 50 caracteres.` });
        }
        
        ingredients.push({
          ingredientId,
          amount: amount.trim(),
        });
        idx++;
      }
      drinkData.ingredients = ingredients;
    }
    
    if (req.file) {
      drinkData.image = `/uploads/${req.file.filename}`;
    }
    const updatedDrink = await updateDrink(id, drinkData);
    cache.del("drinks");  
    cache.del(`drink_${id}`);
    res.json(updatedDrink);
  } catch (error) {
    console.error("Error updating drink:", error);
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Já existe um drink com este nome." });
    }
    if (error.code === "P2003") {
      return res.status(400).json({ error: "Categoria ou ingrediente inválido." });
    }
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Drink não encontrado." });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: "ID do drink deve ser um número válido." });
    }
    await deleteDrink(id);
    cache.del("drinks");  
    cache.del(`drink_${id}`);
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting drink:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Drink não encontrado." });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
