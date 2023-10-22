import mysql from "mysql2";

import dotenv from "dotenv";
dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

export async function getStores() {
  const [rows] = await pool.query("SELECT * FROM store");
  return rows;
}

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

export async function updateStore(id, status) {
  const [result] = await pool.query(
    `
  UPDATE Store
  SET status = ?
  WHERE id = ?
  `,
    [status, id]
  );
  return getStore(id);
}

export async function deleteStore(id) {
  await pool.query(
    `
   DELETE FROM Product WHERE store_id = ?;
  `,
    [id]
  );
  await pool.query(
    `
   DELETE FROM Store WHERE id = 1;
  `,
    [id]
  );
  return getStores();
}

export async function getProductsByStatus(status) {
  const [rows] = await pool.query(
    `SELECT Product.*
    FROM Product
    JOIN Store ON Store.id = Product.store_id
    WHERE Store.status =  ? `,
    [status]
  );
  return rows;
}

const y = await deleteStore(1);
console.log(y);
