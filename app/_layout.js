import { View, Text } from 'react-native'
import { MenuProvider } from "react-native-popup-menu";
import { AuthContextProvider, useAuth } from "../firebase/auth";
import React, { useEffect } from 'react'
import { Slot, useRouter, useSegments } from 'expo-router';
import 'react-native-gesture-handler';
import AsyncStorage from "@react-native-async-storage/async-storage";



const MainLayout = () => {
  
  const segments = useSegments();
  const router = useRouter();
  const {loadUserFromStorage} = useAuth(); 

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const user = await loadUserFromStorage();
        if (user) {
          // if (user.email === "admin@email.com") {
          //   router.replace("/(Admin)/(tabs)/admin");
          // } else {
          //   router.replace("/(tabs)/home");
          // }
          router.replace("/(tabs)/home");
        } else {
          router.replace("/Login");
        }
      } catch (error) {
        console.error("Error initializing user:", error);
        router.replace("/Login");
      }
    };

    initializeUser();
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