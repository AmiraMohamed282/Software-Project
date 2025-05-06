import { initializeApp } from "firebase/app";
import { getReactNativePersistence } from "@firebase/auth/dist/rn/index.js";
import { getFirestore, collection } from "firebase/firestore";

import { initializeAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDqtmc8686OP9mxhh7iQGAbiroSLgMlLsI",
  authDomain: "project-software-ebe66.firebaseapp.com",
  projectId: "project-software-ebe66",
  storageBucket: "project-software-ebe66.firebasestorage.app",
  messagingSenderId: "800565973535",
  appId: "1:800565973535:web:4ef9adfe398b3e4c833b2a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app);

export const db = getFirestore(app);

export const usersRef = collection(db, "users");

export const admin = "MooMg3wYKfPBzUkTWk0T7iY1xsS2";
