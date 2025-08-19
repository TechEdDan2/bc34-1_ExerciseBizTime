//Set to Test Mode
process.env.NODE_ENV = 'test';

//npm packages for testing
const request = require('supertest');

//import the app and db
const app = require('../app');
const db = require('../db');

//Setup and Teardown for the test database
let testCompany;

beforeEach(async () => {
    // Create a test company
    const result = await db.query(
        "INSERT INTO companies (code, name, description) VALUES ('test', 'Test Company', 'This is a test company') RETURNING code, name, description"
    );
    testCompany = result.rows[0];
});

afterEach(async () => {
    // Clean up the test database
    await db.query("DELETE FROM companies");
});

afterAll(async () => {
    // Close the database connection
    await db.end();
});

//----------------------------//
// TESTS for Companies Routes //
//----------------------------//

// GET all companies
describe("GET /companies", () => {
    test("should return a list of companies", async () => {
        const response = await request(app).get("/companies");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("companies");
        expect(response.body.companies.length).toBeGreaterThan(0);
    });
});

// GET a specific company by code
describe("GET /companies/:code", () => {
    test("should return a specific company by code", async () => {
        const response = await request(app).get(`/companies/${testCompany.code}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("company");
        expect(response.body.company.code).toBe(testCompany.code);
    });


});

//POST a new company
describe("POST /companies", () => {
    test("should create a new company", async () => {
        const newCompany = {
            code: "newco",
            name: "New Company",
            description: "This is a new company"
        };
        const response = await request(app).post("/companies").send(newCompany);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("company");
        expect(response.body.company.code).toBe(newCompany.code);
    });

});

// Patch an existing company
describe("PATCH /companies/:code", () => {
    test("should update an existing company", async () => {
        const updatedCompany = {
            name: "Updated Company",
            description: "This is an updated company"
        };
        const response = await request(app).patch(`/companies/${testCompany.code}`).send(updatedCompany);
        expect(response.statusCode).toBe(200);
        expect(response.body.company.name).toBe(updatedCompany.name);
    });
});

// DELETE a company by code
describe("DELETE /companies/:code", () => {
    test("should delete a company by code", async () => {
        const response = await request(app).delete(`/companies/${testCompany.code}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ status: "deleted" });
    });

});
