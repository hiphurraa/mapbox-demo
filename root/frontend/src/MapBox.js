import React from 'react';
import mapboxgl from 'mapbox-gl';
import NavBar from './NavBar';
import marker from './marker.png';
import './MapBox.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiaGlwaHVycmFhIiwiYSI6ImNrazVxd24xNjA4NGQyb29hY2MzcWtyNmkifQ.-9gTy_Q35okDPCEmQlWm9A';

export default class MapBox extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            lng: 27.681422,
            lat: 62.89196,
            zoom: 11.75,
            data: null
        }
    }

    componentDidMount() {

        const { lng, lat, zoom } = this.state;

        const map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom
        });

        map.on('move', () => {
            this.setState({
                lng: map.getCenter().lng.toFixed(4),
                lat: map.getCenter().lat.toFixed(4),
                zoom: map.getZoom().toFixed(2)
            });
        });

        map.on('load', function () {

            map.loadImage(marker,
                function (error, image) {
                    if (error) throw error;

                    map.addImage('marker', image);
                
                    fetch("http://127.0.0.1:3001/markers/geojson")
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
                                    'icon-size': 0.3
                                }
                            });
                        }
                        )
                        .catch((error) => {
                            // Handle errors
                        })
                }
            );

        });

        // Click on a marker
        map.on('click', 'points', function(e) {
            // Cancel the click event occurring on the map layer
            e.originalEvent.cancelBubble = true;

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
        map.on('click', function (e) {
            // If clicked on a mark, don't do anything
            if (e.originalEvent.cancelBubble){
                return;
            }

            var coordinates = [e.lngLat.lng, e.lngLat.lat];

            const popupHTML =   '<div class="popup-new"><h3>Uusi merkintä</h3><label>Otsikko:</label>'+
                                '<input type="text"></input><label>Kuvaus:</label><input type="text">'+
                                '</input><button>Tallenna</button></input><button>Peruuta</button></div>';

            new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(popupHTML)
            .addTo(map);

        });

        map.on('mouseenter', 'points', function () {
            map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'points', function () {
            map.getCanvas().style.cursor = '';
        });

    }

    componentWillUnmount(){
                                                        // TODO
    }

    render() {

      return (
        <div>
            <NavBar></NavBar>
            <div ref={el => this.mapContainer = el} className="map-container" />
        </div>
      );
    }

}