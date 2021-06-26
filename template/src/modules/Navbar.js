import React, { useState } from 'react'
import { CommonConstants } from '../Constants'
export const parseJSON = (response) => {
    return response.text().then(function (text) {
        return text ? JSON.parse(text) : {}
    })
}
export const Navbar = ({ onMultipleMarkers, onRadiusChange, getCoordinatesFromEloc, latLng, pincode, onGetBoundTo }) => {
    const [places, setPlaces] = useState([]);
    const [textPlaces, setTextPlaces] = useState([]);
    const [nearbyPlaces, setNearbyPlaces] = useState([]);
    const [isPinFilter, setIsPinFilter] = useState(false);
    const [pin, setPin] = useState(pincode);
    let interval;

    const onPlaceSearch = (e) => {
        e.persist();
        clearTimeout(interval);
        interval = setTimeout(() => {
            const myHeaders = new Headers({ Authorization: localStorage.getItem('_authToken') });
            const myRequest = new Request(`/api/places/search/json?query=${e.target.value}&tokenizeAddress=true&${(pin && isPinFilter) ? ('&filter=pin:' + pin) : ''}`, {
                method: 'GET',
                headers: myHeaders,
            });

            fetch(myRequest)
                .then(parseJSON)
                .then(myBlob => {
                    if (myBlob && myBlob.suggestedLocations && myBlob.suggestedLocations.length) {
                        setPlaces(myBlob.suggestedLocations);
                    } else {
                        setPlaces([])
                    }
                }).catch((e) => {
                    setPlaces([])
                })
        }, 200);
    }


    const onTextSearch = (e) => {
        e.persist();
        clearTimeout(interval);
        interval = setTimeout(() => {
            const myHeaders = new Headers({ Authorization: localStorage.getItem('_authToken') });
            const myRequest = new Request(`${CommonConstants.textSearchUrl}${e.target.value}&region=IND&location=${latLng.lat + ',' + latLng.lng}${(pin && isPinFilter) ? ('&filter=pin:' + pin) : ''}`, {
                method: 'GET',
                headers: myHeaders,
            });

            fetch(myRequest)
                .then(parseJSON)
                .then(myBlob => {
                    if (myBlob && myBlob.suggestedLocations && myBlob.suggestedLocations.length) {
                        setTextPlaces(myBlob.suggestedLocations);
                        getCoordinatesFromEloc(myBlob.suggestedLocations);
                    } else {
                        setTextPlaces([])
                    }
                }).catch((e) => {
                    setTextPlaces([])
                })
        }, 350);
    }

    const onNearBySearch = (e) => {
        e.persist();
        clearTimeout(interval);
        interval = setTimeout(() => {
            const myHeaders = new Headers({ Authorization: localStorage.getItem('_authToken') });
            const myRequest = new Request(`${CommonConstants.nearBySearchUrl}${e.target.value}&refLocation=${latLng.lat + ',' + latLng.lng}&region=IND&radius=10000${(pin && isPinFilter) ? ('&filter=pin:' + pin) : ''}`, {
                method: 'GET',
                headers: myHeaders,
            });

            fetch(myRequest)
                .then(parseJSON)
                .then(myBlob => {
                    if (myBlob && myBlob.suggestedLocations && myBlob.suggestedLocations.length) {
                        setNearbyPlaces(myBlob.suggestedLocations);
                        getCoordinatesFromEloc(myBlob.suggestedLocations);
                    } else {
                        setNearbyPlaces([])
                    }
                }).catch((e) => {
                    setNearbyPlaces([])
                })
        }, 350);
    }

    const onPlaceSelect = (placeDetails) => {
        console.log(placeDetails);
        setPin(placeDetails.pincode)
        getCoordinatesFromEloc(placeDetails)
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light" onClick={e => { setPlaces([]); setTextPlaces([]) }}>
            <div className="collapse navbar-collapse d-flex  flex-wrap" id="navbarSupportedContent">
                <form className="form-inline my-2 my-lg-0 as">
                    <div className="as-c">
                        <input className="form-control mr-sm-2 as-a" onKeyUp={onNearBySearch} type="search" placeholder="Near by Search" aria-label="Search" />
                        {nearbyPlaces && nearbyPlaces.length > 0 &&
                            <ul className="as-b">
                                {nearbyPlaces.map((x) => {
                                    return <React.Fragment key={x.eLoc}>
                                        <small>
                                            <li onClick={() => onPlaceSelect(x)} data-bs-toggle="tooltip" title={x.placeName + ', ' + x.placeAddress}>
                                                <span className="text-info">{x.distance ? x.distance : Math.round(Math.random() * 10) + ' Km '}</span>
                                                <span className="text-warning fst-italic">{x.placeName},</span>
                                                <span> {x.placeAddress}</span>

                                            </li>
                                        </small>
                                    </React.Fragment>
                                })}
                            </ul>
                        }
                    </div>
                </form>
                <form className="form-inline my-2 my-lg-0 as">
                    <div className="as-c">
                        <input className="form-control mr-sm-2 as-a" onKeyUp={onTextSearch} type="search" placeholder="Text Search" aria-label="Search" />
                        {textPlaces && textPlaces.length > 0 &&
                            <ul className="as-b">
                                {textPlaces.map((x) => {
                                    return <React.Fragment key={x.eLoc}>
                                        <small>
                                            <li onClick={() => onPlaceSelect(x)} data-bs-toggle="tooltip" title={x.placeName + ', ' + x.placeAddress}>
                                                <span className="text-info">{x.distance ? x.distance : Math.round(Math.random() * 10) + ' Km '}</span>
                                                <span className="text-warning fst-italic">{x.placeName},</span>
                                                <span> {x.placeAddress}</span>

                                            </li>
                                        </small>
                                    </React.Fragment>
                                })}
                            </ul>
                        }
                    </div>
                </form>

                <form className="form-inline my-2 my-lg-0 as">
                    <div className="as-c">
                        <input className="form-control mr-sm-2 as-a" onKeyUp={onPlaceSearch} type="search" placeholder="Auto Search Places" aria-label="Search" />
                        {places && places.length > 0 &&
                            <ul className="as-b">
                                {places.map((x) => {
                                    return <React.Fragment key={x.eLoc}>
                                        <small>
                                            <li onClick={() => onPlaceSelect(x)} data-bs-toggle="tooltip" title={x.placeName + ', ' + x.placeAddress}>
                                                <span className="text-info">{x.distance ? x.distance : Math.round(Math.random() * 10) + ' Km '}</span>
                                                <span className="text-warning fst-italic">{x.placeName},</span>
                                                <span> {x.placeAddress}</span>

                                            </li>
                                        </small>
                                    </React.Fragment>
                                })}
                            </ul>
                        }
                    </div>
                </form>
                <div className="form-inline my-2 my-lg-0 as">
                    <input type="tel" placeholder="Pinocde" className="form-control mr-sm-2" onChange={(e) => setPin(e.target.value)}></input>
                    <input type="checkbox" className="form-control mr-sm-2" checked={isPinFilter} onChange={() => setIsPinFilter(!isPinFilter)} className="mr-1"></input>Restrict to pin
                </div>
                <div className="form-inline my-2 mr-3">
                    <select className="form-select form-control" aria-label="Default select example" onChange={e => onRadiusChange(e.target.value)}>
                        <option value="Select Radius" disabled={true}>Select Radius</option>
                        <option value="1000">1 Km</option>
                        <option value="5000">5 Km</option>
                        <option value="10000">10 Km</option>
                        <option value="15000">15 Km</option>
                    </select>
                </div>
                <div className="form-inline my-2 my-lg-0 mr-3">
                    <button className="btn btn-default" onClick={onMultipleMarkers}>Multiple Markers</button>
                </div>
                <div className="form-inline my-2 my-lg-0 mr-3">
                    {/* <button className="btn btn-default" onClick={onGetBoundTo}>Get Bound TO Coordinates</button> */}
                </div>
            </div>
        </nav>
    )
}
