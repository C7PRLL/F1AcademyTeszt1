const express = require('express');
const router = express.Router();
const { User } = require('../models');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const {
  sendVerificationEmail,
  sendAdminRegistrationEmail,
} = require('../utils/mailer');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, 'profile-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// REGISZTRÁCIÓ
// Útvonal: POST /api/users/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'A név, email és jelszó megadása kötelező.',
      });
    }

    const existing = await User.findOne({ where: { email } });

    if (existing) {
      return res.status(400).json({
        error: 'Az email cím már foglalt!',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Minimum 32 hosszú, itt 64 hex karakter lesz
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // 24 órás aktiválási intervallum
    const verificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      is_verified: false,
      verification_token: verificationToken,
      verification_expires_at: verificationExpiresAt,
    });

    // Email a felhasználónak
    await sendVerificationEmail(
      newUser.email,
      newUser.name,
      verificationToken
    );

    // Email neked / adminnak
    await sendAdminRegistrationEmail(newUser, verificationToken);

    return res.status(201).json({
      message:
        'Sikeres regisztráció! Ellenőrizd az emailedet a fiók aktiválásához.',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        is_verified: newUser.is_verified,
      },
    });
  } catch (err) {
    console.error('REGISTER HIBA:', err);
    return res.status(500).json({ error: err.message });
  }
});

// FIÓK AKTIVÁLÁS
// Útvonal: GET /api/users/activate-account?token=...
router.get('/activate-account', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        error: 'Hiányzó token.',
      });
    }

    const user = await User.findOne({
      where: {
        verification_token: token,
        is_verified: false,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: 'Érvénytelen vagy már felhasznált token.',
      });
    }

    if (
      !user.verification_expires_at ||
      user.verification_expires_at < new Date()
    ) {
      return res.status(400).json({
        error: 'A token lejárt.',
      });
    }

    user.is_verified = true;
    user.verified_at = new Date();
    user.verification_token = null;
    user.verification_expires_at = null;

    await user.save();

    return res.status(200).json({
      message: 'A fiók sikeresen aktiválva lett.',
    });
  } catch (err) {
    console.error('AKTIVÁLÁSI HIBA:', err);
    return res.status(500).json({ error: err.message });
  }
});

// BEJELENTKEZÉS
// Útvonal: POST /api/users/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        error: 'Felhasználó nem található!',
      });
    }

    if (!user.password) {
      return res.status(400).json({
        error: 'Ez a felhasználó social loginon keresztül jött létre.',
      });
    }

    if (!user.is_verified) {
      return res.status(403).json({
        error: 'A fiók még nincs aktiválva. Ellenőrizd az emailedet.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        error: 'Hibás jelszó!',
      });
    }

    return res.status(200).json({
      message: 'Sikeres bejelentkezés!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        is_admin: user.is_admin,
        is_verified: user.is_verified,
      },
    });
  } catch (err) {
    console.error('LOGIN HIBA:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Profil adatok lekérése
// Útvonal: GET /api/users/:id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: 'Felhasználó nem található.',
      });
    }

    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Profil frissítése
// Útvonal: PUT /api/users/update/:id
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

    return res.json({
      message: 'Profil frissítve!',
      user: updatedUser,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;