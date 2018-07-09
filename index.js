const PORT = process.env.PORT || 3000;
const BASE_API_ENDPOINT = '/api/v1';

const express = require('express');
const database = require('./database');
const gtfsRouter = require('./src/gtfs.router');

database.init();
const app = express();

app.use(BASE_API_ENDPOINT, gtfsRouter);

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
