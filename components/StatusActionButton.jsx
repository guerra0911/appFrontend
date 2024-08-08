import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const StatusActionButton = ({ text, color, onPress }) => {
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: color }]} onPress={onPress}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 3,
    paddingVertical: 4,
    paddingHorizontal: 10, // Reduce padding to a smaller value
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start' // Allow button to wrap its content
  },
  buttonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default StatusActionButton;
