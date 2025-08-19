//Set to Test Mode
process.env.NODE_ENV = 'test';

//npm packages for testing
const request = require('supertest');

//import the app and db
const app = require('../app');
const db = require('../db');

// ----------------------------------------- //
// Setup and Teardown for the test database  //
// ----------------------------------------- //

let testInvoice;
let testCompany;

beforeEach(async () => {
    await db.query("DELETE FROM invoices");
    await db.query("DELETE FROM companies");
    // Now insert your test company
    const companyResult = await db.query(
        "INSERT INTO companies (code, name, description) VALUES ('tech', 'Test Tech Company', 'This is a test company') RETURNING code, name, description"
    );
    testCompany = companyResult.rows[0];
    // Create a test invoice
    const result = await db.query(
        "INSERT INTO invoices (comp_code, amt) VALUES ('tech', 100) RETURNING id, comp_code, amt, paid, add_date, paid_date"
    );
    testInvoice = result.rows[0];

});

afterEach(async () => {
    // Clean up the test database
    await db.query("DELETE FROM invoices");
    await db.query("DELETE FROM companies");
});

afterAll(async () => {
    // Close the database connection
    await db.end();
});


//----------------------------//
// TESTS for Invoices Routes  //
//----------------------------//

// GET all invoices
describe("GET /invoices", () => {
    test("should return a list of invoices", async () => {
        const response = await request(app).get("/invoices");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("invoices");
        expect(response.body.invoices.length).toBeGreaterThan(0);
    });
});

// GET all invoices for a specific company code
describe("GET /invoices/:comp_code", () => {
    test("should return invoices for a specific company code", async () => {
        const response = await request(app).get(`/invoices/${testCompany.code}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("invoices");
        expect(response.body.invoices.length).toBeGreaterThan(0);
    });
});

// POST a new invoice
describe("POST /invoices", () => {
    test("should create a new invoice", async () => {
        const newInvoice = {
            comp_code: testCompany.code,
            amt: 200
        };
        const response = await request(app).post("/invoices").send(newInvoice);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("invoice");
        expect(response.body.invoice.comp_code).toBe(testCompany.code);
        expect(response.body.invoice.amt).toBe(200);
    });


});

// PATCH a specific invoice
describe("PATCH /invoices/:id", () => {
    test("should update an invoice", async () => {
        const response = await request(app).patch(`/invoices/${testInvoice.id}`).send({ amt: 300, paid: true });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("invoice");
        expect(response.body.invoice.amt).toBe(300);
    });
});

//DELETE a specific invoice
describe("DELETE /invoices/:id", () => {
    test("should delete an invoice", async () => {
        const response = await request(app).delete(`/invoices/${testInvoice.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ message: "Invoice deleted" });
    });
});