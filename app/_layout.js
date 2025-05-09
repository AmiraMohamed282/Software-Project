import { View, Text } from 'react-native'
import { MenuProvider } from "react-native-popup-menu";
import { AuthContextProvider, useAuth } from "../firebase/auth";
import React, { useEffect } from 'react'
import { Slot, useRouter, useSegments } from 'expo-router';
import 'react-native-gesture-handler';
import AsyncStorage from "@react-native-async-storage/async-storage";



const MainLayout = () => {
  
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const {loadUserFromStorage} = useAuth(); 

  useEffect(async () => {
    const user = await loadUserFromStorage();
    // Check If User Is Authenticated Or Not
    if (user?.email == "admin@email.com")
      router.navigate("/(Admin)/(tabs)/admin");
    else {
      if (!user) router.replace("/Login");
      else {
        router.replace("/(tabs)/home");
      }
      const inApp = segments[0] === "(tabs)";
      if (user && !inApp) {
        router.replace("/(tabs)home");
      }
    }
  }, []);
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