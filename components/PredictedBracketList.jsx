import React, { useState, useEffect, useRef } from "react";
import { View, ScrollView, Text, StyleSheet, Dimensions, Animated } from "react-native";
import api from "../api";
import BracketCard from "./BracketCard";
import Loader from "./Loader";

const { width } = Dimensions.get('window');

const PredictedBracketList = ({ tournament }) => {
  const [predictedBrackets, setPredictedBrackets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showIndicator, setShowIndicator] = useState(true);
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const fetchPredictedBrackets = async () => {
      setLoading(true);
      try {
        if (tournament && tournament.id) {
          const response = await api.get(`/api/tournaments/${tournament.id}/`);
          setPredictedBrackets(response.data.predicted_brackets);
        }
      } catch (error) {
        console.error("Error fetching predicted brackets:", error);
        setError("Error fetching predicted brackets");
      } finally {
        setLoading(false);
      }
    };

    fetchPredictedBrackets();
  }, [tournament]);

  const handleScroll = () => {
    setShowIndicator(false);
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleScrollEnd = () => {
    setShowIndicator(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={{ flex: 1 }}>
      <Loader isLoading={loading} />
      {!loading && error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      {!loading && !error && (
        <>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.scrollViewContainer}
            horizontal
            onScrollBeginDrag={handleScroll}
            onScrollEndDrag={handleScrollEnd}
            scrollEventThrottle={16}
          >
            {predictedBrackets.length > 0 ? (
              predictedBrackets.map((bracket) => (
                <View key={bracket.id} style={styles.bracketContainer}>
                  <BracketCard bracket={bracket} />
                </View>
              ))
            ) : (
              <View style={styles.noBracketsContainer}>
                <Text style={styles.noBracketsText}>No predicted brackets available. Be the first to make a prediction!</Text>
              </View>
            )}
          </ScrollView>
          {showIndicator && (
            <Animated.View style={[styles.indicatorContainer, { opacity: fadeAnim }]}>
              <Text style={styles.indicatorText}>›</Text>
            </Animated.View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    // borderColor: "green",
    // borderWidth: 1,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
  },
  scrollViewContainer: {
    // borderColor: "green",
    // borderWidth: 1,
    padding: 0,
    // paddingRight: width * 0.1,
    paddingRight: 5,
    paddingBottom: 5,
    paddingTop: 5,
    paddingLeft: 3,
  },
  bracketContainer: {           //Header + Bracket
    // borderColor: "blue",
    // borderWidth: 1,
    marginRight: 40,
    borderRadius: 10,
    width: width - 40,
  },
  noBracketsContainer: {
    // borderColor: "red",
    // borderWidth: 1,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noBracketsText: {
    color: "#fff",
  },
  indicatorContainer: {
    position: "absolute",
    right: 10,
    top: '55%',
    marginTop: -12, // Adjust this value to position the indicator correctly
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 20,
    padding: 5,
  },
  indicatorText: {
    color: "#fff",
    fontSize: 24,
  },
});

export default PredictedBracketList;
