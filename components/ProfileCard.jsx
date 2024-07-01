import React from "react";
import { View, Text, Image, TouchableOpacity, Linking, StyleSheet } from "react-native";
import { FontAwesome } from '@expo/vector-icons';

const spotifyLogo = "https://nickguerrabucket.s3.us-east-2.amazonaws.com/admin/spotifyLogo.png";
const imdbLogo = "https://nickguerrabucket.s3.us-east-2.amazonaws.com/admin/imdbLogo.png";
const websiteLogo = "https://nickguerrabucket.s3.us-east-2.amazonaws.com/admin/websiteLogo.png"; // Updated to use website logo

const ProfileCard = ({ image, username, posts, followers, following, rating, button, spotifyLink, imdbLink, websiteLink, bio }) => {
  const hasLinks = spotifyLink || imdbLink || websiteLink;

  return (
    <View style={styles.card}>
      {/* Profile Picture, Username and Rating */}
      <View style={styles.profileSection}>
        {/* Profile Picture */}
        <View style={styles.profilePicture}>
          <Image
            source={{ uri: image }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        {/* Username and Rating */}
        <View style={styles.usernameSection}>
          <Text style={styles.username}>@{username}</Text>
          <View style={styles.ratingSection}>
            <Text style={styles.rating}>Rating: {rating}</Text>
            <FontAwesome name="star" size={20} color="#FFD700" style={styles.starIcon} />
          </View>
        </View>
      </View>

      

      {/* Social Links */}
      {hasLinks && (
        <View style={styles.socialLinks}>
          {spotifyLink && (
            <TouchableOpacity onPress={() => Linking.openURL(spotifyLink)} style={styles.socialLink}>
              <Image source={{ uri: spotifyLogo }} style={styles.socialIcon} />
              <Text style={styles.socialText}>My Spotify</Text>
            </TouchableOpacity>
          )}
          {imdbLink && (
            <TouchableOpacity onPress={() => Linking.openURL(imdbLink)} style={styles.socialLink}>
              <Image source={{ uri: imdbLogo }} style={styles.socialIcon} />
              <Text style={styles.socialText}>My IMDB</Text>
            </TouchableOpacity>
          )}
          {websiteLink && (
            <TouchableOpacity onPress={() => Linking.openURL(websiteLink)} style={styles.socialLink}>
              <Image source={{ uri: websiteLogo }} style={styles.socialIcon} />
              <Text style={styles.socialText}>My Website</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Posts, Followers, Following */}
      <View style={styles.statsSection}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{posts}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{followers}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{following}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

      {/* Bio */}
      {bio && (
        <View style={styles.bioSection}>
          <Text style={styles.bioText}>{bio}</Text>
        </View>
      )}   

      {/* Button */}
      <View style={styles.buttonSection}>
        {button}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 10,
    padding: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profilePicture: {
    width: 96,
    height: 96,
    borderRadius: 48,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#69C3FF',
    marginRight: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  usernameSection: {
    justifyContent: 'center',
  },
  username: {
    color: 'black',
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  rating: {
    color: '#007EFF',
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    marginLeft: 4,
  },
  starIcon: {
    marginLeft: 6,
  },
  bioSection: {
    marginBottom: 16,
  },
  bioText: {
    color: 'black',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 16,
  },
  socialLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  socialText: {
    color: 'black',
    fontFamily: 'Poppins-Regular',
  },
  statsSection: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    marginBottom: 20,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    color: 'black',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
  },
  statLabel: {
    color: 'black',
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
  },
  buttonSection: {
    width: '100%',
    marginTop: 2,
  },
});

export default ProfileCard;