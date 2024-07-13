import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import RenderModal from "../app/(tabs)/renderModal";
import CreateChallengeForm from "./CreateChallengeForm";
import CreateSubForm from "./CreateSubForm";
import { formatDistanceToNow } from "date-fns";
import usePostActions from "../hooks/usePostActions";

const SubCard = ({ sub, onLikeDislikeUpdate }) => {
  const originalPost = sub.original_note;
  const subPost = sub.sub_note;

  const navigation = useNavigation();
  const originalPostActions = usePostActions(originalPost, onLikeDislikeUpdate);
  const subPostActions = usePostActions(subPost, onLikeDislikeUpdate);

  const navigateToProfile = (userId) => {
    originalPostActions.setLikeDislikeModalVisible(false);
    originalPostActions.setFormModalVisible(false);
    subPostActions.setLikeDislikeModalVisible(false);
    subPostActions.setFormModalVisible(false);
    navigation.navigate("otherProfile", { userId });
  };

  const renderPostCard = (post, postActions) => (
    <View style={styles.postCard}>
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

      <Text style={styles.content}>{post.content}</Text>

      {post.images?.filter(Boolean).length > 0 && (
        <ScrollView horizontal pagingEnabled style={styles.imageContainer}>
          {post.images
            .filter(Boolean)
            .map(
              (image, index) =>
                image && (
                  <Image
                    key={index}
                    source={{ uri: image }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                )
            )}
        </ScrollView>
      )}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={postActions.handleLike}>
          <FontAwesome name="thumbs-up" size={18} color="#69C3FF" />
          <TouchableOpacity onPress={postActions.openLikedByModal}>
            <Text style={styles.actionText}>{postActions.likeCount}</Text>
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={postActions.handleDislike}>
          <FontAwesome name="thumbs-down" size={18} color="#FF0000" />
          <TouchableOpacity onPress={postActions.openDislikedByModal}>
            <Text style={styles.actionText}>{postActions.dislikeCount}</Text>
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome name="comment" size={18} color="black" />
          <Text style={styles.actionText}>{post.comments.length}</Text>
        </TouchableOpacity>
        {post.author.id !== postActions.user.id && (
          <>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={postActions.openChallengeForm}
            >
              <FontAwesome name="exchange" size={18} color="black" />
              <Text style={styles.actionText}>Challenge</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={postActions.openSubForm}
            >
              <FontAwesome name="subscript" size={18} color="black" />
              <Text style={styles.actionText}>Sub</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <RenderModal
        modalVisible={postActions.likeDislikeModalVisible}
        setModalVisible={postActions.setLikeDislikeModalVisible}
      >
        <Text style={styles.modalTitle}>{postActions.likeDislikeModalTitle}</Text>
        <ScrollView>
          {(postActions.likeDislikeModalTitle === "Liked By" ? postActions.likedBy : postActions.dislikedBy).map(
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
        modalVisible={postActions.formModalVisible}
        setModalVisible={postActions.setFormModalVisible}
      >
        {postActions.formType === "challenge" ? (
          <CreateChallengeForm
            setModalVisible={postActions.setFormModalVisible}
            originalNoteId={post.id}
          />
        ) : (
          <CreateSubForm
            setModalVisible={postActions.setFormModalVisible}
            originalNoteId={post.id}
          />
        )}
      </RenderModal>
    </View>
  );

  return (
    <View style={styles.subCard}>
      {renderPostCard(originalPost, originalPostActions)}
      <Text style={styles.vsText}>Sub</Text>
      {renderPostCard(subPost, subPostActions)}
    </View>
  );
};

const styles = StyleSheet.create({
  subCard: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    borderColor: "#DCDCDC",
    borderRadius: 10,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  originalPostContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopColor: "#DCDCDC",
    borderTopWidth: 1,
  },
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
  userName: {
    color: "black",
    fontSize: 18,
    fontWeight: 'bold',
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
  separator: {
    height: 1,
    backgroundColor: "#DCDCDC",
    marginVertical: 1,
    marginHorizontal: 13,
  },
  vsText: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
  },
});

export default SubCard;
