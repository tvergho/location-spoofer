/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {useState} from 'react';
import * as ReactDOM from 'react-dom';
import { ipcRenderer } from 'electron';

const changeCoordinates = (lat: string, lng: string) => {
  ipcRenderer.send('coordsChange', {lat, lng})
}

const reset = () => {
  ipcRenderer.send('reset')
}

const LocationChange = () => {
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  const onPress = () => {
    changeCoordinates(lat, lng);
  }

  return (
    <div className="container">
      <h1>💖 Spoof your iPhone Location</h1>

      <div className="label-group">
        <label htmlFor="lat">Latitude:</label>
        <input type="text" id="lat" className="location-input" value={lat} onChange={(e) => {setLat(e.target.value)}} />
      </div>

      <div className="label-group">
        <label htmlFor="lng">Longitude:</label>
        <input type="text" id="lng" className="location-input" value={lng} onChange={(e) => {setLng(e.target.value)}} />
      </div>

      <button type="button" className="submit" onClick={onPress}>Submit</button>
      <button type="button" className="reset" onClick={reset}>Reset Location</button>
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
