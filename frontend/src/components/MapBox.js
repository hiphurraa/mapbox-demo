import React from 'react';
import mapboxgl from 'mapbox-gl';
import NavBar from './NavBar';
import markerImg from '../images/marker.png';
import './MapBox.css';
import CreateNewMarker from './CreateNewMarker';
import ShowMarker from './ShowMarker';

mapboxgl.accessToken = 'pk.eyJ1IjoiaGlwaHVycmFhIiwiYSI6ImNrazVxd24xNjA4NGQyb29hY2MzcWtyNmkifQ.-9gTy_Q35okDPCEmQlWm9A';

export default class MapBox extends React.Component {

    constructor(props) {
        super(props);
        this.closeCreatingNewMarker = this.closeCreatingNewMarker.bind(this);
        this.updateMap = this.updateMap.bind(this);
        this.handleSaveMarker = this.handleSaveMarker.bind(this);
        this.handleDeleteMarker = this.handleDeleteMarker.bind(this);
        this.state = {
            map: null,
            mapContainer: null,
            isCreatingNewMarker: false,
            newMarkerCoordinates: null,
            newMarkerPopup: null,
            isMarkerSelected: false,
            selectedMarker: null,
            selectedMarkerPopup: null
        };
    }

    componentDidMount() {

        const map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [27.681422, 62.89196],
            zoom: 11.75
        });

        this.setState({map: map, mapContainer: this.mapContainer});

        map.on('load', () => {
                map.loadImage(markerImg,
                    (error, image) => {
                        if (error) throw error;

                        map.addImage('marker', image);
                        fetch('http://127.0.0.1:3001/markers/geojson')
                        .then(res => res.json())
                        .then((result) => {
                            map.addSource('point', {
                                type: 'geojson',
                                data: result
                            });
                            map.addLayer({
                                'id': 'points',
                                'type': 'symbol',
                                'source': 'point',
                                'layout': {
                                    'icon-image': "marker",
                                    'icon-size': 0.8
                                }
                            });
                            map.addSource('newPoint', {
                                type: 'geojson',
                                data: {type: "FeatureCollection", features: []
                                }
                            });
                            map.addLayer({
                                'id': 'newPoints',
                                'type': 'symbol',
                                'source': 'newPoint',
                                'layout': {
                                    'icon-image': "marker",
                                    'icon-size': 0.8
                                }
                            });
                        }
                        )
                        .catch((error) => {
                            // Failed to fetch markers from database. Inform the user.
                        });
                    }
                );
            });

        // Click on a existing marker
        map.on('click', 'points', (e) => {
                const coordinates = e.features[0].geometry.coordinates.slice();
                const { title, description } = e.features[0].properties;

                e.originalEvent.cancelBubble = true; // Cancel the click event occurring on the map layer
                this.closeCreatingNewMarker();
                map.flyTo({ center: e.features[0].geometry.coordinates});
                this.setState({isMarkerSelected: true, selectedMarker: e.features[0]});

                // Ensure that if the map is zoomed out such that multiple
                // copies of the feature are visible, the popup appears
                // over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }

                const popupHTML = `<div class="popup"><h3>${title}</h3><p>${description}</p></div>`;

                var popup = new mapboxgl.Popup({closeButton: false, closeOnClick: true})
                    .setLngLat(coordinates)
                    .setHTML(popupHTML)
                    .addTo(map);

                this.setState({selectedMarkerPopup: popup});

                this.updateMap();

            });

        // Click on the map
        map.on('click', (e) => {
                // If clicked on a existing marker -> cancel this event
                if (e.originalEvent.cancelBubble) {
                    return;
                }
                this.updateMap();

                if (this.state.isMarkerSelected){
                    this.setState({isMarkerSelected: false});
                }
                else {

                    var coordinates = [e.lngLat.lng, e.lngLat.lat]
                    this.setState({newMarkerCoordinates: coordinates, isCreatingNewMarker: true});
                    var newMarkerGeoJson = {
                        type: "FeatureCollection",
                        features: [{
                            'Type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': coordinates
                            }
                        }]
                    };
    
                    if (map.getSource('newPoint')){
                        map.getSource('newPoint').setData(newMarkerGeoJson);
                    }
                    
                    if (this.state.newMarkerPopup){
                        this.state.newMarkerPopup.remove();
                    }
                    
                    // Ensure that if the map is zoomed out such that multiple
                    // copies of the feature are visible, the popup appears
                    // over the copy being pointed to.
                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }
    
                    const popupHTML = `<div class="newMarker-popup">Luodaan uutta merkkiä!</div>`;
    
                    var popup = new mapboxgl.Popup({closeButton: false, closeOnClick: false})
                        .setLngLat(coordinates)
                        .setHTML(popupHTML)
                        .addTo(map);
    
                    this.setState({newMarkerPopup: popup})
                }

            });

        var popup = new mapboxgl.Popup({closeButton: false, closeOnClick: false})

        map.on('mouseenter', 'points', (e) => {
                map.getCanvas().style.cursor = 'pointer';

                // Get the info of the marker
                var coordinates = e.features[0].geometry.coordinates.slice();
                var title = e.features[0].properties.title;
                var description = e.features[0].properties.description;

                // Ensure that if the map is zoomed out such that multiple
                // copies of the feature are visible, the popup appears
                // over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }

                if (description.length > 60){
                    description = description.slice(0, 57).trim() + '...';
                }

                const popupHTML = `<div class="popup"><h3>${title}</h3><p>${description}</p></div>`;
                popup.setLngLat(coordinates).setHTML(popupHTML).addTo(map);
        });

        map.on('mouseleave', 'points', () => {
                map.getCanvas().style.cursor = '';
                popup.remove();
            });

    } // componentDidMount()

    handleSaveMarker (coordinates) {
        this.updateMap();
        this.updatePopups();
        this.closeCreatingNewMarker();
        // Show popup where new marker was created
        const popupHTML = '<div class="popup"><h3>Merkki luotu!</h3><p></p></div>'
        var popup = new mapboxgl.Popup({closeButton: false, closeOnClick: true})
        .setLngLat(coordinates)
        .setHTML(popupHTML)
        .addTo(this.state.map);
        setTimeout(() => {
            popup.remove();
            this.updateMap();
        }, 2000); 
    }

    // Inform the user that marker has been deleted succesfully
    handleDeleteMarker () {
        this.setState({isMarkerSelected: false});
        this.state.selectedMarkerPopup.remove();
        const coordinates = this.state.selectedMarker.geometry.coordinates;
        const popupHTML = '<div class="popup"><h3>Merkki poistetaan!</h3><p></p></div>'
        var popup = new mapboxgl.Popup({closeButton: false, closeOnClick: true})
            .setLngLat(coordinates)
            .setHTML(popupHTML)
            .addTo(this.state.map);
        setTimeout(() => {
            popup.remove();
            this.updateMap();
        }, 2000); 
    }


    updatePopups(){
        if (this.state.selectedMarker){
            var marker = this.state.selectedMarker;
            marker.properties.title = "Merkkiä muokattu!";
            marker.properties.description = "";
            this.setState({selectedMarker: marker});
        }
        if (this.state.selectedMarkerPopup){
            const popup = this.state.selectedMarkerPopup;
            popup.setHTML(`<div class="popup"><h3>Merkkiä muokattu!</h3><p></p></div>`);
            setTimeout(() => {
                popup.remove();
            }, 2000); 
        }
        this.setState({isMarkerSelected: false});
    }

    updateMap(){
        if (this.state.map){
            var map = this.state.map;
        }
        else{
            return;
        }
        fetch('http://127.0.0.1:3001/markers/geojson')
        .then(res => res.json())
        .then((result) => {
            if (map.getSource('point')){
                map.getSource('point').setData(result);
            }
            else {
                // Failed updating markes
            }
        }
        )
        .catch((error) => {
            // Error fetching data from database
        });
    }

    closeCreatingNewMarker () {
        if (this.state.isCreatingNewMarker){
            this.setState({isCreatingNewMarker: false});
        }
        if (this.state.newMarkerPopup){
            this.state.newMarkerPopup.remove();
        }
        if (this.state.map){
            var newMarkerGeoJson = {
                type: "FeatureCollection",
                features: []
            };
    
            if (this.state.map.getSource('newPoint')){
                this.state.map.getSource('newPoint').setData(newMarkerGeoJson);
            }
        }

    } // closeCreatingNewMarker()

    render() {
        const {isCreatingNewMarker, newMarkerCoordinates, isMarkerSelected, selectedMarker} = this.state;

        return (
            <div>
                <NavBar></NavBar>
                <div ref={el => this.mapContainer = el} className="map-container" />
                {isCreatingNewMarker? <CreateNewMarker cancel={this.closeCreatingNewMarker} coordinates={newMarkerCoordinates} handleSave={this.handleSaveMarker}/> : ''}
                {isMarkerSelected? <ShowMarker marker={selectedMarker} handleSave={this.handleSaveMarker} handleDelete={this.handleDeleteMarker}/> : ''}
            </div>
        );
    }

}