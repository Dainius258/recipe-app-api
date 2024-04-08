import express from "express";
import knexConfig from "../db/knexfile.js";
import knex from "knex";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authenticateJWT from "../middleware/authMiddleware.js";
import validator from "validator";

const db = knex(knexConfig.development);
const router = express.Router();
//const JWT_SECRET = process.env.JWT_SECRET;

router.get("/getrecipes", (request, response) => {
  db("recipes")
    .then((recipes) => {
      response.status(200).json(recipes);
    })
    .catch((error) => {
      response.status(401).send(error);
    });
});

router.post("/newrecipe", async (request, response) => {
  const {
    user_id,
    title,
    image,
    ingredients,
    guide,
    total_time_minutes,
    servings,
    tag_id,
  } = request.body;

  if (
    !user_id ||
    !title ||
    !image ||
    !ingredients ||
    !guide ||
    !total_time_minutes ||
    !servings ||
    !tag_id
  ) {
    return response.status(400).json({ message: "Missing fields" });
  }

  const rating = 0.0;

  try {
    const insertedData = await db("recipes")
      .insert({
        user_id,
        title,
        image,
        ingredients,
        guide,
        total_time_minutes,
        servings,
        rating,
      })
      .returning("id");

    await db("recipe_tags").insert({
      tag_id,
      recipe_id: insertedData[0].id,
    });

    return response.status(201).json({ message: `Recipe added` });
  } catch (error) {
    console.error(error.stack);
    return response.status(500).json({ error: error.message });
  }
});

// WITHOUT TAGS
/*
router.post("/newrecipe", async (request, response) => {
  const {
    user_id,
    title,
    image,
    ingredients,
    guide,
    total_time_minutes,
    servings,
  } = request.body;

  if (
    !user_id ||
    !title ||
    !image ||
    !ingredients ||
    !guide ||
    !total_time_minutes ||
    !servings
  ) {
    response.status(400).json({ message: "Missing fields" });
  }

  const rating = 0.0;

  try {
    await db("recipes").insert({
      user_id,
      title,
      image,
      ingredients,
      guide,
      total_time_minutes,
      servings,
      rating,
    });
    response.status(201).json({ message: `Recipe added` });
  } catch (error) {
    console.error(error.stack);
    response.status(500).json({ error: error.message });
  }
});*/
export default router;
