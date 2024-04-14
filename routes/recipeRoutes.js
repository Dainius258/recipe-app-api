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

router.put("/rate/:id", async (request, response) => {
  // This needs better authorization
  // Need check if user already rated it
  try {
    const recipeId = request.params.id;
    const { rating, userId } = request.body;

    if (rating == null || userId == null) {
      return response.status(404).json({ message: "Missing rating or user" });
    }

    const existingUser = await db("users").where({ id: userId }).first();
    if (!existingUser) {
      return response.status(404).json({ message: "User not found" });
    }

    const existingRecipe = await db("recipes")
      .select("likes", "dislikes")
      .where({ id: recipeId })
      .first();
    if (!existingRecipe) {
      return response.status(404).json({ message: "Recipe not found" });
    }

    if (rating == true) {
      existingRecipe.likes = existingRecipe.likes + 1;
      await db("recipes")
        .where({ id: recipeId })
        .update({ likes: existingRecipe.likes });
    } else {
      existingRecipe.dislikes = existingRecipe.dislikes + 1;
      await db("recipes")
        .where({ id: recipeId })
        .update({ dislikes: existingRecipe.dislikes });
    }

    const newRating = parseFloat(
      (
        (existingRecipe.likes /
          (existingRecipe.likes + existingRecipe.dislikes)) *
        100.0
      ).toFixed(2)
    );

    //console.log(newRating);

    await db("recipes").where({ id: recipeId }).update({ rating: newRating });
    return response
      .status(200)
      .send({ message: `Recipe rated`, newRating: newRating });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
});

router.get("/getrecipes", (request, response) => {
  db("recipes")
    .then((recipes) => {
      response.status(200).json(recipes);
    })
    .catch((error) => {
      response.status(401).send(error);
    });
});

router.get("/getuserrecipes/:id", async (request, response) => {
  try {
    const userId = request.params.id;
    if (!userId) {
      return response.status(404).json({ message: "Missing user attribute" });
    }

    const existingUser = await db("users").where({ id: userId }).first();
    if (!existingUser) {
      return response.status(404).json({ message: "User not found" });
    }

    const recipes = await db("recipes").where({ user_id: userId });
    if (recipes.length == 0) {
      return response.status(404).json({ message: "User has no recipes" });
    }
    return response.status(200).json(recipes);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
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
