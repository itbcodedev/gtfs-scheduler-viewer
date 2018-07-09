const express = require('express');
const router = express.Router();
const db = require('../database').DATABASE;

router.get('/agencies', async (req, res) => {
  res.json(db.agencies);
});

router.get('/routes', async (req, res) => {
  res.json(db.routes);
});

router.get('/calendar', async (req, res) => {
  const { serviceId } = req.query;

  if (serviceId) {
    let calendar = db.calendar.find(x => x.serviceId === serviceId);
    res.json(calendar);
  } else {
    res.json({});
  }
});

router.get('/trips', async (req, res) => {
  res.json(db.trips);
});

router.get('/trips/:routeId', async (req, res) => {
  const { routeId } = req.params;
  let trips = db.trips.filter(x => x.routeId === routeId);
  let modifiedTrips = [];

  const compareBySequence = (a, b) => {
    a = Number.parseInt(a);
    b = Number.parseInt(b);
    return a - b;
  };

  for (let trip of trips) {
    const stops = db.stopWithstopTimes
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

router.get('/stops', async (req, res) => {
  const { tripId, routeId, stopId } = req.query;

  let routes = db.stopWithstopTimes;
  if (tripId) {
    routes = routes.filter(x => x.tripId === tripId);
  }
  if (routeId) {
    routes = routes.filter(x => x.routeId === routeId);
  }
  if (stopId) {
    routes = routes.filter(x => x.stopId === stopId);
  }

  res.json(routes);
});

router.get('/routes/:agencyId', async (req, res) => {
  const { agencyId } = req.params;
  const routes = db.routes.filter(x => x.agencyId === agencyId);
  res.json(routes);
});

module.exports = router;
