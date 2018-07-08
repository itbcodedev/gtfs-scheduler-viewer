const express = require('express');
const PORT = process.env.PORT || 3000;
const BASE_API_ENDPOINT = '/api/v1';

const {
  loadGTFSDataFromFile,
  loadStopsWithTrip,
  loadStopsWithTimes
} = require('./gtfs-helper');
const db = require('./database');
const app = express();

async function init() {
  db.agencies = await loadGTFSDataFromFile('./sample-feed/agency.txt');
  db.routes = await loadGTFSDataFromFile('./sample-feed/routes.txt');
  db.trips = await loadGTFSDataFromFile('./sample-feed/trips.txt');
  db.stopTimes = await loadStopsWithTimes();
  db.stops = await loadStopsWithTrip();
}

init();

app.get(BASE_API_ENDPOINT + '/agencies', async (req, res) => {
  res.json(db.agencies);
});

app.get(BASE_API_ENDPOINT + '/routes', async (req, res) => {
  res.json(db.routes);
});

app.get(BASE_API_ENDPOINT + '/trips', async (req, res) => {
  res.json(db.trips);
});

app.get(BASE_API_ENDPOINT + '/trips/:routeId', async (req, res) => {
  const { routeId } = req.params;
  let trips = db.trips.filter(x => x.routeId === routeId);
  let modifiedTrips = [];

  const compareBySequence = (a, b) => {
    a = Number.parseInt(a);
    b = Number.parseInt(b);
    return a - b;
  };

  for (let trip of trips) {
    const stops = db.stopTimes
      .filter(x => x.tripId === trip.tripId)
      .sort(compareBySequence);
    const first = stops[0].stopName;
    const last = stops[stops.length - 1].stopName;

    const newTrip = Object.assign({}, trip, {
      name: first + ' to ' + last
    });

    modifiedTrips.push(newTrip);
  }

  res.json(modifiedTrips);
});

app.get(BASE_API_ENDPOINT + '/stops', async (req, res) => {
  const { tripId, routeId } = req.query;

  let routes = db.stops;
  if (tripId) {
    routes = routes.filter(x => x.tripId === tripId);
  }
  if (routeId) {
    routes = routes.filter(x => x.routeId === routeId);
  }

  res.json(routes);
});

app.get(BASE_API_ENDPOINT + '/routes/:agencyId', async (req, res) => {
  const { agencyId } = req.params;
  const routes = db.routes.filter(x => x.agencyId === agencyId);
  res.json(routes);
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/dist/client'));
  app.get('*', (req, res) => {
    res.sendFile(
      require('path').resolve(
        __dirname,
        'client',
        'dist',
        'client',
        'index.html'
      )
    );
  });
}

app.listen(PORT, () => {
  console.log('App listening on port:', PORT);
});
