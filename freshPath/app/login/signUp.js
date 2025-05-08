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

import { useAuth } from "../../firebase/auth";

export default function SignUp() {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const userNameRef = useRef("");
  const profileRef = useRef("");
  const { register } = useAuth();
  const [loding, setLoding] = useState(false);

  const handleRegister = async () => {
    if (
      !emailRef.current ||
      !passwordRef.current ||
      !userNameRef.current 
    ) {
      Alert.alert("Sign Up ", "Please fill all the fields");
      return;
    }
    setLoding(true);
    let response = await register(
      emailRef.current,
      passwordRef.current,
      userNameRef.current,
      profileRef.current
    );
    setLoding(false);

    if (!response.success) {
      Alert.alert("Sign Up", response.msg);
    }
    //regster prosecc
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
              onPress={() => setShowPassword(!showPassword)}
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
              // onChangeText={setRetypePassword}
            />
            <Pressable
              onPress={() => setShowRetypePassword(!showRetypePassword)}
              style={styles.eyeButton}
            >
              <Text>{showRetypePassword ? "🙈" : "👁️"}</Text>
            </Pressable>
          </View>

          <View>
            {loding ? (
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                {/* <Loading size={hp(20)} /> */}
                <ActivityIndicator size={"large"} color={"gray"} />
              </View>
            ) : (
              <Pressable style={styles.signupButton} onPress={()=>handleRegister()}>
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
});
