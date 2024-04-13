import express from "express";
import knexConfig from "../db/knexfile.js";
import knex from "knex";

const db = knex(knexConfig.development);
const router = express.Router();

router.put("/updatecomment/:id", async (request, response) => {
  try {
    const commentId = request.params.id;
    const { comment_text } = request.body;

    const existingComment = await db("comments")
      .where({ id: commentId })
      .first();
    if (!existingComment) {
      return response.status(404).json({ error: "Comment not found" });
    }

    await db("comments").where({ id: commentId }).update({ comment_text });
    return response.status(200).send({ message: `Comment updated` });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
});

router.delete("/deletecomment/:id", async (request, response) => {
  try {
    const commentId = request.params.id;
    const existingComment = await db("comments")
      .where({ id: commentId })
      .first();
    if (!existingComment) {
      return response.status(404).json({ error: "Comment not found" });
    }
    await db("comments").delete().where("id", commentId);
    return response.status(201).send({ message: `Comment deleted` });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
});

router.post("/newcomment", async (request, response) => {
  try {
    const { recipe_id, user_id, comment_text } = request.body;
    await db("comments").insert({ recipe_id, user_id, comment_text });
    return response.status(201).send({ message: `Comment added` });
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
