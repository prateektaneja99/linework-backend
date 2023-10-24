import express from "express";
import cors from "cors";

import {
  getStores,
  getStore,
  deleteStore,
  updateStore,
  getProductsByStatus,
} from "./database.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/stores", async (req, res) => {
  const stores = await getStores();
  res.send(stores);
});

app.get("/stores/:id", async (req, res) => {
  const id = req.params.id;
  const store = await getStore(id);
  res.send(store);
});

app.delete("/store/:id", async (req, res) => {
  const id = req.params.id;
  const store = await deleteStore(id);
  res.status(200).send(store);
});

app.post("/store/:id", async (req, res) => {
  const id = req.params.id;
  const status = req.body.status;
  const start_date = req.body.start_date;
  const end_date = req.body.end_date;
  const store = await updateStore(id, status, start_date, end_date);
  res.status(200).send(store);
});

app.get("/products/:status", async (req, res) => {
  const status = req.params.status;
  const products = await getProductsByStatus(status);
  res.status(200).send(products);
});

app.use((err, res) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
