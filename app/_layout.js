import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { Slot, router, useRouter, useSegments } from "expo-router";
import { MenuProvider } from "react-native-popup-menu";
import { AuthContextProvider, useAuth } from "../firebase/auth";
import { admin, auth } from "../firebase/config";

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {

    const initializeUser = async () => {
      try {
        const user = await loadUserFromStorage();
        if (user) {
          if (user.email === "admin@email.com") {
            router.replace("/(Admin)/(tabs)/admin");
          } else {
            router.replace("/(tabs)/home");
          }
          router.replace("/(tabs)/home");
        } else {
          router.replace("/Login");
        }
      } catch (error) {
        console.error("Error initializing user:", error);
        router.replace("/Login");
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

const styles = StyleSheet.create({});
