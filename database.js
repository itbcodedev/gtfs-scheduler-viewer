const {
  loadGTFSDataFromFile,
  loadStopsWithTrip,
  loadStopsWithTimes
} = require('./src/gtfs-helper');

const DATABASE = {
  agencies: [],
  routes: [],
  trips: [],
  stops: [],
  calendar: []
};

async function init() {
  DATABASE.agencies = await loadGTFSDataFromFile('./sample-feed/agency.txt');
  DATABASE.routes = await loadGTFSDataFromFile('./sample-feed/routes.txt');
  DATABASE.trips = await loadGTFSDataFromFile('./sample-feed/trips.txt');
  DATABASE.calendar = await loadGTFSDataFromFile('./sample-feed/calendar.txt');
  DATABASE.stopWithstopTimes = await loadStopsWithTimes();
  DATABASE.stopsWithTrip = await loadStopsWithTrip();
}

module.exports = {
  init,
  DATABASE
};
