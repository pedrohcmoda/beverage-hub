import express from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../models/categoryModel.js";
import { authenticateJWT } from "../config/auth.js";
import { cache } from "../config/cache.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const cached = cache.get("categories");
    if (cached) return res.json(cached);
    const categories = await getAllCategories();
    cache.set("categories", categories);
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: "Category ID must be a valid number." });
    }
    const cached = cache.get(`category_${id}`);
    if (cached) return res.json(cached);
    const category = await getCategoryById(id);
    if (!category) return res.status(404).json({ error: "Category not found" });
    cache.set(`category_${id}`, category);
    res.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", authenticateJWT, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({ error: "Category name is required and must be valid text." });
    }
    if (name.trim().length > 100) {
      return res.status(400).json({ error: "Category name must have at most 100 characters." });
    }
    const newCategory = await createCategory({ name: name.trim() });
    cache.del("categories");  
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    if (error.code === "P2002") {
      return res.status(409).json({ error: "A category with this name already exists." });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", authenticateJWT, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: "Category ID must be a valid number." });
    }
    const { name } = req.body;
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({ error: "Category name is required and must be valid text." });
    }
    if (name.trim().length > 100) {
      return res.status(400).json({ error: "Category name must have at most 100 characters." });
    }
    const updatedCategory = await updateCategory(id, { name: name.trim() });
    cache.del("categories");  
    cache.del(`category_${id}`);
    res.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    if (error.code === "P2002") {
      return res.status(409).json({ error: "A category with this name already exists." });
    }
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Category not found." });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: "Category ID must be a valid number." });
    }
    await deleteCategory(id);
    cache.del("categories");  
    cache.del(`category_${id}`);
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting category:", error);
    if (error.code === "P2003") {
      return res.status(400).json({ error: "Cannot delete category because it is being used in some drink." });
    }
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Category not found." });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
