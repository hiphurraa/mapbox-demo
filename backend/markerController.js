"use strict";

var mysql = require('mysql');
var {MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE} = require('../mysql_settings.json');

var connection = mysql.createConnection({
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE
});

module.exports = {

    createNewMarker: function (req, res) {
        const badInput = validateInput(req.body);
        if (badInput){
            console.log("Creating new marker attempt failed: -" + JSON.stringify(badInput));
            res.status(400).json({'badInput': badInput, 'status': 400});
            return;
        }

        const { latitude, longitude, title, description } = req.body.data;

        var query = 'INSERT INTO mapmarker.marker (latitude, longitude, title, description) '+ 
                    `VALUES ("${latitude}", "${longitude}", "${title}", "${description}");`;

        connection.query(query, function (error, results, fields) {
            if (error) {
                console.log(`Error creating new marker: ${error.message}`);
                res.status(500);
            } 
            else {
                console.log('New marker created succesfully.')
                res.status(200).json('Marker created succesfully.')
            }
        });

    }, // createNewMarker()


    editMarker: function (req, res) {
        // const badInput = validateInput(req.body);
        // if (badInput){
        //     console.log("Editing marker attempt failed: -" + JSON.stringify(badInput));
        //     res.status(400).json({'badInput': badInput, 'status': 400});
        //     return;
        // }

        var query = "";

        try{
            const {latitude, longitude, title, description} = req.body.data;
            const id = req.params.id;
    
            query =
                "UPDATE marker" +
                ` SET latitude = "${latitude}",` +
                ` longitude = "${longitude}",` +
                ` title = "${title}",` +
                ` description = "${description}"` +
                ` WHERE id = ${id};`;

            connection.query(query, function (error, results, fields) {
                if (error) {
                    console.log(`Error editing marker: ${error.message}`);
                    res.status(500);
                } 
                else {
                    console.log('Marker edited succesfully.')
                    res.status(200).json('Marker edited succesfully.');
                }
            });
        }
        catch(any){
            console.log('Error editing marker: bad request');
            res.status(400);
            return;
        }

    }, // editMarker()


    deleteMarker : function (req, res) {
        var query = '';
        var id = '';
        try {   
            id = req.params.id;
            query = `DELETE FROM marker WHERE id = ${id};`;
        }
        catch(any){
            console.log('Error deleting marker: bad request')
            res.status(400);
            return;
        }

        connection.query(query, function (error, results, fields) {
            if (error) {
                console.log(`Error deleting marker: ${error.message}`);
                res.status(500);
            } 
            else {
                console.log('Marker deleted succesfully.')
                res.status(200).json('Marker deleted succesfully.');
            }
        });

    }, // deleteMarker()


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
                
                res.status(200).json(geoJsonData);
            }
        });

    },//fetchMarkersGeoJson()


    fetchMarkersInfo: function (req, res) {
        var id = '';
        try{
            id = req.params.id;
        }
        catch(any){
            console.log('Error fetching markers info: Bad request');
            res.status(400);
            return;
        }
        var query = '';
        if (id == 'all'){
            query = 'SELECT * from marker;';
        }
        else {
            query = `SELECT * from marker WHERE id = ${id}`;
        }
        connection.query(query, function (error, results, fields) {
            if (error) {
                console.log(`Error fetching the map markers from database: ${error.message}`);
                res.status(500);
            } 
            else {
                res.status(200);
                res.json(results);
            }
        });

    } // fetchMarkersInfo()


}; // module.exports


function validateInput (input) {
    try{
        const data = input.data;

        if (data.title.length < 1 || data.title.length > 25){
            return "title";
        }
        else if (data.description.length < 1 || data.description.length > 200){
            return "description";
        }
        else {
            return;
        }
    }
    catch{
        return "Unknown error with input data";
    }
}