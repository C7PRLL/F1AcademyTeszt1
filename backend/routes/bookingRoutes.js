const express = require('express');
const router = express.Router();
const { Booking } = require('../models');

// Új foglalás mentése
router.post('/', async (req, res) => {
    try {
        // --- JAVÍTVA: Itt ki kell venni az activity_type-ot is a kérésből ---
        const { user_id, activity_type, booking_date, time_slot } = req.body;
        
        // --- JAVÍTVA: Be kell tenni a létrehozásba ---
        const newBooking = await Booking.create({ 
            user_id, 
            activity_type, 
            booking_date, 
            time_slot 
        });
        
        res.status(201).json(newBooking);
    } catch (err) {
        // Ez segít neked látni a terminálban, ha valami elszáll
        console.error("Szerver hiba mentéskor:", err); 
        res.status(400).json({ error: err.message });
    }
});

// Egy adott felhasználó saját foglalásainak lekérése
router.get('/my-bookings/:userId', async (req, res) => {
    try {
        const bookings = await Booking.findAll({ where: { user_id: req.params.userId } });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;