import express from "express";
import knexConfig from "../db/knexfile.js";
import knex from "knex";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authenticateJWT from "../middleware/authMiddleware.js";
import validator from "validator";

const db = knex(knexConfig.development);
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/register", async (request, response) => {
  const { username, password, email } = request.body;
  if (!email || !password || !username) {
    return response.status(400).json({ message: "*Fill all the fields" });
  }
  if (!validator.isEmail(email)) {
    return response.status(400).json({ message: "*Invalid email format" });
  }
  try {
    const existingUser = await db("users")
      .where("username", username)
      .orWhere("email", email)
      .first();
    if (existingUser) {
      return response
        .status(400)
        .json({ message: `*Username or email already exists` });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await db("users").insert({ username, password: hashedPassword, email });
    response.status(201).json({ message: `User registered` });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

router.post("/login", async (request, response) => {
  const { username, password } = request.body;
  if (!password || !username) {
    return response.status(400).json({ message: "*Fill all the fields" });
  }
  try {
    const existingUser = await db("users").where("username", username).first();
    if (existingUser) {
      const validPassword = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (validPassword === true) {
        const expiresIn = "1h";
        const user = {
          id: existingUser.id,
          username: existingUser.username,
        };
        const token = jwt.sign(user, JWT_SECRET, { expiresIn });
        response.json({
          token,
          name: existingUser.username,
          message: "Logged in",
        });
      } else {
        response.status(500).json({ message: "Invalid username or password" });
      }
    } else {
      response.status(500).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

router.post("/protected", (request, response) => {
  // Get the JWT token from the requestuest headers
  const token = request.body.token;
  if (!token) {
    return response.status(401).json({ message: "No token provided" });
  }

  // Verify and decode the JWT token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return response
        .status(403)
        .json({ message: "Failed to authenticate token" });
    }

    // Authentication successful, respond with user's information
    response.json({ user: decoded });
  });
});

export default router;
