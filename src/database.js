import mysql from "mysql2";
import { dateComparison } from "../cron/cron_job.js";
import dotenv from "dotenv";
dotenv.config();

// Create a MySQL connection pool with parameters from environment variables
const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

// Function to fetch and return store data with product counts
export async function getStores() {
  const [rows] = await pool.query(
    `
   SELECT Store.*, COUNT(Product.id) AS product_count
   FROM Store
   LEFT JOIN Product ON Store.id = Product.store_id
   GROUP BY Store.id, Store.name;
  `
  );
  return rows;
}

// Function to fetch and return a single store by its ID
export async function getStore(id) {
  const [rows] = await pool.query(
    `
  SELECT * 
  FROM store
  WHERE id = ?
  `,
    [id]
  );
  return rows[0];
}

// Function to update a store's status and visibility dates
export async function updateStore(id, status, start_date, end_date) {
  if (
    start_date != null &&
    end_date != null &&
    dateComparison(start_date) == 0
  ) {
    await pool.query(
      `
    UPDATE Store
    SET status = ? , start_date = ? , end_date = ?
    WHERE id = ?
    `,
      ["Invisible", start_date, end_date, id]
    );
  } else if (start_date != null && end_date != null) {
    await pool.query(
      `
    UPDATE Store
    SET status = ? , start_date = ? , end_date = ?
    WHERE id = ?
    `,
      [status, start_date, end_date, id]
    );
  } else {
    await pool.query(
      `
    UPDATE Store
    SET status = ? , start_date = NULL , end_date = NULL
    WHERE id = ?
    `,
      [status, id]
    );
  }

  return getStore(id);
}

// Function to delete a store and its associated products
export async function deleteStore(id) {
  await pool.query(
    `
   DELETE FROM Product WHERE store_id = ?;
  `,
    [id]
  );
  await pool.query(
    `
   DELETE FROM Store WHERE id = ?;
  `,
    [id]
  );
  return getStores();
}

// Function to fetch and return products by their status
export async function getProductsByStatus(status) {
  const [rows] = await pool.query(
    `
   SELECT Product.*, Store.name AS store_name
   FROM Product
   JOIN Store ON Store.id = Product.store_id
   WHERE Store.status =  ? 
  `,
    [status]
  );
  return rows;
}
