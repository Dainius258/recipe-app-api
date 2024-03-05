import pkg from "pg";
import express from "express";
import dotenv from "dotenv";
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

router.get("/getrecipes", (request, response) => {
  pool.query(
    "SELECT * FROM recipes ORDER BY recipe_id ASC",
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
});
router.put("/newrecipe", (request, response) => {
  const { recipeName, user_id, image, ingredients, total_time, servings } =
    request.body;

  pool.query(
    "INSERT INTO recipes (recipe_name, user_id, image, ingredients, total_time, servings) VALUES ($1,$2,$3,$4,$5,$6)",
    [recipeName, user_id, image, ingredients, total_time, servings],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`recipe added`);
    }
  );
});

export default router;
