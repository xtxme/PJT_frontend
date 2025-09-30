// auth.js
require("dotenv").config();
const express = require("express");
const router = express.Router();

// Email/Password Login (mock)
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    // mock users (จริงๆ ควรดึงจาก DB)
    if (email === "prae.tippy@gmail.com" && password === "1234") {
        return res.json({
            redirect: `${process.env.FRONTEND_DOMAIN_URL}:${process.env.FRONTEND_PORT}/owner`,
        });
    }

    if (email === "prts0774@gmail.com" && password === "1234") {
        return res.json({
            redirect: `${process.env.FRONTEND_DOMAIN_URL}:${process.env.FRONTEND_PORT}/sale`,
        });
    }

    // default
    res.json({
        redirect: `${process.env.FRONTEND_DOMAIN_URL}:${process.env.FRONTEND_PORT}/warehouse`,
    });
});

module.exports = router;
