const express = require('express');
const PORT = process.env.PORT || 3000;

const { loadGTFSDataFromFile, loadTripsToRoute } = require('./gtfs-helper');
const db = require('./database');

const app = express();

async function init() {
  db.agencies = await loadGTFSDataFromFile('./sample-feed/agency.txt');
  db.routes = await loadGTFSDataFromFile('./sample-feed/routes.txt');
  db.trips = await loadTripsToRoute(db.routes);
}

init();

app.get('/agencies', async (req, res) => {
  res.json(db.agencies);
});

app.get('/routes', async (req, res) => {
  res.json(db.routes);
});

app.get('/trips', async (req, res) => {
  res.json(db.trips);
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
