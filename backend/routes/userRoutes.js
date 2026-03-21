const express = require('express');
const router = express.Router();
const { User } = require('../models');

// --- 1. REGISZTRÁCIÓ ---
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Létrehozzuk az új felhasználót
        const newUser = await User.create({ name, email, password });
        res.status(201).json({ message: "Sikeres regisztráció!", user: newUser });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// --- 2. BEJELENTKEZÉS (ÚJ RÉSZ) ---
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Felhasználó keresése az adatbázisban email alapján
        const user = await User.findOne({ where: { email } });

        // Ha nem találunk ilyen emailt
        if (!user) {
            return res.status(404).json({ error: "Felhasználó nem található!" });
        }

        // Jelszó ellenőrzése (egyelőre sima szövegként hasonlítjuk össze)
        if (user.password !== password) {
            return res.status(401).json({ error: "Hibás jelszó!" });
        }

        // Ha minden stimmel, visszaküldjük a sikert és a felhasználó adatait
        res.json({
            message: "Sikeres bejelentkezés!",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                is_admin: user.is_admin
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;