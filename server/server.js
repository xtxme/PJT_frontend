// server.js
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const cors = require("cors");
// const authRoutes = require("./auth"); // << import route ที่แยกมา

const app = express();

app.use(express.json()); // ต้องมีเพื่ออ่าน JSON body

function normalizeOrigin(origin) {
    if (typeof origin !== "string") {
        return null;
    }

    return origin.trim().replace(/\/$/, "");
}

const frontendDomain = normalizeOrigin(process.env.FRONTEND_DOMAIN_URL);
const frontendPort = process.env.FRONTEND_PORT;
const defaultFrontendOrigin =
    frontendDomain && frontendPort
        ? `${frontendDomain}:${frontendPort}`
        : frontendDomain;

const extraFrontendOrigins = (process.env.FRONTEND_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean);

const allowedOrigins = new Set(
    [defaultFrontendOrigin, ...extraFrontendOrigins].filter(Boolean)
);

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) {
                // Allow non-browser or same-origin requests (e.g., curl, server-to-server)
                return callback(null, true);
            }

            const normalizedOrigin = normalizeOrigin(origin);

            if (normalizedOrigin && allowedOrigins.has(normalizedOrigin)) {
                return callback(null, true);
            }

            return callback(
                new Error(`Origin ${origin} not allowed by CORS configuration`)
            );
        },
        credentials: true, // เผื่อใช้ session/cookie
    })
);

// Session setup
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

// Google Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        (accessToken, refreshToken, profile, done) => {
            return done(null, profile);
        }
    )
);

// Routes
app.get("/", (req, res) => {
    res.send("Welcome to the OAuth server");
});

// Google login
app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback
app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        const userEmail = req.user.emails[0].value;

        if (userEmail === "prae.tippy@gmail.com") {
            return res.redirect(
                `${process.env.FRONTEND_DOMAIN_URL}:${process.env.FRONTEND_PORT}/owner`
            );
        }

        if (userEmail === "prts0774@gmail.com") {
            return res.redirect(
                `${process.env.FRONTEND_DOMAIN_URL}:${process.env.FRONTEND_PORT}/sale`
            );
        }

        res.redirect(
            `${process.env.FRONTEND_DOMAIN_URL}:${process.env.FRONTEND_PORT}/warehouse`
        );
    }
);

// Mount Email/Password routes
app.post("/auth/login", (req, res) => {
    const { email, password } = req.body;

    // mock users (จริงๆ ควรดึงจาก DB)
    if (email === "owner@gmail.com" && password === "1234") {
        return res.json({
            redirect: `${process.env.FRONTEND_DOMAIN_URL}:${process.env.FRONTEND_PORT}/owner`,
            role: "owner",
        });
    }

    if (email === "sales@gmail.com" && password === "1234") {
        return res.json({
            redirect: `${process.env.FRONTEND_DOMAIN_URL}:${process.env.FRONTEND_PORT}/sale`,
            role: "sale",
        });
    }

    if (email === "warehouse@gmail.com" && password === "1234") {
        return res.json({
            redirect: `${process.env.FRONTEND_DOMAIN_URL}:${process.env.FRONTEND_PORT}/warehouse`,
            role: "warehouse",
        });
    }

    return res.status(401).json({
        message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
    });
});

/**
 * Helper to calculate percentage change between current and previous values.
 * Returns null when previous value is 0 to avoid dividing by zero.
 */
function getPercentChange(current, previous) {
    if (typeof current !== "number" || typeof previous !== "number") {
        return null;
    }

    if (previous === 0) {
        return null;
    }

    const diff = current - previous;
    return (diff / Math.abs(previous)) * 100;
}

// --- Mock analytics endpoints for dashboard ---
app.get("/analytics/sales/monthly-total", (_req, res) => {
    const previousMonthTotal = 1123456.78;
    const currentMonthTotal = 1234567.89;

    res.json({
        currentMonthTotal,
        previousMonthTotal,
        percentChange: getPercentChange(currentMonthTotal, previousMonthTotal),
    });
});

app.get("/analytics/profit/monthly-total", (_req, res) => {
    const previousMonthNetProfit = 245678.9;
    const currentMonthNetProfit = 268910.25;

    res.json({
        currentMonthNetProfit,
        previousMonthNetProfit,
        percentChange: getPercentChange(currentMonthNetProfit, previousMonthNetProfit),
    });
});

app.listen(process.env.BACKEND_PORT, () => {
    console.log(
        `Server running on ${process.env.BACKEND_DOMAIN_URL}:${process.env.BACKEND_PORT}`
    );
});
