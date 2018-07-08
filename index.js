const express = require('express');
const PORT = process.env.PORT || 3000;
const BASE_API_ENDPOINT = '/api/v1';

const {
  loadGTFSDataFromFile,
  loadTripsToRoute,
  loadStops
} = require('./gtfs-helper');
const db = require('./database');
const app = express();

async function init() {
  db.agencies = await loadGTFSDataFromFile('./sample-feed/agency.txt');
  db.routes = await loadGTFSDataFromFile('./sample-feed/routes.txt');
  db.trips = await loadGTFSDataFromFile('./sample-feed/trips.txt');
  db.stops = await loadGTFSDataFromFile('./sample-feed/stops.txt');
}

init();

app.get(BASE_API_ENDPOINT + '/agencies', async (req, res) => {
  res.json(db.agencies);
});

app.get(BASE_API_ENDPOINT + '/routes', async (req, res) => {
  res.json(db.routes);
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
