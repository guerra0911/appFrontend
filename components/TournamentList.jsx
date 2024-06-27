import React, { useState, useCallback } from 'react';
import { ScrollView, View, Text, RefreshControl, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import TournamentCard from './TournamentCard';
import api from '../api'; // Ensure this is the correct path to your api.js

const TournamentList = () => {
  const [tournaments, setTournaments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTournaments = async () => {
    setRefreshing(true);
    try {
      const response = await api.get('/api/tournaments/');
      setTournaments(response.data);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTournaments();
    }, [])
  );

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, padding: 16, paddingBottom: 50 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchTournaments} />
      }
    >
      {tournaments.length > 0 ? (
        tournaments.map(tournament => (
          <TournamentCard key={tournament.id} tournament={tournament} />
        ))
      ) : (
        <View style={styles.noTournaments}>
          <Text style={styles.noTournamentsText}>No tournaments available</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  noTournaments: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTournamentsText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
  },
});

export default TournamentList;
