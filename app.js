import express from "express";

import {
  getNotes,
  getNote,
  createNote,
  deleteStore,
  getProductsByStatus,
} from "./database.js";

const app = express();

app.use(express.json());

app.get("/stores", async (req, res) => {
  const notes = await getStores();
  res.send(notes);
});

app.get("/stores/:id", async (req, res) => {
  const id = req.params.id;
  const note = await getStore(id);
  res.send(note);
});

app.delete("/store/:id", async (req, res) => {
  const id = req.params.id;
  const note = await deleteStore(id);
  res.status(201).send(note);
});

app.post("/store/:id", async (req, res) => {
  const id = req.params.id;
  const status = req.body;
  const note = await updateStore(id, status);
  res.status(200).send(note);
});

app.get("/products/:status", async (req, res) => {
  const status = req.params.status;
  const note = await getProductsByStatus(status);
  res.status(200).send(note);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke 💩");
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
