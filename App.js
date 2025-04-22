import React, { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import AppNavigator from "./src/navigation/index";
import { PreloadingAssets } from "./src/utils";

SplashScreen.preventAutoHideAsync(); // Prevent splash screen from hiding automatically
export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function loadAssets() {
      try {
        console.log('Loading assets...');
        await PreloadingAssets.cacheImages();
        await PreloadingAssets.cacheFonts();
      } catch (error) {
        console.warn('Error loading assets:', error);
      } finally {
        setIsReady(true);
        SplashScreen.hideAsync();
        console.log('Assets loaded and splash screen hidden');
      }
    }
  
    loadAssets();
  }, []);
  

  if (!isReady) {
    return null; // Show nothing while loading
  }

  return <AppNavigator />;
}
