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
    response.status(500).json({ error: error.message });
  }
});

export default router;
