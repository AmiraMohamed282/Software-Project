import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";

export default function HomeScreens() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={"large"} color={"gray"} />
    </View>
  );
}



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
