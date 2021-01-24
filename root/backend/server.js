// Asenna ensin express npm install express --save

var express = require("express");
var app = express();

// Otetaan käyttöön body-parser, jotta voidaan html-requestista käsitellä viestin body post requestia varten... *
var bodyParser = require("body-parser");
// Pyyntöjen reitittämistä varten voidaan käyttää Controllereita
var markerController = require("./markerController");

const http = require("http");
const url = require("url");

const hostname = "127.0.0.1";
const port = 3001;

//CORS middleware
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  // Jos halutaan, että delete ja put -metodit toimivat, niin näiden pitää olla näin:
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
}
// Otetaan käyttöön CORS säännöt:
app.use(allowCrossDomain);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); //* ...jsonina

// Staattiset tiedostot, esim. kuvat, tyylitiedostot, scriptit käyttöliittymää varten
app.use(express.static("public"));

// REST API map markers
app.route("/markers/geojson")
  .get(markerController.fetchMarkersGeoJson);

app.route("/markers/info/:id")
  .get(markerController.fetchMarkersInfo);

  app.route("/markers/create")
  .post(markerController.createNewMarker);

app.listen(port, hostname, () => {
  console.log(`Server running AT http://${hostname}:${port}/`);
});

/*
app.listen(port, () => {
    console.log(`Server running AT http://${port}/`);
  });
*/
