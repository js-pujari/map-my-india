/* eslint-disable no-loop-func */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react'
import { CommonConstants } from '../Constants';
import { Navbar } from './Navbar';
const Home = ({ coords }) => {
    const [latLng, setlatLng] = useState(coords)
    const ref = useRef({ info: '', pincode: 0 });
    let map;
    const L = window.L;
    let marker;
    let markers = [];
    let currentDiameter;
    let latitudeArr = [28.549948, 28.552232, 28.551748, 28.551738, 28.548602, 28.554603, 28.545639, 28.544339, 28.553196, 28.545842];
    let longitudeArr = [77.268241, 77.268941, 77.269022, 77.270164, 77.271546, 77.268305, 77.26480, 77.26424, 77.265407, 77.264195];
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
            center: [latLng.lat, latLng.lng], zoomControl: true, zoom: 6, /* zoom level 4 to 19*/
            hybrid: false
        });
        const icon = L.icon(
            {
                iconUrl: 'https://maps.mapmyindia.com/images/1.png',
                iconRetinaUrl: 'https://maps.mapmyindia.com/images/1.png',
                iconSize: [40, 40],
            });
        // var icon = L.divIcon({
        //     className: 'my-div-icon',
        //     html: "<img class='map_marker'  src=" + "'https://maps.mapmyindia.com/images/4.png'>" + '<span class="my-div-span">' + 'MA' + '</span>',
        //     iconSize: [40, 40],
        //     // popupAnchor: [12, -10]
        // });

        marker = L.marker([latLng.lat, latLng.lng], { icon: icon, draggable: true, title: ref.current.info }).addTo(map);
        marker.on('click', (e) => {
            marker.bindPopup(ref.current.info ? ref.current.info : CommonConstants.customPopupContent).openPopup()
        })
        map.on('click', (e) => {
            var title = `Map my india marker ${markers.length + 1}`;

            markers.push(addMarker(e.latlng, title, true));
        })
        showCircle(1000)
    }

    function addMarker(position, title, draggable) {
        var icon = L.divIcon({
            className: 'my-div-icon',
            html: "<img class='map_marker'  src=" + "'https://maps.mapmyindia.com/images/4.png'>" + '<span class="my-div-span">' + 'MA' + '</span>',
            iconSize: [10, 10],
            popupAnchor: [12, -10]
        });
        var mk = new L.Marker(position, { icon: icon, draggable: draggable, title: title });
        mk.bindPopup(title);
        map.addLayer(mk);
        mk.on("dblclick", function (e) {
            var markerlength = markers.length;
            if (markerlength > 0) {
                for (var i = 0; i < markerlength; i++) {
                    map.removeLayer(markers[i]); /* deletion of marker object from the map */
                }
            }
        });
        return mk;
    }

    const showCircle = (radius) => {
        const { lat, lng } = latLng;
        if (currentDiameter) {
            map.removeLayer(currentDiameter);
        }
        currentDiameter = L.circle([lat, lng],
            {
                color: 'pink',
                fillColor: '#FFC0CB',
                fillOpacity: 0.5,
                radius: radius
            });

        currentDiameter.addTo(map);
        map.fitBounds(currentDiameter.getBounds());
    }

    const getCoordinatesFromEloc = async (place) => {
        if (place && place.length > 0) {

            place.forEach(async (loc, i, a) => {
                const payload = {
                    // url: `https://apis.mapmyindia.com/advancedmaps/v1/YOUR_REST_KEY/place_detail?place_id=${loc.eLoc}&region=IND`,
                    url: `https://explore.mapmyindia.com/apis/O2O/entity/${loc.eLoc}`,
                    method: 'GET',
                    header: JSON.stringify({ Authorization: localStorage.getItem('_authToken') })
                }
                latitudeArr = [];
                // const header = { Authorization: localStorage.getItem('_authToken') }
                longitudeArr = [];
                await fetch('http://localhost:9000/utility/tkn', { headers: payload, method: 'post' })
                    // await fetch(`https://explore.mapmyindia.com/apis/O2O/entity/${loc.eLoc}`, { headers: header, method: 'get' })
                    .then((x) => x.json())
                    .then((x) => {
                        if (x.success && x.data) {
                            // const [res] = x.data.results;
                            latitudeArr.push(x.data.latitude);
                            longitudeArr.push(x.data.longitude);
                            markers.push(addMarker({ lat: x.data.latitude, lng: x.data.longitude }, x.data.poi + ' ' + x.data.subDistrict + ' ' + x.data.district + x.data.state,))
                        }
                    })
                    .catch(e => console.log(''))
            })

        } else {
            const payload = {
                //     url: `https://apis.mapmyindia.com/advancedmaps/v1/YOUR_REST_KEY/place_detail?place_id=${place.eLoc}&region=IND`,
                url: `https://explore.mapmyindia.com/apis/O2O/entity/${place.eLoc}`,
                method: 'GET',
                header: JSON.stringify({ Authorization: localStorage.getItem('_authToken') })
            }
            // const header = { Authorization: localStorage.getItem('_authToken') }
            await fetch('http://localhost:9000/utility/tkn', { headers: payload, method: 'post' })
                // await fetch(`https://explore.mapmyindia.com/apis/O2O/entity/${place.eLoc}`, { headers: header, method: 'get' })
                .then((x) => x.json())
                .then((x) => {
                    if (x.success && x.data) {
                        const { data: res } = x;
                        ref.current.pincode = res.pincode ? res.pincode : '';
                        ref.current.info = res.poi + ', ' + res.subDistrict + ', ' + res.district + res.state;
                        setlatLng({ lat: res.latitude, lng: res.longitude })
                        markers.push(addMarker({ lat: res.latitude, lng: res.longitude }, res.poi + ' ' + res.subDistrict + ' ' + res.district + res.state,))
                    }
                })
                .catch(e => console.log(''))
        }

    }


    const onMarkerRemove = () => {
        var markerlength = markers.length;
        if (markerlength > 0) {
            for (var i = 0; i < markerlength; i++) {
                map.removeLayer(markers[i]); /* deletion of marker object from the map */
            }
        }
    }
    const onMultipleMarkers = () => {
        onMarkerRemove()
        for (var i = 0; i < latitudeArr.length; i++) {
            var postion = new L.LatLng(latitudeArr[i], longitudeArr[i]); /*WGS location object*/
            markers.push(addMarker(postion, `Map my india marker ${markers.length + 1}`));
        }
        mapmyindia_fit_markers_into_bound();
    }

    const mapmyindia_fit_markers_into_bound = () => {
        debugger
        if ((latitudeArr && latitudeArr.length) && (longitudeArr && longitudeArr.length)) {
            const maxlat = Math.max.apply(null, latitudeArr);
            const maxlon = Math.max.apply(null, longitudeArr);
            const minlat = Math.min.apply(null, latitudeArr);
            const minlon = Math.min.apply(null, longitudeArr);
            const southWest = L.latLng(maxlat, maxlon); /*south-west WGS location object*/
            const northEast = L.latLng(minlat, minlon); /*north-east WGS location object*/
            const bounds = L.latLngBounds(southWest, northEast); /*This class represents bounds on the Earth sphere, defined by south-west and north-east corners*/
            map.fitBounds(bounds);
        }/*Sets the center map position and level so that all markers is the area of the map that is displayed in the map area*/
    }

    return (
        <div>
            <Navbar onGetBoundTo={mapmyindia_fit_markers_into_bound} latLng={latLng} pincode={ref.current.pincode} onMultipleMarkers={onMultipleMarkers} getCoordinatesFromEloc={getCoordinatesFromEloc} onRadiusChange={showCircle} onMarkerRemove={onMarkerRemove} onBangalore={() => setlatLng({ lat: 12.979693, lng: 77.590658 })} onDelhi={() => setlatLng({ lat: 28.618216, lng: 77.279248 })} />
            <div style={{ border: '1px solid #ddd' }}>
                <div id="myMap">
                    <div id="map"></div>
                </div>
            </div>
        </div>
    )
}

export default Home;