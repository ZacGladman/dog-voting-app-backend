import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { Client } from "pg";
import { getEnvVarOrFail } from "./support/envVarUtils";
import { setupDBClientConfig } from "./support/setupDBClientConfig";

dotenv.config(); //Read .env file lines as though they were env vars.

const dbClientConfig = setupDBClientConfig();
const client = new Client(dbClientConfig);

//Configure express routes
const app = express();

app.use(express.json()); //add JSON body parser to each following route handler
app.use(cors()); //add CORS support to each following route handler

app.get("/leaderboard", async (req, res) => {
  try {
    const query = "SELECT * FROM leaderboard ORDER BY votes DESC LIMIT 10";
    const response = await client.query(query);
    res.status(200).json(response.rows);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});

app.post<{}, {}, { breed: string }>("/leaderboard", async (req, res) => {
  try {
    const query =
      "INSERT INTO leaderboard (breed) VALUES ($1) ON CONFLICT DO NOTHING RETURNING *";
    const values = req.body.breed;
    const response = await client.query(query, [values]);
    res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});

app.put<{ breed: string }>("/leaderboard/:breed", async (req, res) => {
  try {
    const breed = req.params.breed;
    const query =
      "UPDATE leaderboard SET votes = votes + 1 WHERE breed = $1 RETURNING *";
    const response = await client.query(query, [breed]);
    res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});

connectToDBAndStartListening();

async function connectToDBAndStartListening() {
  console.log("Attempting to connect to db");
  await client.connect();
  console.log("Connected to db!");

  const port = getEnvVarOrFail("PORT");
  app.listen(port, () => {
    console.log(
      `Server started listening for HTTP requests on port ${port}.  Let's go!`
    );
  });
}
