/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {useState} from 'react';
import * as ReactDOM from 'react-dom';
import { ipcRenderer } from 'electron';

const changeCoordinates = (lat: string, lng: string) => {
  ipcRenderer.send('coordsChange', {lat, lng})
}

const LocationChange = () => {
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  const onPress = () => {
    changeCoordinates(lat, lng);
  }

  return (
    <div>
      <h1>💖 Spoof your iPhone Location</h1>
      <label htmlFor="lat">Latitude:</label>
      <input type="text" id="lat" className="location-input" value={lat} onChange={(e) => {setLat(e.target.value)}} />

      <label htmlFor="lng">Longitude:</label>
      <input type="text" id="lng" className="location-input" value={lng} onChange={(e) => {setLng(e.target.value)}} />

      <button type="button" className="submit" onClick={onPress}>Submit</button>
    </div>
  )
}

function render() {
  ReactDOM.render(
    (
     <LocationChange /> 
    ), document.body,
  );
}

render();
