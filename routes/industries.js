const express = require("express");
const router = new express.Router();
const db = require("../db");
const ExpressError = require("../expressError");

// Use slugify to create company codes
const slugify = require("slugify");

// GET / - get list of industries
router.get("/", async (req, res, next) => {
    try {
        const result = await db.query("SELECT code, industry FROM industries");
        return res.json({ industries: result.rows });
    } catch (err) {
        return next(new ExpressError("Unable to retrieve industries", 500));
    }
});

// POST / - create a new industry
router.post("/", async (req, res, next) => {
    try {
        const { industry } = req.body;
        if (!industry) {
            throw new ExpressError("Industry name is required", 400);
        }
        const code = slugify(industry, { lower: true, strict: true, trim: true }).slice(0, 8);
        const result = await db.query(
            "INSERT INTO industries (code, industry) VALUES ($1, $2) RETURNING code, industry",
            [code, industry]
        );
        return res.status(201).json({ industry: result.rows[0] });
    } catch (err) {
        return next(err);
    }
});

// PATCH /:code - update an industry
router.patch("/:code", async (req, res, next) => {
    try {
        const { code } = req.params;
        const { industry } = req.body;
        if (!industry) {
            throw new ExpressError("Industry name is required", 400);
        }
        const result = await db.query(
            "UPDATE industries SET industry = $1 WHERE code = $2 RETURNING code, industry",
            [industry, code]
        );
        if (result.rows.length === 0) {
            throw new ExpressError(`No industry found with code: ${code}`, 404);
        }
        return res.json({ industry: result.rows[0] });
    } catch (err) {
        return next(err);
    }
});

// DELETE /:code - delete an industry
router.delete("/:code", async (req, res, next) => {
    try {
        const { code } = req.params;
        const result = await db.query("DELETE FROM industries WHERE code = $1 RETURNING code", [code]);
        if (result.rows.length === 0) {
            throw new ExpressError(`No industry found with code: ${code}`, 404);
        }
        return res.json({ message: `Deleted industry with code: ${code}` });
    } catch (err) {
        return next(err);
    }
});