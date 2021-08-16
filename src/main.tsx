import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import { Dots } from "react-activity";
import Device from './device';
import "react-activity/dist/Dots.css";

const Loading = () => {
  return (
    <div className="loading-container">
      <h1 className="loading">Loading...</h1>
      <h2 className="loading-intro">Hello Joanne!</h2>
      <Dots size={50} color="rgba(17, 40, 210, 0.8)" />
      <h4 className="loading-subtitle">Please be patient. Installation will take a while the first time.</h4>
    </div>
  );
}

const Main = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    ipcRenderer.send('checkInstall');
    ipcRenderer.on('installed', (event, installed) => {
      if (installed) {
        setIsLoading(false);
      }
    });
  }, []);

  return (
    <>
    {isLoading && <Loading />}
    {!isLoading && <Device />}
    </>
  );
};

export default Main;