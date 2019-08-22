const fs = require('fs');
const auth = require('./authorize');
const services = require('./services');
const express = require('express');

const app = express();
const port = 3000;

app.use(express.static('./public'));

app.get('/prov', (req, res) => {
  // Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials.
    auth.authorize(JSON.parse(content), services.getTests, res);
  });
});

app.get('/uppgifter', (req, res) => {
  // Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials.
    auth.authorize(JSON.parse(content), services.getAssignments, res);
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});