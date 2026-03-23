const axios = require('axios');
const {
  Driver,
  Constructor,
  DriverStanding,
  ConstructorStanding,
} = require('../models');

const JOLPICA_BASE_URL = 'https://api.jolpi.ca/ergast/f1';

function extractDriverList(responseData) {
  return responseData?.MRData?.DriverTable?.Drivers || [];
}

function extractDriverStandingsList(responseData) {
  return (
    responseData?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings ||
    []
  );
}

function extractConstructorStandingsList(responseData) {
  return (
    responseData?.MRData?.StandingsTable?.StandingsLists?.[0]
      ?.ConstructorStandings || []
  );
}

async function syncDrivers() {
  let offset = 0;
  const limit = 100;
  let total = Infinity;
  let processed = 0;

  while (offset < total) {
    const url = `${JOLPICA_BASE_URL}/drivers.json?limit=${limit}&offset=${offset}`;
    const response = await axios.get(url);
    const data = response.data;

    const drivers = extractDriverList(data);
    total = Number(data?.MRData?.total || 0);

    for (const item of drivers) {
      const driverId = item.driverId;
      const givenName = item.givenName || '';
      const familyName = item.familyName || '';
      const fullName = `${givenName} ${familyName}`.trim();

      await Driver.upsert({
        external_id: driverId,
        given_name: givenName,
        family_name: familyName,
        full_name: fullName,
        code: item.code || null,
        permanent_number: item.permanentNumber || null,
        nationality: item.nationality || null,
        date_of_birth: item.dateOfBirth || null,
        wiki_url: item.url || null,
        last_synced_at: new Date(),
      });

      processed += 1;
    }

    offset += limit;
  }

  return {
    success: true,
    processed,
  };
}

async function syncCurrentDriverStandings() {
  const url = `${JOLPICA_BASE_URL}/current/driverstandings.json`;
  const response = await axios.get(url);
  const standings = extractDriverStandingsList(response.data);

  if (!standings.length) {
    return {
      success: true,
      processed: 0,
      message: 'Nincs driver standings adat.',
    };
  }

  const seasonYear = Number(
    response.data?.MRData?.StandingsTable?.season || new Date().getFullYear()
  );
  const round = Number(
    response.data?.MRData?.StandingsTable?.round || 0
  );

  await DriverStanding.destroy({
    where: {
      season_year: seasonYear,
      round,
    },
  });

  let processed = 0;

  for (const item of standings) {
    const driverExternalId = item?.Driver?.driverId;
    if (!driverExternalId) continue;

    const [driver] = await Driver.findOrCreate({
      where: { external_id: driverExternalId },
      defaults: {
        external_id: driverExternalId,
        given_name: item?.Driver?.givenName || '',
        family_name: item?.Driver?.familyName || '',
        full_name: `${item?.Driver?.givenName || ''} ${item?.Driver?.familyName || ''}`.trim(),
        code: item?.Driver?.code || null,
        permanent_number: item?.Driver?.permanentNumber || null,
        nationality: item?.Driver?.nationality || null,
        date_of_birth: item?.Driver?.dateOfBirth || null,
        wiki_url: item?.Driver?.url || null,
        is_active: true,
        last_synced_at: new Date(),
      },
    });

    const constructorInfo = item?.Constructors?.[0];
    let constructorId = null;

    if (constructorInfo?.constructorId) {
      const [constructor] = await Constructor.findOrCreate({
        where: { external_id: constructorInfo.constructorId },
        defaults: {
          external_id: constructorInfo.constructorId,
          name: constructorInfo.name || constructorInfo.constructorId,
          nationality: constructorInfo.nationality || null,
          wiki_url: constructorInfo.url || null,
          last_synced_at: new Date(),
        },
      });

      constructorId = constructor.id;
    }

    await DriverStanding.create({
      season_year: seasonYear,
      round,
      driver_id: driver.id,
      constructor_id: constructorId,
      position: Number(item.position),
      points: Number(item.points || 0),
      wins: Number(item.wins || 0),
      fetched_at: new Date(),
    });

    await driver.update({
      is_active: true,
      last_synced_at: new Date(),
    });

    processed += 1;
  }

  return {
    success: true,
    processed,
    season_year: seasonYear,
    round,
  };
}

async function syncCurrentConstructorStandings() {
  const url = `${JOLPICA_BASE_URL}/current/constructorstandings.json`;
  const response = await axios.get(url);
  const standings = extractConstructorStandingsList(response.data);

  if (!standings.length) {
    return {
      success: true,
      processed: 0,
      message: 'Nincs constructor standings adat.',
    };
  }

  const seasonYear = Number(
    response.data?.MRData?.StandingsTable?.season || new Date().getFullYear()
  );
  const round = Number(
    response.data?.MRData?.StandingsTable?.round || 0
  );

  await ConstructorStanding.destroy({
    where: {
      season_year: seasonYear,
      round,
    },
  });

  let processed = 0;

  for (const item of standings) {
    const constructorExternalId = item?.Constructor?.constructorId;
    if (!constructorExternalId) continue;

    const [constructor] = await Constructor.findOrCreate({
      where: { external_id: constructorExternalId },
      defaults: {
        external_id: constructorExternalId,
        name: item?.Constructor?.name || constructorExternalId,
        nationality: item?.Constructor?.nationality || null,
        wiki_url: item?.Constructor?.url || null,
        last_synced_at: new Date(),
      },
    });

    await ConstructorStanding.create({
      season_year: seasonYear,
      round,
      constructor_id: constructor.id,
      position: Number(item.position),
      points: Number(item.points || 0),
      wins: Number(item.wins || 0),
      fetched_at: new Date(),
    });

    await constructor.update({
      last_synced_at: new Date(),
    });

    processed += 1;
  }

  return {
    success: true,
    processed,
    season_year: seasonYear,
    round,
  };
}

async function fullF1Sync() {
  const driversResult = await syncDrivers();
  const driverStandingsResult = await syncCurrentDriverStandings();
  const constructorStandingsResult = await syncCurrentConstructorStandings();

  return {
    success: true,
    drivers: driversResult,
    driverStandings: driverStandingsResult,
    constructorStandings: constructorStandingsResult,
  };
}

module.exports = {
  syncDrivers,
  syncCurrentDriverStandings,
  syncCurrentConstructorStandings,
  fullF1Sync,
};