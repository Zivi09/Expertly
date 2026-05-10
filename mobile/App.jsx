import { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AppThemeProvider, useAppTheme } from './src/context/AppThemeContext';
import { NetworkProvider } from './src/context/NetworkContext';
import { LoadingScreen } from './src/components/LoadingScreen';
import { AnimatedSplashScreen } from './src/components/AnimatedSplashScreen';

SplashScreen.preventAutoHideAsync().catch(() => {});

function ThemedAppShell() {
  const { isDark } = useAppTheme();
  return (
    <>
      <AppNavigator />
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  );
}

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Small delay to ensure resources are ready before hiding native splash
      const prepare = async () => {
        try {
          await SplashScreen.hideAsync();
          setIsAppReady(true);
        } catch (e) {
          console.warn(e);
        }
      };
      prepare();
    }
  }, [fontsLoaded, fontError]);

  if (!isAppReady) {
    return <LoadingScreen message="Initializing..." />;
  }

  if (showSplash) {
    return <AnimatedSplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <NetworkProvider>
          <AppThemeProvider>
            <ThemedAppShell />
          </AppThemeProvider>
        </NetworkProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
