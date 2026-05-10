import React, { createContext, useContext, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { NetworkAlert } from '../components/NetworkAlert';

const NetworkContext = createContext({ isConnected: true });

export const NetworkProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  return (
    <NetworkContext.Provider value={{ isConnected }}>
      {children}
      <NetworkAlert visible={!isConnected} />
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => useContext(NetworkContext);
