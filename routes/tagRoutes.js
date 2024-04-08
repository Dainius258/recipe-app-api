import express from "express";
import knexConfig from "../db/knexfile.js";
import knex from "knex";

const db = knex(knexConfig.development);
const router = express.Router();

router.post("/newtag", async (request, response) => {
  const { tag_name } = request.body;

  if (!tag_name) {
    response.status(400).json({ message: "Missing fields" });
  }

  try {
    await db("tag").insert({
      tag_name,
    });
    response.status(201).json({ message: `Tag added` });
  } catch (error) {
    console.error(error.stack);
    response.status(500).json({ error: error.message });
  }
});

export default router;
