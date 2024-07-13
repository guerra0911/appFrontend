import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import api from '../api'; // Ensure the correct path to your api.js
import { useGlobalContext } from '../context/GlobalProvider'; // Ensure the correct path to your GlobalProvider.js
import RenderModal from "../app/(tabs)/renderModal";
import CreateChallengeForm from "./CreateChallengeForm"; // Ensure the correct path to your CreateChallengeForm.jsx
import CreateSubForm from "./CreateSubForm"; // Ensure the correct path to your CreateSubForm.jsx

const PostCard = ({
  profilePicture,
  username,
  date,
  content,
  likes = [],
  dislikes = [],
  comments = [],
  post,
  images = [],
  onLikeDislikeUpdate,
}) => {
  const navigation = useNavigation();
  const { user, posts, setPosts } = useGlobalContext(); // Accessing the current user and posts
  const [likeCount, setLikeCount] = useState(likes.length);
  const [dislikeCount, setDislikeCount] = useState(dislikes.length);
  const [likedBy, setLikedBy] = useState([]);
  const [dislikedBy, setDislikedBy] = useState([]);
  const [likeDislikeModalVisible, setLikeDislikeModalVisible] = useState(false);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [likeDislikeModalTitle, setLikeDislikeModalTitle] = useState('');
  const [formType, setFormType] = useState(null); // New state to handle form type (challenge or sub)

  const navigateToProfile = (userId) => {
    setLikeDislikeModalVisible(false);
    setFormModalVisible(false);
    navigation.navigate("otherProfile", { userId });
  };

  const updatePostLikesDislikes = (updatedPost) => {
    setPosts((prevPosts) => 
      prevPosts.map((p) => (p.id === updatedPost.id ? updatedPost : p))
    );
  };

  const handleLike = async () => {
    try {
      const response = await api.post(`/api/notes/${post.id}/like/`);
      setLikeCount(response.data.likes);
      setDislikeCount(response.data.dislikes);
      updatePostLikesDislikes(response.data); // Update global state
      onLikeDislikeUpdate(); // Trigger a refresh of the posts
    } catch (error) {
      console.error(error);
    }
  };

  const handleDislike = async () => {
    try {
      const response = await api.post(`/api/notes/${post.id}/dislike/`);
      setLikeCount(response.data.likes);
      setDislikeCount(response.data.dislikes);
      updatePostLikesDislikes(response.data); // Update global state
      onLikeDislikeUpdate(); // Trigger a refresh of the posts
    } catch (error) {
      console.error(error);
    }
  };

  const fetchLikedBy = async () => {
    try {
      const response = await api.get(`/api/notes/${post.id}/liked_by/`);
      setLikedBy(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDislikedBy = async () => {
    try {
      const response = await api.get(`/api/notes/${post.id}/disliked_by/`);
      setDislikedBy(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const openLikedByModal = () => {
    setLikeDislikeModalTitle('Liked By');
    fetchLikedBy();
    setLikeDislikeModalVisible(true);
  };

  const openDislikedByModal = () => {
    setLikeDislikeModalTitle('Disliked By');
    fetchDislikedBy();
    setLikeDislikeModalVisible(true);
  };

  const openChallengeForm = () => {
    setFormType('challenge');
    setFormModalVisible(true);
  };

  const openSubForm = () => {
    setFormType('sub');
    setFormModalVisible(true);
  };

  return (
    <View style={styles.postCard}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigateToProfile(post?.author?.id)}
          style={styles.profilePictureContainer}
        >
          <Image
            source={{ uri: profilePicture }}
            style={styles.profilePicture}
            resizeMode="cover"
          />
        </TouchableOpacity>
        <View>
          <Text
            style={styles.userName}
            onPress={() => navigateToProfile(post?.author?.id)}
          >
            @{username}
          </Text>
          <Text style={styles.date}>{date}</Text>
        </View>
      </View>

      <Text style={styles.content}>{content}</Text>

      {images.filter(Boolean).length > 0 && (
        <ScrollView
          horizontal
          pagingEnabled
          style={styles.imageContainer}
        >
          {images.map((image, index) => (
            image && (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.image}
                resizeMode="cover"
              />
            )
          ))}
        </ScrollView>
      )}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <FontAwesome name="thumbs-up" size={18} color="#69C3FF" />
          <TouchableOpacity onPress={openLikedByModal}>
            <Text style={styles.actionText}>{likeCount}</Text>
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleDislike}>
          <FontAwesome name="thumbs-down" size={18} color="#FF0000" />
          <TouchableOpacity onPress={openDislikedByModal}>
            <Text style={styles.actionText}>{dislikeCount}</Text>
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome name="comment" size={18} color="black" />
          <Text style={styles.actionText}>{comments.length}</Text>
        </TouchableOpacity>
        {post.author.id !== user.id && (
          <>
            <TouchableOpacity style={styles.actionButton} onPress={openChallengeForm}>
              <FontAwesome name="exchange" size={18} color="black" />
              <Text style={styles.actionText}>Challenge</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={openSubForm}>
              <FontAwesome name="subscript" size={18} color="black" />
              <Text style={styles.actionText}>Sub</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <RenderModal modalVisible={likeDislikeModalVisible} setModalVisible={setLikeDislikeModalVisible}>
        <Text style={styles.modalTitle}>{likeDislikeModalTitle}</Text>
        <ScrollView>
          {(likeDislikeModalTitle === 'Liked By' ? likedBy : dislikedBy).map((user, index, array) => (
            <View key={user.id}>
            <TouchableOpacity key={user.id} onPress={() => navigateToProfile(user.id)}>
              <View style={styles.userContainer}>
                <Image source={{ uri: user.profile.image }} style={styles.userImage} />
                <Text style={styles.userName}>@{user.username}</Text>
              </View>
            </TouchableOpacity>
            {index < array.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
        </ScrollView>
      </RenderModal>

      <RenderModal modalVisible={formModalVisible} setModalVisible={setFormModalVisible}>
        {formType === 'challenge' ? (
          <CreateChallengeForm setModalVisible={formModalVisible} originalNoteId={post.id} />
        ) : (
          <CreateSubForm setModalVisible={formModalVisible} originalNoteId={post.id} />
        )}
      </RenderModal>
    </View>
  );
};

const styles = StyleSheet.create({
  postCard: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    borderColor: "#DCDCDC",
    borderRadius: 10,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profilePictureContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#69C3FF',
    marginRight: 16,
  },
  profilePicture: {
    width: '100%',
    height: '100%',
  },
  date: {
    color: '#aaa',
    fontSize: 14,
  },
  content: {
    color: 'black',
    fontSize: 16,
    marginBottom: 16,
  },
  imageContainer: {
    marginBottom: 16,
    height: 200,  // Adjust height as needed
  },
  image: {
    width: 300,  // Adjust width as needed
    height: '100%',
    marginRight: 10,
    borderRadius: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    color: 'black',
    fontSize: 16,
    marginLeft: 8,
  },
  modalTitle: {
    fontSize: 24,
    color: "black",
    fontWeight: "bold",
    marginBottom: 20,
    marginLeft: 13,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    marginVertical: 5,
  },
  userImage: {
    borderWidth: 2,
    borderColor: "#69C3FF",
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    color: "black",
    fontSize: 18,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: "#DCDCDC",
    marginVertical: 1,
    marginHorizontal: 13,
  },
});

export default PostCard;
