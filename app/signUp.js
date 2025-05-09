import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Alert,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import React, { useRef, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import { Feather, Octicons } from "@expo/vector-icons";
import { TextInput } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useAuth } from "../firebase/auth";

export default function SignUp() {
  const emailRef = useRef("");
  const passwordRef = useRef(""); 
  const retypePasswordRef = useRef("");
  const userNameRef = useRef("");
  const profileRef = useRef("");
  const { register } = useAuth();
  const [loding, setLoding] = useState(false);
  const [error, setError] = useState(""); // Add error state

  const handleRegister = async () => {
    if (!emailRef.current || !passwordRef.current || !userNameRef.current) {
      setError("Please fill all the fields");
      Alert.alert("Sign Up", "Please fill all the fields");
      return;
    }
    if (passwordRef.current !== retypePasswordRef.current) {
      setError("Passwords do not match");
      Alert.alert("Sign Up", "Passwords do not match");
      return;
    }
    setError(""); // Clear error before proceeding
    setLoding(true);
    let response = await register(
      emailRef.current,
      passwordRef.current,
      userNameRef.current
    );
    setLoding(false);

    if (!response.success) {
      setError(response.msg || "Sign-up failed. Please try again.");
      Alert.alert("Sign Up", response.msg);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sign Up</Text>
          <Text style={styles.headerSubtitle}>
            Please sign up to get started
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>NAME</Text>
          <TextInput
            style={styles.input}
            placeholder="john doe"
            placeholderTextColor="#ccc"
            // value={name}
            onChangeText={(value) => (userNameRef.current = value)}
          />

          <Text style={styles.label}>EMAIL</Text>
          <TextInput
            style={styles.input}
            placeholder="example@gmail.com"
            placeholderTextColor="#ccc"
            // value={email}
            onChangeText={(value) => (emailRef.current = value)}
            keyboardType="email-address"
          />

          <Text style={styles.label}>PASSWORD</Text>
          <View style={styles.passwordField}>
            <TextInput
              style={styles.input}
              placeholder="••••••••••"
              placeholderTextColor="#ccc"
              secureTextEntry={!showPassword}
              // value={password}
              onChangeText={(value) => (passwordRef.current = value)}
            />
            <Pressable
              onPress={() =>   {if  (passwordRef.current)setShowPassword(!showPassword)}}
              style={styles.eyeButton}
            >
              <Text>{showPassword ? "🙈" : "👁️"}</Text>
            </Pressable>
          </View>

          <Text style={styles.label}>RE-TYPE PASSWORD</Text>
          <View style={styles.passwordField}>
            <TextInput
              style={styles.input}
              placeholder="••••••••••"
              placeholderTextColor="#ccc"
              secureTextEntry={!showRetypePassword}
              // value={retypePassword}
               onChangeText={(value) => (retypePasswordRef.current = value)}
            />
            <Pressable
              onPress={() =>   {if  (retypePasswordRef.current)setShowRetypePassword(!showRetypePassword)}}
              style={styles.eyeButton}
            >
              <Text>{showRetypePassword ? "🙈" : "👁️"}</Text>
            </Pressable>
          </View>

          <View>
            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {loding ? (
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <ActivityIndicator size={"large"} color={"gray"} />
              </View>
            ) : (
              <Pressable style={styles.signupButton} onPress={() => handleRegister()}>
                <Text style={styles.signupText}>SIGN UP</Text>
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { flexGrow: 1 },
  header: {
    backgroundColor: "#0c0c2c",
    paddingVertical: 60,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: "center",
  },
  headerTitle: { color: "#fff", fontSize: 26, fontWeight: "bold" },
  headerSubtitle: { color: "#bbb", marginTop: 8, fontSize: 14 },
  form: { paddingHorizontal: 25, paddingTop: 40 },
  label: { fontSize: 12, color: "#555", marginBottom: 5 },
  input: {
    backgroundColor: "#f1f1f1",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 14,
    marginBottom: 15,
  },
  passwordField: {
    position: "relative",
    marginBottom: 15,
  },
  eyeButton: {
    position: "absolute",
    right: 15,
    top: 12,
  },
  signupButton: {
    backgroundColor: "#f57c00",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  signupText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
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
