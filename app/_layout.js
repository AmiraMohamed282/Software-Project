import { MenuProvider } from "react-native-popup-menu";
import { AuthContextProvider, useAuth } from "../firebase/auth";
import React, { useEffect } from 'react';
import { Slot, useRouter } from 'expo-router';
import 'react-native-gesture-handler';

const MainLayout = () => {
  const router = useRouter();
  const { loadUserFromStorage } = useAuth();

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const user = await loadUserFromStorage();
        if (!user) {
          router.replace("/Login");
        } else {
          // Check if the user is an admin
          if (user.email === "admin@email.com") {
            if (router.pathname === "/") {
              router.replace("/admin");
            }
          } else {
            if (router.pathname === "/") {
              router.replace("/(tabs)/home");
            }
          }
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
