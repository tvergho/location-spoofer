import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import Device from './device';

const Loading = () => {
  return (
    <h1>Loading...</h1>
  );
}

const Main = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    ipcRenderer.send('checkInstall');
    ipcRenderer.on('installed', (event, installed) => {
      if (installed) {
        setIsLoading(false);
      } else {
        ipcRenderer.send('install');
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