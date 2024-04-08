import express from "express";
import userRouter from "./routes/userRoutes.js";
import recipeRouter from "./routes/recipeRoutes.js";
import authRouter from "./routes/userAuthRoutes.js";
import tagRouter from "./routes/tagRoutes.js";
import bodyParser from "body-parser";
import authenticateJWT from "./middleware/authMiddleware.js";
const { json, urlencoded } = bodyParser;

const app = express();
const port = 3000;

app.use(
  json({
    limit: "6mb",
  })
);
app.use(
  urlencoded({
    extended: true,
    limit: "6mb",
  })
);

//app.use(authenticateJWT(JWT_SECRET));

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});

app.use("/users", userRouter);
app.use("/api", recipeRouter);
app.use("/api", authRouter);
app.use("/api", tagRouter);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
