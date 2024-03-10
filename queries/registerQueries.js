import pkg from "pg";
import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const { Pool } = pkg;

const router = express.Router();

const pool = new Pool({
  user: process.env.user,
  host: process.env.host,
  database: process.env.database,
  password: process.env.password,
  port: process.env.port,
});

router.put("/newuser", (request, response) => {
  const { username, password, email } = request.body;

  if (!email || !password || !username) {
    return respond.status(400).json({ message: "*Fill all the fields" });
  }

  pool.query(
    "INSERT INTO users (username, password, email) VALUES ($1, $2, $3)",
    [username, password, email],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`User added`);
    }
  );
});
