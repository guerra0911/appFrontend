import React, { useState, useEffect } from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import api from "../api";
import BracketCard from "./BracketCard";
import Loader from "./Loader";

const PredictedBracketList = ({ tournament }) => {
  const [predictedBrackets, setPredictedBrackets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <View style={{ flex: 1, maxHeight: 400 }}>
      <Loader isLoading={loading} />
      {!loading && error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      {!loading && !error && (
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
  },
  scrollViewContainer: {
    padding: 16,
  },
  bracketContainer: {
    marginBottom: 16,
  },
  noBracketsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noBracketsText: {
    color: "#fff",
  },
});

export default PredictedBracketList;
