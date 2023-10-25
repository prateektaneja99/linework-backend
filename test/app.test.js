import request from "supertest";
import makeApp from "../app.js";
import { jest } from "@jest/globals";

const getStores = jest.fn();
const getStore = jest.fn();
const getProductsByStatus = jest.fn();
const updateStore = jest.fn();
const deleteStore = jest.fn();

const app = makeApp({
  getStores,
  getStore,
  getProductsByStatus,
  updateStore,
  deleteStore,
});

describe("GET /stores", () => {
  beforeEach(() => {
    getStores.mockReset();
  });

  it("should return status code 200 and an array of stores", async () => {
    const mockStores = [
      { id: 1, name: "Store 1" },
      { id: 2, name: "Store 2" },
    ];
    getStores.mockResolvedValue(mockStores);
    const response = await request(app).get("/stores");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockStores);
  });

  it("should handle empty store data and return an empty array", async () => {
    getStores.mockResolvedValue([]);
    const response = await request(app).get("/stores");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});

describe("GET /stores/:id", () => {
  it("should return status code 200 and a store by ID", async () => {
    const mockStore = { id: 1, name: "Store 1" };
    getStore.mockResolvedValue(mockStore);
    const response = await request(app).get("/stores/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockStore);
  });

  it("should handle the if the ID is not in the Store and return status code 404", async () => {
    getStore.mockResolvedValue(null);
    const response = await request(app).get("/stores/1");
    expect(response.status).toBe(404);
  });
});

describe("GET /products/:status", () => {
  beforeEach(() => {
    getProductsByStatus.mockReset();
  });

  it("should return status code 200 and an array of products for a valid status", async () => {
    const mockProducts = [
      { id: 1, name: "Product 1" },
      { id: 2, name: "Product 2" },
    ];
    getProductsByStatus.mockResolvedValue(mockProducts);
    const response = await request(app).get("/products/Active");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockProducts);
  });

  it("should handle empty product data and return an empty array", async () => {
    getProductsByStatus.mockResolvedValue([]);
    const response = await request(app).get("/products/Active");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("should return status code 404 for an invalid status", async () => {
    getProductsByStatus.mockResolvedValue(null);
    const response = await request(app).get("/products/InvalidStatus");
    expect(response.status).toBe(404);
  });
});

describe("POST /store/:id", () => {
  beforeEach(() => {
    updateStore.mockReset();
  });

  it("should update status, start_date, and end_date when start_date equals current date", async () => {
    const mockUpdatedStore = {
      id: 1,
      status: "Invisible",
      start_date: "2023-10-24",
      end_date: "2023-11-24",
    };
    updateStore.mockResolvedValue(mockUpdatedStore);
    const mockRequestBody = {
      status: "Invisible",
      start_date: "2023-10-24",
      end_date: "2023-11-24",
    };
    const response = await request(app).post("/store/1").send(mockRequestBody);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUpdatedStore);
  });

  it("should update start_date and end_date when both are provided", async () => {
    const mockUpdatedStore = {
      id: 1,
      status: "Active",
      start_date: "2023-10-24",
      end_date: "2023-11-24",
    };
    updateStore.mockResolvedValue(mockUpdatedStore);
    const mockRequestBody = {
      status: "Active",
      start_date: "2023-10-24",
      end_date: "2023-11-24",
    };
    const response = await request(app).post("/store/1").send(mockRequestBody);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUpdatedStore);
  });

  it("should update only the status when id and status are provided", async () => {
    const mockUpdatedStore = {
      id: 1,
      status: "Inactive",
      start_date: null,
      end_date: null,
    };
    updateStore.mockResolvedValue(mockUpdatedStore);
    const mockRequestBody = {
      status: "Inactive",
    };
    const response = await request(app).post("/store/1").send(mockRequestBody);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUpdatedStore);
  });

  it("should return a 404 error when the store is not found", async () => {
    updateStore.mockResolvedValue(null);
    const mockRequestBody = {
      status: "Inactive",
    };
    const response = await request(app)
      .post("/store/999") // Assuming an invalid store ID
      .send(mockRequestBody);
    expect(response.status).toBe(404);
  });
});

describe("DELETE /store/:id", () => {
  beforeEach(() => {
    deleteStore.mockReset();
  });

  it("should delete a store and its associated products", async () => {
    deleteStore.mockResolvedValue();
    const response = await request(app).delete("/store/1");
    expect(response.status).toBe(200);
  });
});
