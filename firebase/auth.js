import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateCurrentUser,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db ,usersRef} from "./config"
import { doc, getDoc, setDoc } from "firebase/firestore";

import AsyncStorage from "@react-native-async-storage/async-storage";
// create context
const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);

  useEffect(() => {
    // onAuthStateChanged
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser && firebaseUser.emailVerified) {
      await AsyncStorage.setItem("user", JSON.stringify(firebaseUser));
      setIsAuthenticated(true);
      updateUserDate(firebaseUser.uid);
    } else {
      await AsyncStorage.removeItem("user");
      setIsAuthenticated(false);
      setUser(null);
    }
    });
    return unsub;
  }, []);

  const updateUserDate = async (userId) => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setUser({
        ...user,
        username: data.username,
        profileUrl: data.profileUrl,
        userId: data.userId,
        email: data.email,
        password: data.password,
      });
    } else {
      console.log("No such document!");
    }
  };

  const login = async (email, password) => {
    try {
      // login
      const response = await signInWithEmailAndPassword(auth, email, password);
      if (!response.user.emailVerified) {
        await signOut(auth); // immediately sign out the user
        return { success: false, msg: "Please verify your email before logging in." };
      }
      const docRef = doc(db, "users", response.user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        const userWithUsername = {
          ...response.user,
          username: userData.username,
        };

        await AsyncStorage.setItem("user", JSON.stringify(userWithUsername));
        return { success: true, data: userWithUsername };
      } else {
        return { success: false, msg: "User data not found in Firestore." };
      }
    } catch (error) {
      let msg = error?.message;
      if (msg.includes("(auth/invalid-email)")) msg = "Invalid Email";
      if (msg.includes("(auth/invalid-credential)")) msg = "Invalid Credential";
      return { success: false, msg };
    }
  };
  const logout = async () => {
    try {
      // logout
      console.log("user logged out");
      await signOut(auth);
      await AsyncStorage.clear(); // Clear all stored data to ensure logout persists between sessions
      console.log("user logged out");
      return { success: true };
    } catch (error) {
      console.log("error logging out : ", error);
      return { success: false, msg: error?.message, error };
    }
  };

  const changePassword = async (email) => {
    await sendPasswordResetEmail(auth, email)
      .then(() => alert("Passwoed rest email sent"))
      .catch((error) => console.log(error.message));
  };

  const register = async (email, password, username) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await sendEmailVerification(response?.user);
      console.log("responce.user : ", response?.user);

      await setDoc(doc(db, "users", response?.user?.uid), {
        username,
        email,
        userId: response?.user?.uid,
      }).catch((err) => {
        console.log("Firestore Error:", err.message);
      });

      console.log("user created : ", response?.user);
      return { success: true, Data: response?.user };
    } catch (error) {
      let msg = error?.message;
      if (msg.includes("(auth/invalid-email)")) msg = "Invalid Email";
      if (msg.includes("(auth/email-already-in-use)"))
        msg = "This Email Is Already In Use";
      return { success: false, msg };
    }
  };

    const loadUserFromStorage = async () => {
    const storedUser = await AsyncStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
        if (storedUser) {
        return JSON.parse(storedUser); // Ensure this returns the parsed user
    }
    return null;
  };

  return (
    <>
      <AuthContext.Provider
        value={{
          user,
          isAuthenticated,
          login,
          register,
          logout,
          changePassword,
          loadUserFromStorage,
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};

const useAuth = () => {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be wrapped inside AuthContextProvider");
  }

  return value;
};

export { AuthContext, AuthContextProvider, useAuth };
