import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateCurrentUser,
  sendPasswordResetEmail,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db ,usersRef} from "./config"
import { doc, getDoc, setDoc } from "firebase/firestore";

// create context
const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);

  useEffect(() => {
    // onAuthStateChanged
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
        updateUserDate(user.uid);
      } else {
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
      return { success: true };
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
      await signOut(auth);
      return { success: true };
    } catch (error) {
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
