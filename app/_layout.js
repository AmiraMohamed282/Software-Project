import { View, Text } from 'react-native'
import { MenuProvider } from "react-native-popup-menu";
import { AuthContextProvider, useAuth } from "../firebase/auth";
import React, { useEffect } from 'react'
import { Slot, useRouter, useSegments } from 'expo-router';



const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // Check If User Is Authenticated Or Not
    if (user?.email == "admin@email.com")
      router.navigate("/(Admin)/(tabs)/admin");
    else {
      if (typeof isAuthenticated === "undefined") return;
      const inApp = segments[0] === "(tabs)";
      if (isAuthenticated && !inApp) {
        router.replace("/Home");
      }
    }
    if (isAuthenticated == false) {
      router.navigate("/Login");
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