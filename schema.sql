CREATE DATABASE linework_app;
USE linework_app;

CREATE TABLE Store (
  id integer PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE Product (
  id integer PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  price FLOAT,
  FOREIGN KEY (store_id) REFERENCES Store(id)
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO `linework_app`.`store` (
  `id`, `name`, `status`) 
  VALUES ('1', 'Store A', 'Active'),
  ('2', 'Store B', 'Active'),
  ('3', 'Store C', 'Active')


INSERT INTO `linework_app`.`product` (
  `id`, `name`, `price`, `store_id`) 
  VALUES ('1', 'Product A1', '14', '1'),
  ('2', 'Product A2', '18', '3'),
  ('3', 'Product B1', '20', '2')

