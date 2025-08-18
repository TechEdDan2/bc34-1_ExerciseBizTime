const express = require("express");
const router = new express.Router();
const db = require("../db");
const ExpressError = require("../expressError");

/** GET / - get list of companies */
router.get("/", async (req, res, next) => {
    try {
        const result = await db.query("SELECT code, name, description FROM companies");
        return res.json({ companies: result.rows });
    } catch (err) {
        return next(new ExpressError("Unable to retrieve companies", 500));
    }
});

/** GET /:code - get a specific company by code */
router.get("/:code", async (req, res, next) => {
    try {
        const code = req.params.code;
        const result = await db.query("SELECT * FROM companies WHERE code = $1", [code]);

        if (result.rows.length === 0) {
            throw new ExpressError(`No company found with code: ${code}`, 404);
        }

        return res.json({ company: result.rows[0] });
    } catch (err) {
        return next(err);
    }
});

/** POST / - create a new company */
router.post("/", async (req, res, next) => {
    try {
        const { code, name, description } = req.body;
        if (!code || !name) {
            throw new ExpressError("Code and name are required", 400);
        }
        const result = await db.query(
            "INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description",
            [code, name, description]
        );
        return res.status(201).json({ company: result.rows[0] });
    } catch (err) {
        return next(err);
    }
});

/** PATCH / PUT  */
// PATCH method to update a company
// Using PATCH to update only specific fields
router.patch("/:code", async (req, res, next) => {
    try {
        const { code } = req.params;
        const { name, description } = req.body;
        const result = await db.query(
            "UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description",
            [name, description, code]
        );
        if (result.rows.length === 0) {
            throw new ExpressError(`No company found with code: ${code}`, 404);
        }
        return res.json({ company: result.rows[0] });
    } catch (err) {
        return next(new ExpressError("Invalid data", 400));
    }
});

// PUT method to update a company
// Using PUT to replace the entire company record
router.put("/:code", async (req, res, next) => {
    try {
        const { code } = req.params;
        const { name, description } = req.body;
        if (!name) {
            throw new ExpressError("Name is required", 400);
        }
        const result = await db.query(
            "UPDATE companies SET name = $1, description = $2 WHERE code = $3 RETURNING code, name, description",
            [name, description, code]
        );
        if (result.rows.length === 0) {
            throw new ExpressError(`No company found with code: ${code}`, 404);
        }
        return res.json({ company: result.rows[0] });
    } catch (err) {
        return next(new ExpressError("Invalid data", 400));
    }
});

/** DELETE */
router.delete("/:code", async (req, res, next) => {
    try {
        const code = req.params.code;
        const result = await db.query("DELETE FROM companies WHERE code = $1 RETURNING code", [code]);
        if (result.rows.length === 0) {
            throw new ExpressError(`No company found with code: ${code}`, 404);
        }
        return res.json({ status: "deleted" });
    } catch (err) {
        return next(new ExpressError("Invalid data", 400));
    }
});

module.exports = router;