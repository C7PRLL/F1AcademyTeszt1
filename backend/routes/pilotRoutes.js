const express = require('express');
const router = express.Router();
const { Pilot } = require('../models');

// Összes pilóta lekérése
router.get('/', async (req, res) => {
    try {
        const pilots = await Pilot.findAll();
        res.json(pilots);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Egy pilóta lekérése ID alapján
router.get('/:id', async (req, res) => {
    try {
        const pilot = await Pilot.findByPk(req.params.id);
        if (pilot) {
            res.json(pilot);
        } else {
            res.status(404).json({ message: 'Pilóta nem található' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;