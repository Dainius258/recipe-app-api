import express from "express";
import userRouter from "./routes/userRoutes.js";
import recipeRouter from "./routes/recipeRoutes.js";
import registerRouter from "./routes/registerRoutes.js";
import bodyParser from "body-parser";
const { json, urlencoded } = bodyParser;

const app = express();
const port = 3000;

app.use(json());
app.use(
  urlencoded({
    extended: true,
  })
);

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});

app.use("/users", userRouter);
app.use("/recipes", recipeRouter);
app.use("/api", registerRouter);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
