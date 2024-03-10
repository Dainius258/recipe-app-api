import express from "express";
import knexConfig from "../db/knexfile.js";
import knex from "knex";

const db = knex(knexConfig.development);

const router = express.Router();

router.get("/getusers", async (request, response) => {
  try {
    const users = await db("users").orderBy("id", "asc");
    response.status(201).json(users);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (request, response) => {
  try {
    const id = parseInt(request.params.id);
    const user = await db("users").where("user_id", id);
    if (user.length > 0) {
      response.status(200).json(user);
    } else {
      response.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

router.post("/newuser", async (request, response) => {
  try {
    const { username, password, email } = request.body;
    await db("users").insert({ username, password, email });
    response.status(201).send(`User added`);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

router.put("/updateuser", async (request, response) => {
  try {
    const id = parseInt(request.params.id);
    const { username, password, email } = request.body;
    await db("users")
      .where("user_id", id)
      .update({ username, password, email });
    response.status(200).send(`User modified with ID: ${id}`);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

export default router;
