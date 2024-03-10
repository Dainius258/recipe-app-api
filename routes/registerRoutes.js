import express from "express";
import knexConfig from "../db/knexfile.js";
import knex from "knex";
import bcrypt from "bcrypt";
import validator from "validator";

const db = knex(knexConfig.development);
const router = express.Router();

router.post("/register", async (request, response) => {
  const { username, password, email } = request.body;

  if (!validator.isEmail(email)) {
    return response.status(400).json({ message: "Invalid email format" });
  }

  if (!email || !password || !username) {
    return respond.status(400).json({ message: "*Fill all the fields" });
  }
  try {
    const existingUser = await db("users")
      .where("username", username)
      .orWhere("email", email)
      .first();
    if (existingUser) {
      return response
        .status(400)
        .json({ message: "Username or email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await db("users").insert({ username, password: hashedPassword, email });
    response.status(201).send(`User registered`);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

export default router;
