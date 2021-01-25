var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var markerController = require("./markerController");
const http = require("http");
const url = require("url");

const hostname = "127.0.0.1";
const port = 3001;

//CORS middleware
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}
app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(express.static("public"));

// REST API for map markers
app.route("/markers/geojson")
  .get(markerController.fetchMarkersGeoJson);

app.route("/markers/info/:id")
  .get(markerController.fetchMarkersInfo);

app.route("/markers/create")
  .post(markerController.createNewMarker);

app.route("/markers/edit/:id")
  .put(markerController.editMarker);

app.route("/markers/delete/:id")
  .delete(markerController.deleteMarker);

app.listen(port, hostname, () => {
  console.log(`Server running AT http://${hostname}:${port}/`);
});
