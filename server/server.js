// server.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();

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
            // Here you can save user to database if needed
            return done(null, profile);
        }
    )
);

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the OAuth server');
});

// Redirect user to Google login
app.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google callback
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Example: frontend URL
        res.redirect(`${process.env.FRONTEND_DOMAIN_URL}:${process.env.FRONTEND_PORT}/warehouse`);
    }
);

app.listen(process.env.BACKEND_PORT, () => {
    console.log(`Server running on ${process.env.BACKEND_DOMAIN_URL}:${process.env.BACKEND_PORT}`);
});
