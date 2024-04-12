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

router.get("/recipe/:id", async (request, response) => {
  try {
    const id = parseInt(request.params.id);
    const recipe = await db("recipes").where("id", id).first();
    return response.status(200).json(recipe);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
});

router.post("/getfavouriterecipes", (request, response) => {
  const { user_id } = request.body;
  db("favourite")
    .where("user_id", user_id)
    .then((favourites) => {
      const favoritedRecipeIds = favourites.map(
        (favourite) => favourite.recipe_id
      );
      return db("recipes").whereIn("id", favoritedRecipeIds);
    })
    .then((favoritedRecipes) => {
      return response.status(200).json(favoritedRecipes);
    })
    .catch((error) => {
      console.log(error);
      return response.status(500).json({ message: error });
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
    tag_ids,
  } = request.body;

  if (
    !user_id ||
    !title ||
    !image ||
    !ingredients ||
    !guide ||
    !total_time_minutes ||
    !servings ||
    !tag_ids ||
    tag_ids.length === 0
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

    //console.log(tag_ids);
    const recipeId = insertedData[0].id;
    const insertPromises = tag_ids.map(async (tag_id) => {
      const tagIdInteger = parseInt(tag_id);
      await db("recipe_tags").insert({
        tag_id: tagIdInteger,
        recipe_id: recipeId,
      });
    });

    await Promise.all(insertPromises);

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
