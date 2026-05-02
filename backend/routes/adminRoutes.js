const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { User, Booking } = require('../models');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Nincs bejelentkezve.' });
  }

  if (!req.user.is_admin) {
    return res.status(403).json({ error: 'Nincs admin jogosultságod.' });
  }

  next();
}

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

    const deletedUserEmail = user.email;
    const deletedUserName = user.name;

    await Booking.destroy({
      where: { user_id: targetUserId },
    });

    await user.destroy();

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: deletedUserEmail,
      subject: 'Felhasználói fiók törlése - F1 Academy',
      html: `
        <h2>Szia ${deletedUserName}!</h2>

        <p>Értesítünk, hogy a felhasználói fiókodat az adminisztrátor törölte a rendszerből.</p>

        <p>A törléssel együtt a fiókodhoz tartozó foglalások is eltávolításra kerültek.</p>

        <p>Üdv,<br>F1 Academy</p>
      `,
    });

    return res.json({ message: 'Felhasználó sikeresen törölve, email értesítés elküldve.' });
  } catch (err) {
    console.error('ADMIN USER DELETE HIBA:', err);
    return res.status(500).json({ error: err.message });
  }
});

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

router.delete('/bookings/:id', requireAdmin, async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (!booking) {
      return res.status(404).json({ error: 'Foglalás nem található.' });
    }

    const userEmail = booking.user?.email;
    const userName = booking.user?.name;

    const activityType = booking.activity_type;
    const bookingDate = booking.booking_date;
    const timeSlot = booking.time_slot;

    await booking.destroy();

    if (userEmail) {
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: userEmail,
        subject: 'Időpontfoglalás törlése - F1 Academy',
        html: `
          <h2>Szia ${userName}!</h2>

          <p>Értesítünk, hogy az adminisztrátor törölte az alábbi időpontfoglalásodat.</p>

          <p><strong>Foglalás részletei:</strong></p>

          <ul>
            <li>Gokart típusa: ${activityType}</li>
            <li>Dátum: ${bookingDate}</li>
            <li>Idősáv: ${timeSlot}</li>
          </ul>

          <p>Üdv,<br>F1 Academy</p>
        `,
      });
    }

    return res.json({ message: 'Foglalás sikeresen törölve, email értesítés elküldve.' });
  } catch (err) {
    console.error('ADMIN BOOKING DELETE HIBA:', err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;  