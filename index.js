import express from "express";
import userRouter from "./queries/userQueries.js";
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

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
