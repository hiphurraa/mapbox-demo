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

    createNewMarker: function (req, res) {
        const invalidInput = validateInput(req.body);

        if (invalidInput){
            console.log("Creating new marker attempt failed: -" + JSON.stringify(invalidInput));
            res.status(400);
            res.json(invalidInput);
            return;
        }

        const { latitude, longitude, title, description } = req.body.data;

        console.log(req.body);
        var query = 'INSERT INTO mapmarker.marker (latitude, longitude, title, description) '+ 
                    `VALUES ("${latitude}", "${longitude}", "${title}", "${description}");`
        connection.query(query, function (error, results, fields) {
            if (error) {
                console.log(`Error creating new marker: ${error.message}`);
                res.status(500);
            } 
            else {
                console.log('New marker created succesfully.')
                res.status(200);
            }
        });

    },

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

}; // module.exports

function validateInput (input) {
    try{
        const data = input.data;

        if (data.title.length < 1 || data.title.length > 25){
            return "Title length should be 1-25 characters";
        }
        else if (data.description.length < 1 || data.description.length > 100){
            return "Description length should be 1-100 characters";
        }
        else {
            return;
        }
    }
    catch{
        return "Unknown error with input data";
    }
}