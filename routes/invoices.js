const express = require("express");
const router = new express.Router();
const db = require("../db");
const ExpressError = require("../expressError");

/** GET */
router.get("/", async (req, res, next) => {
    try {
        const result = await db.query("SELECT id, comp_code, amt, paid, add_date, paid_date FROM invoices");
        return res.json({ invoices: result.rows });
    } catch (err) {
        return next(new ExpressError("Unable to return invoices", 500));
    }
});

// GET all invoices with a specific Company Code
router.get("/:comp_code", async (req, res, next) => {
    try {
        const comp_code = req.params.comp_code;
        const result = await db.query("SELECT comp_code, amt, paid, add_date, paid_date FROM invoices WHERE comp_code = $1", [comp_code]);
        if (result.rows.length === 0) {
            throw new ExpressError(`No invoices found with company code: ${invoice_id}`, 404);
        }
        return res.json({ invoices: result.rows });
    } catch (err) {
        return next(new ExpressError("Unable to return invoices", 500));
    }
});

// GET a specific invoice by invoice id
router.get("/:id", async (req, res, next) => {
    try {
        const invoice_id = req.params.id;
        const result = await db.query("SELECT comp_code, amt, paid, add_date, paid_date FROM invoices WHERE id = $1", [invoice_id]);
        if (result.rows.length === 0) {
            throw new ExpressError(`No invoice found with id: ${invoice_id}`, 404);
        }
        return res.json({ invoices: result.rows[0] });
    } catch (err) {
        return next(new ExpressError("Unable to return invoices", 500));
    }
});

/** POST / - create a new invoice */
router.post("/", async (req, res, next) => {
    try {
        const { comp_code, amt } = req.body;
        if (!comp_code || !amt) {
            throw new ExpressError("Company code and amount are required", 400);
        }
        const result = await db.query(
            "INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING id, comp_code, amt, paid, add_date, paid_date",
            [comp_code, amt]
        );
        return res.status(201).json({ invoice: result.rows[0] });

    } catch (err) {
        return next(new ExpressError(""))
    }

});

/** PATCH / PUT */
router.patch("/:id", async (req, res, next) => {
    try {
        const invoice_id = req.params.id;
        const { amt, paid } = req.body;

        if (paid !== undefined && typeof paid !== 'boolean') {
            throw new ExpressError("Paid must be a boolean value", 400);
        }

        const result = await db.query(
            "UPDATE invoices SET amt=$1, paid=$2 WHERE id=$3 RETURNING id, comp_code, amt, paid, add_date, paid_date",
            [amt, paid, invoice_id]
        );

        if (result.rows.length === 0) {
            throw new ExpressError(`No invoice found with id: ${invoice_id}`, 404);
        }

        return res.json({ invoice: result.rows[0] });
    } catch (err) {
        return next(new ExpressError("Invalid data", 400));
    }
});

router.put("/:id", async (req, res, next) => {
    try {
        const invoice_id = req.params.id;
        const { comp_code, amt, paid } = req.body;

        if (!comp_code || !amt) {
            throw new ExpressError("Company code and amount are required", 400);
        }
        const result = await db.query(
            "UPDATE invoices SET comp_code=$1, amt=$2, paid=$3 WHERE id=$4 RETURNING id, comp_code, amt, paid, add_date, paid_date",
            [comp_code, amt, paid, invoice_id]
        );
        if (result.rows.length === 0) {
            throw new ExpressError(`No invoice found with id: ${invoice_id}`, 404);
        }
        return res.json({ invoice: result.rows[0] });
    } catch (err) {
        return next(new ExpressError("Invalid data", 400));
    }
});

/** DELETE */
router.delete("/:id", async (req, res, next) => {
    try {
        const invoice_id = req.params.id;
        const result = await db.query("DELETE FROM invoices WHERE id=$1 RETURNING id", [invoice_id]);
        if (result.rows.length === 0) {
            throw new ExpressError(`No invoice found with id: ${invoice_id}`, 404);
        }
        return res.json({ message: "Invoice deleted" });
    } catch (err) {
        return next(new ExpressError("Invalid data", 400));
    }
});

module.exports = router;