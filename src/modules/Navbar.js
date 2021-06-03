import React, { useState } from 'react'
export const parseJSON = (response) => {
    return response.text().then(function (text) {
        return text ? JSON.parse(text) : {}
    })
}
export const Navbar = ({ onMarkerRemove, onBangalore, onDelhi }) => {
    const [places, setPlaces] = useState([])
    let interval;

    const onPlaceSearch = (e) => {
        e.persist();
        clearTimeout(interval);
        interval = setTimeout(() => {
            const myHeaders = new Headers({ Authorization: localStorage.getItem('_authToken') });
            const myRequest = new Request(`/api/places/search/json?query=${e.target.value}&tokenizeAddress=true&`, {
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
    const onPlaseSelect = (placeDetails) => {
        console.log(placeDetails);
    }
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                        <a className="nav-link" onClick={onMarkerRemove}>Remove markers <span className="sr-only">(current)</span></a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" onClick={onBangalore}>Bangalore</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" onClick={onDelhi}>Delhi</a>
                    </li>
                    <li className="nav-item"><a className="nav-link text-info" >Click anywhere on map to for marker, double click to remove</a> </li>
                </ul>
                <form className="form-inline my-2 my-lg-0 as">
                    <div className="as-c">
                        <input className="form-control mr-sm-2 as-a" onKeyUp={onPlaceSearch} type="search" placeholder="Search" aria-label="Search" />
                        {places && places.length > 0 &&
                            <ul className="as-b">
                                {places.map((x) => {
                                    return <React.Fragment key={x.eLoc}>
                                        <li onClick={() => onPlaseSelect(x)}>{x.placeAddress}</li>
                                    </React.Fragment>
                                })}
                            </ul>
                        }
                    </div>
                </form>
            </div>
        </nav>
    )
}
