import { jest } from '@jest/globals';
import { getStore } from "./database.js"; 

describe("Your Module", () => {
  it("should return an empty object for an invalid store ID", async () => {
    const store = await getStore(10);
    expect(store).toBe(undefined);
  });

  it("should return valid data for a valid store ID", async () => {
    const store = await getStore(1); 
  });

  it("should respond with a status code of 200", async ()=> {
    const response = await getStore(1);
  })
});
