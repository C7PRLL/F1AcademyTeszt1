const express = require('express');
const router = express.Router();
const { User } = require('../models');

// Regisztráció (Adat mentése)
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const newUser = await User.create({ name, email, password });
        res.status(201).json({ message: "Sikeres regisztráció!", user: newUser });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;