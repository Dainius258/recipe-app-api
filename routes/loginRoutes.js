import express from "express";
import knexConfig from "../db/knexfile.js";
import knex from "knex";
import bcrypt from "bcrypt";
import validator from "validator";

const db = knex(knexConfig.development);
const router = express.Router();

router.post("/login", async (request, response) => {
  const { username, password } = request.body;
  if (!password || !username) {
    return response.status(400).json({ message: "*Fill all the fields" });
  }
  try {
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});
