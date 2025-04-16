const request = require("supertest");
const app = require("../app");
const mongodb = require('../data/database');

beforeAll(async () => {
  await new Promise((resolve, reject) => {
    mongodb.initDb((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}, 10000); // Increase timeout to 10 seconds

afterAll(async () => {
  await mongodb.getDatabase().client.close();
});

it("GET /task should return status 200", async () => {
  const res = await request(app).get("/task");
  expect(res.statusCode).toEqual(200);
  expect(Array.isArray(res.body)).toBe(true);
});
