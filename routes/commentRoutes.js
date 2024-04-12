import express from "express";
import knexConfig from "../db/knexfile.js";
import knex from "knex";

const db = knex(knexConfig.development);
const router = express.Router();

router.post("/newcomment", async (request, response) => {
  try {
    const { recipe_id, user_id, comment_text } = request.body;
    await db("comments").insert({ recipe_id, user_id, comment_text });
    return response.status(201).send(`Comment added`);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
});

router.get("/comments/:id", async (request, response) => {
  try {
    const id = parseInt(request.params.id);
    const comments = await db("comments")
      .where("recipe_id", id)
      .join("users", "comments.user_id", "users.id")
      .select("comments.*", "users.username");
    if (comments.length > 0) {
      response.status(200).json(comments);
    } else {
      response.status(404).json({ message: "Comments not found" });
    }
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

export default router;
