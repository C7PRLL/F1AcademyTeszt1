const express = require('express');
const router = express.Router();
const { User } = require('../models');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, 'profile-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// REGISZTRÁCIÓ
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Az email cím már foglalt!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: 'Sikeres regisztráció!',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error('REGISTER HIBA:', err);
    res.status(500).json({ error: err.message });
  }
});

// BEJELENTKEZÉS
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'Felhasználó nem található!' });
    }

    if (!user.password) {
      return res.status(400).json({
        error: 'Ez a felhasználó social loginon keresztül jött létre.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Hibás jelszó!' });
    }

    res.json({
      message: 'Sikeres bejelentkezés!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        is_admin: user.is_admin,
      },
    });
  } catch (err) {
    console.error('LOGIN HIBA:', err);
    res.status(500).json({ error: err.message });
  }
});

// Profil adatok lekérése
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Profil frissítése
router.put('/update/:id', upload.single('image'), async (req, res) => {
  try {
    const { bio, favorite_team, favorite_pilot } = req.body;

    const updateData = {
      bio,
      favorite_team,
      favorite_pilot,
    };

    if (req.file) {
      updateData.profile_image = req.file.filename;
    }

    await User.update(updateData, {
      where: { id: req.params.id },
    });

    const updatedUser = await User.findByPk(req.params.id);

    res.json({
      message: 'Profil frissítve!',
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;