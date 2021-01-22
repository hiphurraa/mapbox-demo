"use strict";

var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "ruutti",
  database: "mapmarker",
});

module.exports = {

    // Fetch map markers from database and respond with geoJSON data
    fetchMarkersGeoJson: function (req, res) {
        var query = 'SELECT * from marker;';
        connection.query(query, function (error, results, fields) {
            if (error) {
                console.log(`Error fetching the map markers from database: ${error.message}`);
                res.status(500);
            } 
            else {
                // Reform data to geoJSON form
                try{
                    var features = results.map(function(item){
                        return {
                            'Type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [item.longitude, item.latitude]
                            },
                            'properties': {
                                'id': item.id,
                                'title': item.title,
                                'description': item.description
                            }
                        };
                    });

                    var geoJsonData = {
                        type: "FeatureCollection",
                        features: features
                    };
                }
                catch(any){
                    console.log("Error reforming map markers data.");
                    res.status(500);
                    return;
                }
                
                res.status(200);
                res.json(geoJsonData);
            }
        });

    },//fetchMarkersGeoJson()

    fetchMarkersInfo: function (req, res) {
        var query = 'SELECT * from marker;';
        connection.query(query, function (error, results, fields) {
            if (error) {
                console.log(`Error fetching the map markers from database: ${error.message}`);
                res.status(500);
            } 
            else {
                // Reform data to wanted form
                try{
                    if (false){
                        var markersData = result.map(function (item){
                            return {
                            };
                        }) 
                    }
                }
                catch(any){
                    console.log("Error reforming map markers data.");
                    res.status(500);
                    return;
                }
                
                res.status(200);
                res.json(results);
            }
        });
    }



};