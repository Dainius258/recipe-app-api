import express from "express";
import knexConfig from "../db/knexfile.js";
import knex from "knex";

const db = knex(knexConfig.development);
const router = express.Router();

router.post("/getfavourites", async (request, response) => {
  const { user_id } = request.body;
  try {
    const favourites = await db("favourite").where("user_id", user_id);
    //console.log(favourites);
    response.status(200).json(favourites);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: error.message });
  }
});

router.post("/newfavourite", async (request, response) => {
  const { user_id, recipe_id } = request.body;
  try {
    await db("favourite").insert({ user_id, recipe_id });
    response.status(201).send(`Favourite added`);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
});

router.post("/deletefavourite", async (request, response) => {
  const { user_id, recipe_id } = request.body;
  try {
    await db("favourite")
      .where("user_id", user_id)
      .where("recipe_id", recipe_id)
      .del();
    response.status(201).send(`Favourite deleted`);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
});

export default router;
