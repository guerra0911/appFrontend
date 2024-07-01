import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, StyleSheet } from "react-native";

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[
        styles.container,
        containerStyles,
        isLoading && styles.loading,
      ]}
      disabled={isLoading}
    >
      <Text style={[styles.text, textStyles]}>
        {title}
      </Text>

      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color="#fff"
          size="small"
          style={styles.indicator}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#69C3FF', // Equivalent to bg-secondary
    borderRadius: 10, // Equivalent to rounded-xl
    minHeight: 62, // Equivalent to min-h-[62px]
    flexDirection: 'row', // Equivalent to flex flex-row
    justifyContent: 'center', // Equivalent to justify-center
    alignItems: 'center', // Equivalent to items-center
    marginVertical: 8,
  },
  loading: {
    opacity: 0.5, // Equivalent to opacity-50
  },
  text: {
    color: 'white', // Equivalent to text-primary
    fontFamily: 'psemibold', // Equivalent to font-psemibold
    fontSize: 18, // Equivalent to text-lg
    fontWeight: "bold",
  },
  indicator: {
    marginLeft: 8, // Equivalent to ml-2
  },
});

export default CustomButton;
