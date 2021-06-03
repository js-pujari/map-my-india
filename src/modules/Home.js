/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Navbar } from './Navbar';
const Home = ({ coords }) => {
    console.log({ coords });
    const [latLng, setlatLng] = useState(coords)
    let map;
    let marker;
    let markers = []
    useEffect(() => {
        setlatLng(coords)
    }, [coords])
    useEffect(async () => {
        if (window.MapmyIndia) {
            const mapElement = document.getElementById('myMap');
            if (mapElement) mapElement.innerHTML = '';
            console.log(mapElement);
            mapElement.innerHTML = '<div id="map"></div>';
            initMap();
        }
    }, [latLng])

    const initMap = () => {
        map = new window.MapmyIndia.Map('map', {
            center: [latLng.lat, latLng.lng], zoomControl: true, zoom: 11, /* zoom level 4 to 19*/
            hybrid: false
        });
        const icon = window.L.icon(
            {
                iconUrl: process.env.PUBLIC_URL + '/mkDefIcon.png',
                iconRetinaUrl: process.env.PUBLIC_URL + '/mkDefIcon.png',
                iconSize: [60, 60],
                popupAnchor: [8, 15]
            });
        marker = window.L.marker([latLng.lat, latLng.lng], { icon: icon, draggable: true, title: 'title' }).addTo(map);
        marker.on('click', (e) => {
            marker.bindPopup('Map my india markers!').openPopup()
        })
        map.on('click', (e) => {
            var title = "Map my india markers!";

            markers.push(addMarker(e.latlng, '', title, true));
        })
    }

    function addMarker(position, a, title, draggable) {
        const icon = window.L.icon(
            {
                iconUrl: process.env.PUBLIC_URL + '/mkIcon.png',
                iconRetinaUrl: process.env.PUBLIC_URL + '/mkIcon.png',
                iconSize: [50, 50],
                popupAnchor: [-8, -15]
            });
        var mk = new window.L.Marker(position, { icon: icon, draggable: draggable, title: title });
        mk.bindPopup(title);
        map.addLayer(mk);
        mk.on('dragend', (e) => console.log('Drag ended', e))
        //Although we.ll talk about a few things in the code segment in a moment 
        //but lets put it in here so that you have the full picture. 
        //marker events:
        mk.on("click", function (e) {
            console.log('ee', e);
            //your code about what you want to do on a marker click
        });
        mk.on("dblclick", function (e) {
            console.log('double click', e);
            console.log('marker double click', markers);
            var markerlength = markers.length;
            if (markerlength > 0) {
                for (var i = 0; i < markerlength; i++) {
                    map.removeLayer(markers[i]); /* deletion of marker object from the map */
                }
            }
            //your code about what you want to do on a marker click
        });
        return mk;
    }

    const onMarkerRemove = () => {
        var markerlength = markers.length;
        if (markerlength > 0) {
            for (var i = 0; i < markerlength; i++) {
                map.removeLayer(markers[i]); /* deletion of marker object from the map */
            }
        }
    }

    return (
        <div>
            <Navbar onMarkerRemove={onMarkerRemove} onBangalore={() => setlatLng({ lat: 12.979693, lng: 77.590658 })} onDelhi={() => setlatLng({ lat: 28.618216, lng: 77.279248 })} />
            <div className="container-fluid mt-2">
                <div id="myMap">
                    <div id="map"></div>
                </div>
            </div>
        </div>
    )
}

export default Home;