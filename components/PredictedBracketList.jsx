import React, { useState, useEffect } from "react";
import { View, ScrollView, Text } from "react-native";
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
    <View style={{ flex: 1 }}>
      <Loader isLoading={loading} />
      {!loading && error && (
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-500">{error}</Text>
        </View>
      )}
      {!loading && !error && (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {predictedBrackets.length > 0 ? (
            predictedBrackets.map((bracket) => (
              <View key={bracket.id} className="mb-4">
                <BracketCard bracket={bracket} />
              </View>
            ))
          ) : (
            <View className="flex-1 justify-center items-center">
              <Text>No predicted brackets available.</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default PredictedBracketList;
