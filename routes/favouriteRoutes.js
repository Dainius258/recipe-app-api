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
    if (favourites.length == 0) {
      return response.status(404).json({ message: "User has no favourites" });
    }
    return response.status(200).json(favourites);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
});

router.post("/newfavourite", async (request, response) => {
  const { user_id, recipe_id } = request.body;
  try {
    await db("favourite").insert({ user_id, recipe_id });
    response.status(201).send({ message: `Favourite added` });
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
    return response.status(201).send({ message: `Favourite deleted` });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
});

export default router;
