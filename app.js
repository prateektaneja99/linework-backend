import express from "express";
import cors from "cors";

export default function(database) {
// Create an instance of the Express application
const app = express();

// Use the CORS middleware to enable cross-origin requests
app.use(cors());

// Use the express.json() middleware to parse JSON requests
app.use(express.json());

// Define API routes and corresponding handlers
app.get("/stores", async (req, res) => {
  const stores = await database.getStores();
  res.send(stores);
});

app.get("/stores/:id", async (req, res) => {
  const id = req.params.id;
  const store = await database.getStore(id);
  if (!store) {
    res.status(404).send('Resource not found');
  } else {
    res.send(store);
  }
});

app.delete("/store/:id", async (req, res) => {
  const id = req.params.id;
  const store = await database.deleteStore(id);
  res.status(200).send(store);
});

app.post("/store/:id", async (req, res) => {
  const id = req.params.id;
  const status = req.body.status;
  const start_date = req.body.start_date;
  const end_date = req.body.end_date;
  const store = await database.updateStore(id, status, start_date, end_date);

  if (!store) {
    res.status(404).send("Store not found.");
  } else {
    res.status(200).send(store);
  }
});

app.get("/products/:status", async (req, res) => {
  const status = req.params.status;
  const products = await database.getProductsByStatus(status);
  
  if (!products) {
    res.status(404).send("No products found for the given status.");
  } else {
    res.status(200).send(products);
  }
});

app.use((err, res) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});
return app;
}
