import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Alert,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import React, { useRef, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import { Octicons } from "@expo/vector-icons";
import { TextInput } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../firebase/auth";
import { Route } from "expo-router/build/Route";
import { ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const setCurrentUser = (user)=>{
  AsyncStorage.setItem ("user" , JSON.stringify(user))
}


export default function Login() {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const { login } = useAuth();
  const [loding, setLoding] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error , setError] = useState();

  const handleLogin = async () => {
    setError("");
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Sign In ", "Please fill all the fields");
      setError("Please fill all the fields");
      return;
    }
    setLoding(true);
    const response = await login(emailRef.current, passwordRef.current);

    setLoding(false);
    console.log("sign in response ");
    if (!response.success) {
      Alert.alert("Sign In ", response.msg);
      setError(response.msg || "Login failed. Please try again.");
      console.log(response.msg);
    }else {
    console.log(response.data.user)
    router.replace("/(tabs)/home");
    console.log(response);
  }
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Log In</Text>
          <Text style={styles.headerSubtitle}>
            Please sign in to your existing account
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>EMAIL</Text>
          <TextInput
            style={styles.input}
            placeholder="example@gmail.com"
            placeholderTextColor="#ccc"
            // value={email}
            onChangeText={(value) => (emailRef.current = value)}
            keyboardType="email-address"
          />

        <View>
          <Text style={styles.label}>PASSWORD</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••••••"
            placeholderTextColor="#ccc"
            // value={password}
            onChangeText={(value) => (passwordRef.current = value)}
            secureTextEntry={!showPassword} // Toggle secureTextEntry based on state
            />
          <Pressable
              onPress={() =>   {if(passwordRef.current)setShowPassword(!showPassword)}}
              style={styles.eyeButton}
            >
              <Text>{showPassword ? "🙈" : "👁️"}</Text>
            </Pressable>
          </View>
          <View style={styles.row}>
            <Pressable onPress={()=>router.navigate('/forgetPassword')}>
              <Text style={styles.linkText}>Forgot Password</Text>
            </Pressable>
          </View>

          <View>
            {loding ? (
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <ActivityIndicator size={"large"} color={"gray"} />
              </View>
            ) : (
              <Pressable
                style={styles.loginButton}
                onPress={() => handleLogin()}
              >
                <Text style={styles.loginButtonText}>LOG IN</Text>
              </Pressable>
            )}
          </View>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don’t have an account?</Text>
            <Pressable onPress={() => router.push("/signUp")}>
              <Text style={styles.signupLink}> SIGN UP</Text>
            </Pressable>
          </View>
         {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null} 
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: "#0c0c2c",
    paddingVertical: 60,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "#bbb",
    marginTop: 8,
    fontSize: 14,
  },
  form: {
    paddingHorizontal: 25,
    paddingTop: 40,
  },
  label: {
    fontSize: 12,
    color: "#555",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#f1f1f1",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 14,
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  linkText: {
    color: "#30633e",
    fontSize: 13,
  },
  loginButton: {
    backgroundColor: "#30633e",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 30,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signupText: {
    fontSize: 13,
    color: "#333",
  },
  signupLink: {
    fontSize: 13,
    color: "#30633e",
  },
  eyeButton: {
    position: "absolute",
    right: 15,
    top: 35,
  },
  errorBox: {
  backgroundColor: "#ffdddd",
  borderRadius: 10,
  padding: 10,
  marginBottom: 15,
  borderColor: "#ff5c5c",
  borderWidth: 1,
},
errorText: {
  color: "#cc0000",
  fontSize: 13,
  textAlign: "center",
},
});