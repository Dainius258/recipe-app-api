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

router.get("/getusers", (request, response) => {
  pool.query("SELECT * FROM users ORDER BY user_id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
});

router.get("/:id", (request, response) => {
  const id = parseInt(request.params.id);
  pool.query(
    "SELECT * FROM users WHERE user_id = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      if (results.rows.length > 0) {
        response.status(200).json(results.rows);
      } else {
        response.status(404).json({ message: "User not found" });
      }
    }
  );
});

router.put("/newuser", (request, response) => {
  const { username, password, email } = request.body;
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

router.put("/updateuser", (request, response) => {
  const id = parseInt(request.params.id);
  const { username, password, email } = request.body;

  pool.query(
    "UPDATE users SET username = $1, password = $2, email = $3 WHERE id = $4",
    [username, password, email, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User modified with ID: ${id}`);
    }
  );
});
/*
const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, email } = request.body;

  pool.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3",
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User modified with ID: ${id}`);
    }
  );
};

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`User deleted with ID: ${id}`);
  });
};
*/

export default router;
