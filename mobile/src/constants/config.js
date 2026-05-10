import { Platform } from 'react-native';
import Constants from 'expo-constants';

const PORT = 5000;

/**
 * Resolves the machine that is running Metro (same as QR / Expo Go).
 * Physical devices were previously hard-coded to 10.0.2.2 (emulator-only),
 * which breaks API calls from a real phone on Wi‑Fi.
 */
function resolveDevHost() {
  if (process.env.EXPO_PUBLIC_API_HOST) {
    return process.env.EXPO_PUBLIC_API_HOST;
  }

  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    return hostUri.split(':')[0];
  }

  const legacy = Constants.manifest?.debuggerHost;
  if (legacy) {
    return legacy.split(':')[0];
  }

  if (Platform.OS === 'android') {
    return '10.0.2.2';
  }
  return 'localhost';
}

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || `http://${resolveDevHost()}:${PORT}`;
export const SOCKET_URL = API_BASE_URL;
