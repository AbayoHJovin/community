import React from "react";
import { View, StyleSheet } from "react-native";

const HealthLogo = () => {
  return (
    <View style={styles.container}>
      {/* Ellipse */}
      <View style={styles.ellipse}>
        {/* Add other elements as needed */}
        <View style={styles.vectorSmall} />
        <View style={styles.vectorMedium} />
        <View style={styles.vectorLarge} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: 63.29,
    height: 63.29,
    left: 0,
    top: 0,
    shadowColor: "rgba(86, 105, 255, 0.25)", // Converted shadow to React Native format
    shadowOffset: { width: 0, height: 8.67 },
    shadowOpacity: 0.25,
    shadowRadius: 21.68,
    elevation: 21.68,
  },
  ellipse: {
    position: "absolute",
    width: 63.29,
    height: 63.29,
    backgroundColor: "#25B14C",
  },
  vectorSmall: {
    position: "absolute",
    left: "5.21%",
    right: "5.21%",
    top: "5.21%",
    bottom: "5.21%",
    backgroundColor: "#FFFFFF",
  },
  vectorMedium: {
    position: "absolute",
    left: "30.21%",
    right: "30.21%",
    top: "38.54%",
    bottom: "21.88%",
    backgroundColor: "#FFFFFF",
  },
  vectorLarge: {
    position: "absolute",
    left: "40.62%",
    right: "40.62%",
    top: "48.96%",
    bottom: "32.29%",
    backgroundColor: "#FFFFFF",
  },
});

export default HealthLogo;