import { View, Text } from 'react-native';
import { MenuProvider } from "react-native-popup-menu";
import { AuthContextProvider, useAuth } from "../firebase/auth";
import React, { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import * as Font from 'expo-font';

const MainLayout = () => {
  const { isAuthenticated, user } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Check if fonts loaded (اختياري، لو هتعملي ستايل بخط مخصص)
    Font.loadAsync({
      'outfit': require('../assets/fonts/Outfit-Regular.ttf'),
      'outfit-medium': require('../assets/fonts/Outfit-Medium.ttf'),
      'outfit-bold': require('../assets/fonts/Outfit-Bold.ttf'),
    });

    // Auth Logic
    if (user?.email === "admin@email.com") {
      router.navigate("/(admin)/(tabs)/admin");
    } else {
      if (typeof isAuthenticated === "undefined") return;

      const inApp = segments[0] === "(tabs)";

      if (isAuthenticated && !inApp) {
        router.replace("/Home");
      }

      if (isAuthenticated === false) {
        router.navigate("/login");
      }
    }
  }, [isAuthenticated]);

  return <Slot />;
};

export default function RootLayout() {
  return (
    <MenuProvider>
      <AuthContextProvider>
        <MainLayout />
      </AuthContextProvider>
    </MenuProvider>
  );
}
