import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import { useAuth } from "../firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function forgetPassword() {
  const { changePassword } = useAuth();
  const [email, setEmail] = useState("");
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Forgot Password</Text>
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
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Pressable style={styles.sendButton}>
            <Text style={styles.sendButtonText}>SEND CODE</Text>
          </Pressable>
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
    marginBottom: 25,
  },
  sendButton: {
    backgroundColor: "#30633e",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
});