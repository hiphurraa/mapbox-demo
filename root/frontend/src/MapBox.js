import React from 'react';
import mapboxgl from 'mapbox-gl';
import NavBar from './NavBar';
import markerImg from './marker_.png';
import './MapBox.css';
import CreateNewMarker from './CreateNewMarker';

mapboxgl.accessToken = 'pk.eyJ1IjoiaGlwaHVycmFhIiwiYSI6ImNrazVxd24xNjA4NGQyb29hY2MzcWtyNmkifQ.-9gTy_Q35okDPCEmQlWm9A';

export default class MapBox extends React.Component {

    constructor(props) {
        super(props);
        this.cancelCreatingNewMarker = this.cancelCreatingNewMarker.bind(this);
        this.markerRef = React.createRef();
        this.state = {
            map: null,
            mapContainer: null,
            isCreatingNewMarker: false,
            newMarkerCoordinates: null,
            newMarkerPopup: null
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
                        if (error)
                            throw error;
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
                            // Handle errors
                        });
                    }
                );
            });

        // Click on a marker
        map.on('click', 'points', (e) => {
                // Cancel the click event occurring on the map layer
                e.originalEvent.cancelBubble = true;

                // Center the map to the marker
                map.flyTo({
                    center: e.features[0].geometry.coordinates
                });

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

                const popupHTML = `<div class="popup"><h3>${title}</h3><p>${description}</p></div>`;

                new mapboxgl.Popup()
                    .setLngLat(coordinates)
                    .setHTML(popupHTML)
                    .addTo(map);

            });

        // Click on the map
        map.on('click', (e) => {
                // If clicked on a existing marker, don't do anything
                if (e.originalEvent.cancelBubble) {
                    return;
                }

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

    componentWillUnmount(){
                                                        // TODO
    }

    cancelCreatingNewMarker () {
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

    } // cancelCreatingNewMarker()

    render() {
        const {isCreatingNewMarker, newMarkerCoordinates} = this.state;

        if(isCreatingNewMarker){
            return (
                <div>
                    <NavBar></NavBar>
                    <div ref={el => this.mapContainer = el} className="map-container" />
                    <CreateNewMarker cancel={this.cancelCreatingNewMarker} coordinates={newMarkerCoordinates}/>
                </div>
              );
        }
        else{
            return (
                <div>
                    <NavBar></NavBar>
                    <div ref={el => this.mapContainer = el} className="map-container" />
                </div>
            );
        }

    }

}