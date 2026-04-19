const express = require('express');
const router = express.Router();
const { User, Booking } = require('../models');

function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Nincs bejelentkezve.' });
  }

  if (!req.user.is_admin) {
    return res.status(403).json({ error: 'Nincs admin jogosultságod.' });
  }

  next();
}

// Összes user lekérése
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        'id',
        'name',
        'email',
        'is_admin',
        'is_verified',
        'createdAt',
        'updatedAt',
      ],
      order: [['id', 'ASC']],
    });

    return res.json(users);
  } catch (err) {
    console.error('ADMIN USERS GET HIBA:', err);
    return res.status(500).json({ error: err.message });
  }
});

// User törlése
router.delete('/users/:id', requireAdmin, async (req, res) => {
  try {
    const targetUserId = Number(req.params.id);

    if (req.user.id === targetUserId) {
      return res.status(400).json({
        error: 'Saját magadat nem törölheted.',
      });
    }

    const user = await User.findByPk(targetUserId);

    if (!user) {
      return res.status(404).json({ error: 'Felhasználó nem található.' });
    }

    await Booking.destroy({
      where: { user_id: targetUserId },
    });

    await user.destroy();

    return res.json({ message: 'Felhasználó sikeresen törölve.' });
  } catch (err) {
    console.error('ADMIN USER DELETE HIBA:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Összes foglalás lekérése
router.get('/bookings', requireAdmin, async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      order: [
        ['booking_date', 'ASC'],
        ['time_slot', 'ASC'],
        ['id', 'ASC'],
      ],
    });

    return res.json(bookings);
  } catch (err) {
    console.error('ADMIN BOOKINGS GET HIBA:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Foglalás módosítása
router.put('/bookings/:id', requireAdmin, async (req, res) => {
  try {
    const { activity_type, booking_date, time_slot } = req.body;

    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Foglalás nem található.' });
    }

    if (!activity_type || !booking_date || !time_slot) {
      return res.status(400).json({
        error: 'Az activity_type, booking_date és time_slot mezők kötelezőek.',
      });
    }

    booking.activity_type = activity_type;
    booking.booking_date = booking_date;
    booking.time_slot = time_slot;

    await booking.save();

    return res.json({
      message: 'Foglalás sikeresen módosítva.',
      booking,
    });
  } catch (err) {
    console.error('ADMIN BOOKING UPDATE HIBA:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Foglalás törlése
router.delete('/bookings/:id', requireAdmin, async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Foglalás nem található.' });
    }

    await booking.destroy();

    return res.json({ message: 'Foglalás sikeresen törölve.' });
  } catch (err) {
    console.error('ADMIN BOOKING DELETE HIBA:', err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;