const express = require('express');
const { Op } = require('sequelize');
const {
  Driver,
  DriverStanding,
  Constructor,
  ConstructorStanding,
} = require('../models');

const router = express.Router();

// Összes versenyző
router.get('/', async (req, res) => {
  try {
    const drivers = await Driver.findAll({
      order: [['family_name', 'ASC'], ['given_name', 'ASC']],
    });

    res.json(drivers);
  } catch (error) {
    console.error('Hiba a driverek lekérésekor:', error);
    res.status(500).json({ error: 'Nem sikerült lekérni a versenyzőket.' });
  }
});

// Aktuális pilóta tabella
router.get('/standings/drivers', async (req, res) => {
  try {
    const standings = await DriverStanding.findAll({
      order: [['position', 'ASC']],
    });

    const driverIds = [...new Set(standings.map((s) => s.driver_id).filter(Boolean))];
    const constructorIds = [...new Set(standings.map((s) => s.constructor_id).filter(Boolean))];

    const drivers = driverIds.length
      ? await Driver.findAll({
          where: {
            id: {
              [Op.in]: driverIds,
            },
          },
        })
      : [];

    const constructors = constructorIds.length
      ? await Constructor.findAll({
          where: {
            id: {
              [Op.in]: constructorIds,
            },
          },
        })
      : [];

    const driverMap = {};
    drivers.forEach((d) => {
      driverMap[d.id] = d;
    });

    const constructorMap = {};
    constructors.forEach((c) => {
      constructorMap[c.id] = c;
    });

    const result = standings.map((s) => ({
      ...s.toJSON(),
      driver: driverMap[s.driver_id] || null,
      constructor: constructorMap[s.constructor_id] || null,
    }));

    res.json(result);
  } catch (error) {
    console.error('Hiba a driver standings lekérésekor:', error);
    res.status(500).json({ error: 'Nem sikerült lekérni a pilóta tabellát.' });
  }
});

// Aktuális konstruktőri tabella
router.get('/standings/constructors', async (req, res) => {
  try {
    const standings = await ConstructorStanding.findAll({
      order: [['position', 'ASC']],
    });

    const constructorIds = [
      ...new Set(standings.map((s) => s.constructor_id).filter(Boolean)),
    ];

    const constructors = constructorIds.length
      ? await Constructor.findAll({
          where: {
            id: {
              [Op.in]: constructorIds,
            },
          },
        })
      : [];

    const constructorMap = {};
    constructors.forEach((c) => {
      constructorMap[c.id] = c;
    });

    const result = standings.map((s) => ({
      ...s.toJSON(),
      constructor: constructorMap[s.constructor_id] || null,
    }));

    res.json(result);
  } catch (error) {
    console.error('Hiba a constructor standings lekérésekor:', error);
    res.status(500).json({ error: 'Nem sikerült lekérni a konstruktőri tabellát.' });
  }
});

module.exports = router;