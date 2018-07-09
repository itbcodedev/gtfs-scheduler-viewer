const isStringNullOrEmpty = str => str === null || str.length === 0;
const numericFields = { stopSequence: 1 };
const isNumericField = field => (numericFields[field] ? true : false);

function loadGTFSDataFromFile(filepath) {
  return new Promise((resolve, reject) => {
    let lineCount = 0;
    let fields = [];
    let data = [];

    const fileHandler = require('readline').createInterface({
      input: require('fs').createReadStream(filepath)
    });

    fileHandler.on('line', line => {
      const cells = line.split(',');
      if (lineCount === 0) {
        cells.forEach(c => fields.push(toJsonNamingConvetion(c)));
      } else {
        let resource = {};
        for (let i = 0; i < fields.length; i++) {
          const name = fields[i];
          resource[name] = isNumericField(name)
            ? Number.parseInt(cells[i])
            : cells[i];
        }

        data.push(resource);
      }

      lineCount++;
    });

    fileHandler.on('close', () => {
      resolve(data);
    });
  });
}

async function loadStopsWithTrip() {
  const stops = await loadGTFSDataFromFile('./sample-feed/stops.txt');
  const stop_times = await loadGTFSDataFromFile('./sample-feed/stop_times.txt');
  const trips = await loadGTFSDataFromFile('./sample-feed/trips.txt');

  const joinedStopTimes = [];
  for (const stopTime of stop_times) {
    const stop = stops.find(x => x.stopId === stopTime.stopId);
    const trip = trips.find(x => x.tripId === stopTime.tripId);

    const newStopTime = Object.assign({}, stopTime, stop, trip);
    joinedStopTimes.push(newStopTime);
  }

  return joinedStopTimes;
}

async function loadStopsWithTimes() {
  const stops = await loadGTFSDataFromFile('./sample-feed/stops.txt');
  const stop_times = await loadGTFSDataFromFile('./sample-feed/stop_times.txt');

  const joinedStopTimes = [];
  for (const stopTime of stop_times) {
    const stop = stops.find(x => x.stopId === stopTime.stopId);
    const newStopTime = Object.assign({}, stopTime, stop);
    joinedStopTimes.push(newStopTime);
  }

  return joinedStopTimes;
}

async function loadTripsToRoute(routes) {
  const trips = await loadGTFSDataFromFile('./sample-feed/trips.txt');
  const stops = await loadGTFSDataFromFile('./sample-feed/stops.txt');
  const stop_times = await loadGTFSDataFromFile('./sample-feed/stop_times.txt');

  const joinedStopTimes = [];
  for (const stopTime of stop_times) {
    const stop = stops.find(x => x.stopId === stopTime.stopId);
    const newStopTime = Object.assign({}, stopTime, stop);
    joinedStopTimes.push(newStopTime);
  }

  const joinedTrips = [];
  for (const trip of trips) {
    const stopTimes = joinedStopTimes.filter(x => x.tripId === trip.tripId);
    const newTrip = Object.assign({}, trip, {
      stops: stopTimes
    });

    joinedTrips.push(newTrip);
  }

  return joinedTrips;
}

function toJsonNamingConvetion(str) {
  if (isStringNullOrEmpty(str)) {
    return str;
  }
  const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

  return str
    .split('_')
    .map((x, i) => (i === 0 ? x : capitalize(x)))
    .join('');
}

function isNumeric(value) {
  return !isNaN(value);
}

module.exports = {
  loadGTFSDataFromFile,
  loadTripsToRoute,
  loadStopsWithTimes,
  loadStopsWithTrip
};
