const fs = require('fs');
const auth = require('./authorize');
const services = require('./services');
const express = require('express');

const app = express();
const port = 3000;

app.get('/courses', (req, res) => {
  res.send("Kurser");
  // Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials.
    auth.authorize(JSON.parse(content), services.getCourses);
  });
});

app.get('/tests', (req, res) => {
  res.send("Prov");
  // Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials.
    auth.authorize(JSON.parse(content), services.getTests);
  });
});

app.get('/assignments', (req, res) => {
  res.send("Läxor");
  // Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials.
    auth.authorize(JSON.parse(content), services.getAssignments);
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});