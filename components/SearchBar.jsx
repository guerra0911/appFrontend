// SearchBar.jsx
import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SearchBar = () => {
    const navigation = useNavigation();

    const handleFocus = () => {
        navigation.navigate('searchPage', { initialQuery: '' });
    };

    return (
        <TouchableOpacity onPress={handleFocus} style={styles.searchContainer}>
            <FontAwesome name="search" size={20} color="#69C3FF" />
            <TextInput
                style={styles.input}
                placeholder="Search..."
                placeholderTextColor="#DCDCDC"
                editable={false}
                pointerEvents="none"
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#DCDCDC",
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#F5F5F5",
        padding: 10,
        flex: 1,
        marginHorizontal: 10,
    },
    input: {
        flex: 1,
        marginLeft: 10,
        color: "black",
    },
});

export default SearchBar;
