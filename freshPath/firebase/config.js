import { initializeApp } from "firebase/app";
// import { getReactNativePersistence } from "@firebase/auth/dist/rn/index.js";
import { getFirestore, collection } from "firebase/firestore";
import { initializeAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDN28DoSI7XrX5WLEndgUAxLUwkPumZCwo",
  authDomain: "freshpath-95318.firebaseapp.com",
  projectId: "freshpath-95318",
  storageBucket: "freshpath-95318.firebasestorage.app",
  messagingSenderId: "903133717108",
  appId: "1:903133717108:web:d85b16d6db672a5796e721",
  measurementId: "G-CYLXVX0NQF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app);

export const db = getFirestore(app);

export const usersRef = collection(db, "users");

export const admin = "MooMg3wYKfPBzUkTWk0T7iY1xsS2";
