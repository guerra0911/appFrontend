import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Dimensions, Image } from "react-native";

const screenWidth = Dimensions.get("window").width;

const ChallengeFooter = ({ hasCurrentUserSelectedWinner, originalPost, challengerPost, originalPicks, challengerPicks }) => {
  const widthAnim = useRef(new Animated.Value(hasCurrentUserSelectedWinner ? screenWidth - 38 : 36)).current;

  useEffect(() => {
    if (hasCurrentUserSelectedWinner) {
      Animated.timing(widthAnim, {
        toValue: screenWidth - 38,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(widthAnim, {
        toValue: 36,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [hasCurrentUserSelectedWinner, widthAnim]);

  const totalPicks = originalPicks.length + challengerPicks.length;
  const originalPercentage = totalPicks > 0 ? ((originalPicks.length / totalPicks) * 100).toFixed(1) : 0;
  const challengerPercentage = totalPicks > 0 ? ((challengerPicks.length / totalPicks) * 100).toFixed(1) : 0;

  return (
    <Animated.View style={[styles.footer, { width: widthAnim }]}>
      {hasCurrentUserSelectedWinner && (
        <View style={styles.contentContainer}>
          <Image
            source={{ uri: originalPost.author.profile.image }}
            style={styles.profilePicture}
          />
          <Text style={styles.pickText}>{originalPicks.length} ({originalPercentage}%)</Text>
          <Text style={styles.vsText}>VS</Text>
          <Text style={styles.pickText}>{challengerPicks.length} ({challengerPercentage}%)</Text>
          <Image
            source={{ uri: challengerPost.author.profile.image }}
            style={styles.profilePicture}
          />
        </View>
      )}
      {!hasCurrentUserSelectedWinner && (
        <Text style={styles.vsText}>VS</Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  footer: {
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F5F5F5",
    borderColor: "#DCDCDC",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: -25,
    left: 8,
    flexDirection: "row",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: '100%',
  },
  profilePicture: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  vsText: {
    fontSize: 10,
    color: "#000",
    marginHorizontal: 8,
  },
  pickText: {
    fontSize: 10,
    color: "#000",
  },
});

export default ChallengeFooter;
