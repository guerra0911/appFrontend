import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import RenderModal from "../app/(tabs)/renderModal";
import CreateChallengeForm from "./CreateChallengeForm";
import CreateSubForm from "./CreateSubForm";
import { formatDistanceToNow } from "date-fns";
import usePostActions from "../hooks/usePostActions";

const sword =
  "https://nickguerrabucket.s3.us-east-2.amazonaws.com/admin/sword.png";
const quote =
  "https://nickguerrabucket.s3.us-east-2.amazonaws.com/admin/quote.png";

const ChallengeCard = ({ post, onLikeDislikeUpdate, height }) => {
  const navigation = useNavigation();
  const {
    user,
    likeCount,
    dislikeCount,
    likedBy,
    dislikedBy,
    likeDislikeModalVisible,
    setLikeDislikeModalVisible,
    formModalVisible,
    setFormModalVisible,
    likeDislikeModalTitle,
    formType,
    setFormType,
    handleLike,
    handleDislike,
    openLikedByModal,
    openDislikedByModal,
    openChallengeForm,
    openSubForm,
  } = usePostActions(post, onLikeDislikeUpdate);

  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);  

  const navigateToProfile = (userId) => {
    setLikeDislikeModalVisible(false);
    setFormModalVisible(false);
    navigation.navigate("otherProfile", { userId });
  };

  const images = [post.image1, post.image2, post.image3].filter(Boolean);

  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.measure((x, y, width, height) => {
        setContentHeight(height);
      });
    }
  }, [contentRef.current]);

  useEffect(() => {
    if (height) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
  }, [height]);
  

  return (
    <View style={[styles.wrapper, { height: height ? height : 'auto' }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigateToProfile(post?.author?.id)}
          style={styles.profilePictureContainer}
        >
          <Image
            source={{ uri: post.author?.profile?.image }}
            style={styles.profilePicture}
            resizeMode="cover"
          />
        </TouchableOpacity>
        <View>
          <Text
            style={styles.userName}
            onPress={() => navigateToProfile(post?.author?.id)}
          >
            @{post.author?.username}
          </Text>
          <Text style={styles.date}>
            {formatDistanceToNow(new Date(post.created_at), {
              addSuffix: true,
            })}
          </Text>
        </View>
      </View>
  
      <View style={[styles.contentContainer, { height: height ? height : 'auto' }]}>
        <View ref={contentRef} onLayout={() => {}} style={styles.contentWrapper}>
          <Text style={styles.content}>{post.content}</Text>
  
          {images.length > 0 && (
            <ScrollView horizontal pagingEnabled style={styles.imageContainer}>
              {images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={styles.image}
                  resizeMode="cover"
                />
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
              <Text style={styles.actionText}>{post.comments.length}</Text>
            </TouchableOpacity>
            {post.author.id !== user.id && (
              <>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={openChallengeForm}
                >
                  <Image source={{ uri: sword }} style={styles.iconButton} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={openSubForm}
                >
                  <Image source={{ uri: quote }} style={styles.iconButton} />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
  
        {height && height < contentHeight && (
          <LinearGradient
            colors={['rgba(245, 245, 245, 0)', 'rgba(245, 245, 245, 1)']}
            style={styles.footer}
          >
          </LinearGradient>
        )}
      </View>
  
      <RenderModal
        modalVisible={likeDislikeModalVisible}
        setModalVisible={setLikeDislikeModalVisible}
      >
        <Text style={styles.modalTitle}>{likeDislikeModalTitle}</Text>
        <ScrollView>
          {(likeDislikeModalTitle === "Liked By" ? likedBy : dislikedBy).map(
            (user, index, array) => (
              <View key={user.id}>
                <TouchableOpacity
                  key={user.id}
                  onPress={() => navigateToProfile(user.id)}
                >
                  <View style={styles.userContainer}>
                    <Image
                      source={{ uri: user.profile.image }}
                      style={styles.userImage}
                    />
                    <Text style={styles.userName}>@{user.username}</Text>
                  </View>
                </TouchableOpacity>
                {index < array.length - 1 && (
                  <View style={styles.separator} />
                )}
              </View>
            )
          )}
        </ScrollView>
      </RenderModal>
  
      <RenderModal
        modalVisible={formModalVisible}
        setModalVisible={setFormModalVisible}
      >
        {formType === "challenge" ? (
          <CreateChallengeForm
            setModalVisible={setFormModalVisible}
            originalNoteId={post.id}
          />
        ) : (
          <CreateSubForm
            setModalVisible={setFormModalVisible}
            originalNoteId={post.id}
          />
        )}
      </RenderModal>
    </View>
  );
  
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    backgroundColor: "#F5F5F5",
    borderColor: "#DCDCDC",
    borderRadius: 10,
    borderWidth: 1,
    padding: 16,
    position: "relative",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  profilePictureContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#69C3FF",
    marginRight: 16,
  },
  profilePicture: {
    width: "100%",
    height: "100%",
  },
  date: {
    color: "#aaa",
    fontSize: 14,
  },
  contentContainer: {
    position: "relative",
    overflow: "hidden",
    flex: 1,
  },
  contentWrapper: {
    
  },
  content: {
    color: "black",
    fontSize: 16,
    marginBottom: 16,
  },
  imageContainer: {
    marginBottom: 16,
    height: 200, // Adjust height as needed
  },
  image: {
    width: 300, // Adjust width as needed
    height: "100%",
    marginRight: 10,
    borderRadius: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    color: "black",
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
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    backgroundColor: "#DCDCDC",
    marginVertical: 1,
    marginHorizontal: 13,
  },
  iconButton: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 50, // Adjust the height as needed
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    color: "#DCDCDC",
    fontSize: 20,
  },
});

export default ChallengeCard;
