import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function index() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={"large"} color={"gray"} />
    </View>
  );
}

index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  ActivityIndicator: {
    fontSize: "large",
  },
});
