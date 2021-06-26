import React, { useEffect, useState } from 'react';
import Home from './modules/Home';
export const parseJSON = (response) => {
  return response.text().then(function (text) {
    return text ? JSON.parse(text) : {}
  })
}
const App = () => {
  const tokenGeneratorUrl = 'https://outpost.mapmyindia.com/api/security/oauth/token';
  const grantType = 'client_credentials'
  const clientSecret = 'YOUR_CLIENT_SECRET_KEY';
  const clientId = 'YOUR_CLIENT_ID';
  const [coords, setCoords] = useState({
    lat: 13.295583, lng: 77.800758
  })
  useEffect(() => {
    getLocation()
    generateToken();
  }, [])

  const showPosition = (position) => {
    console.log(position);
    setCoords({ lat: position.coords.latitude, lng: position.coords.longitude })
  }

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    }
  }

  const generateToken = () => {
    const url = `${tokenGeneratorUrl}?grant_type=${grantType}&client_id=${clientId}&client_secret=${clientSecret}`;
    const myHeaders = new Headers({ Accept: "application/json", 'Content-Type': 'application/x-www-form-urlencoded' });
    const myRequest = new Request(url, {
      method: 'POST',
      headers: myHeaders,
    });
    fetch(myRequest)
      .then(parseJSON)
      .then(res => {
        localStorage.setItem('_authToken', `${res.token_type} ${res.access_token}`);
      });
  }

  return (
    // <Routes />
    <Home coords={coords} />

  );
}

export default App;