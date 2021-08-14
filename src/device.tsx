/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';

const changeCoordinates = (lat: string, lng: string) => {
  ipcRenderer.send('coordsChange', { lat, lng });
};

const reset = () => {
  ipcRenderer.send('reset');
};

const getDevices = () => {
  ipcRenderer.send('getDevices');
};

const checkImage = () => {
  ipcRenderer.send('checkImage');
};

const LocationChange = () => {
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  const onPress = () => {
    if (!lat || Number.isNaN(parseFloat(lat)) || parseFloat(lat) < -90 || parseFloat(lat) > 90) {
      setError('Latitude must be between -90 and 90 degrees.');
      return;
    } else if (!lng || Number.isNaN(parseFloat(lng)) || parseFloat(lng) < -180 || parseFloat(lng) > 180) {
      setError('Longitude must be between -180 and 180 degrees.');
      return;
    }
    changeCoordinates(lat, lng);
    setError('');
  };

  const refreshDevices = () => {
    getDevices();
    checkImage();
  };

  useEffect(() => {
    ipcRenderer.on('output', (event, output) => {
      if (output.includes('No device found')) {
        setError('Device not connected.');
      } else {
        setError(output);
      }
    });

    ipcRenderer.on('deviceNames', (event, newDevices) => {
      setDevices(newDevices);
    });

    ipcRenderer.on('imageMounted', (event, newMounted) => {
      console.log(newMounted);
      setMounted(newMounted);
    });

    refreshDevices();
  }, []);

  return (
    <div className="container">
      <h1>💖 Spoof your iPhone Location</h1>

      <div className="label-group">
        <label htmlFor="lat">Latitude:</label>
        <input type="text" id="lat" className="location-input" value={lat} onChange={(e) => { setLat(e.target.value); }} />
      </div>

      <div className="label-group">
        <label htmlFor="lng">Longitude:</label>
        <input type="text" id="lng" className="location-input" value={lng} onChange={(e) => { setLng(e.target.value); }} />
      </div>

      <button type="button" className="submit" onClick={onPress}>Submit</button>
      <button type="button" className="reset" onClick={reset}>Reset Location</button>

      <div className="error">{error || ' '}</div>

      <h4 style={{ color: mounted ? 'green' : 'red' }}>Devices {`(${devices.length})`}:</h4>
      {devices.map((device: string) => {
        return (
          <p key={device} className="device">{device || ''}</p>
        );
      })}
      <button type="button" className="refresh" onClick={refreshDevices}>refresh</button>
    </div>
  );
};

export default LocationChange;
