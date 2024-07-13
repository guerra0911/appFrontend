import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import { Image, Text, View, RefreshControl, Alert, StyleSheet } from "react-native";

import { useGlobalContext } from "../../context/GlobalProvider";
import { images } from "../../constants";
import { PostList } from "../../components";
import Loader from "../../components/Loader";
import api from "../../api";
import SearchBar from "../../components/SearchBar";

const Home = () => {
    const [refreshing, setRefreshing] = useState(false);
    const { userId } = useLocalSearchParams();
    const [username, setUsername] = useState(null);
    const { user, setUser, setIsLogged, loading, setLoading, setPosts } = useGlobalContext();
    const [isSearchBarVisible, setSearchBarVisible] = useState(false);

    const fetchUsername = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/user/me/');
            setUsername(res.data.username);
        } catch (error) {
            console.error("Error fetching username:", error);
            Alert.alert("Error", "Failed to fetch username.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            const id = userId || user?.id;
            if (id) {
                await fetchUsername();
            }
        };

        if (user) {
            fetchUser();
        }

        // Clear posts when navigating away
        return () => {
            setPosts([]);
        };
    }, [userId, user]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        fetchUsername();
        setRefreshing(false);
    }, [userId, user]);

    return (
        <GestureHandlerRootView style={styles.flex1}>
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.scrollViewContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    <Loader isLoading={loading} />
                    {!loading && username && (
                        <>
                            <View style={styles.welcomeContainer}>
                                <View style={styles.headerContainer}>
                                    <View>
                                        <Text style={styles.welcomeText}>
                                            Welcome Back
                                        </Text>
                                        <Text style={styles.usernameText}>
                                            {username}
                                        </Text>
                                    </View>
                                    {!isSearchBarVisible && <SearchBar setSearchBarVisible={setSearchBarVisible} />}
                                    <View style={styles.logoContainer}>
                                        <Image
                                            source={images.logoSmall}
                                            style={styles.logo}
                                            resizeMode="contain"
                                        />
                                    </View>
                                </View>
                            </View>
                            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                                <View>
                                    {/* Pass in Null to Fetch ALL posts in GlobalProvider */}
                                    <PostList userId={null} />      
                                </View>
                            </ScrollView>
                        </>
                    )}
                </ScrollView>
            </View>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    flex1: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    safeArea: {
        backgroundColor: '#F5F5F5',
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
    },
    welcomeContainer: {
        marginTop: 65,
        marginBottom: 0,
        paddingHorizontal: 16,
        spaceY: 24,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    welcomeText: {
        fontSize: 14,
        color: 'black',
        fontFamily: 'psemibold',
        fontWeight: "bold",
    },
    usernameText: {
        fontSize: 24,
        fontFamily: 'psemibold',
        color: 'black', 
        fontWeight: "bold",
    },
    logoContainer: {
        marginTop: 6,
    },
    logo: {
        width: 36,
        height: 40,
    },
});

export default Home;
