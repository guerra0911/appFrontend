import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import RenderModal from "../app/(tabs)/renderModal";
import CreateChallengeForm from "./CreateChallengeForm";
import CreateSubForm from "./CreateSubForm";
import { formatDistanceToNow } from "date-fns";
import usePostActions from "../hooks/usePostActions";

const sword =
  "https://nickguerrabucket.s3.us-east-2.amazonaws.com/admin/sword.png";
const quote =
  "https://nickguerrabucket.s3.us-east-2.amazonaws.com/admin/quote.png";

const SubCard = ({ sub, onLikeDislikeUpdate }) => {
  const originalPost = sub.original_note;
  const subPost = sub.sub_note;

  const imagesOriginal = [originalPost.image1, originalPost.image2, originalPost.image3].filter(Boolean);
  const imagesSub = [subPost.image1, subPost.image2, subPost.image3].filter(Boolean);

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

  return (
    <View style={styles.postCard}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigateToProfile(subPost?.author?.id)}
          style={styles.profilePictureContainer}
        >
          <Image
            source={{ uri: subPost.author?.profile?.image }}
            style={styles.profilePicture}
            resizeMode="cover"
          />
        </TouchableOpacity>
        <View>
          <Text
            style={styles.userName}
            onPress={() => navigateToProfile(subPost?.author?.id)}
          >
            @{subPost.author?.username}
          </Text>
          <Text style={styles.date}>
            {formatDistanceToNow(new Date(subPost.created_at), {
              addSuffix: true,
            })}
          </Text>
        </View>
      </View>

      <Text style={styles.content}>{subPost.content}</Text>

      {imagesSub.length > 0 && (
        <ScrollView
          horizontal
          pagingEnabled
          style={styles.imageContainer}
        >
          {imagesSub.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={styles.image}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      )}

      <View style={styles.originalPostContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigateToProfile(originalPost?.author?.id)}
            style={styles.profilePictureContainer}
          >
            <Image
              source={{ uri: originalPost.author?.profile?.image }}
              style={styles.profilePicture}
              resizeMode="cover"
            />
          </TouchableOpacity>
          <View>
            <Text
              style={styles.userName}
              onPress={() => navigateToProfile(originalPost?.author?.id)}
            >
              @{originalPost.author?.username}
            </Text>
            <Text style={styles.date}>
              {formatDistanceToNow(new Date(originalPost.created_at), {
                addSuffix: true,
              })}
            </Text>
          </View>
        </View>

        <Text style={styles.content}>{originalPost.content}</Text>

        {imagesOriginal.length > 0 && (
        <ScrollView
          horizontal
          pagingEnabled
          style={styles.imageContainer}
        >
          {imagesOriginal.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={styles.image}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={subPostActions.handleLike}>
          <FontAwesome name="thumbs-up" size={18} color="#69C3FF" />
          <TouchableOpacity onPress={subPostActions.openLikedByModal}>
            <Text style={styles.actionText}>{subPostActions.likeCount}</Text>
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={subPostActions.handleDislike}>
          <FontAwesome name="thumbs-down" size={18} color="#FF0000" />
          <TouchableOpacity onPress={subPostActions.openDislikedByModal}>
            <Text style={styles.actionText}>{subPostActions.dislikeCount}</Text>
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome name="comment" size={18} color="black" />
          <Text style={styles.actionText}>{subPost.comments.length}</Text>
        </TouchableOpacity>
        {subPost.author.id !== subPostActions.user.id && (
          <>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={subPostActions.openChallengeForm}
            >
              <Image source={{ uri: sword }} style={styles.iconButton} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={subPostActions.openSubForm}
            >
              <Image source={{ uri: quote }} style={styles.iconButton} />
            </TouchableOpacity>
          </>
        )}
      </View>

      <RenderModal
        modalVisible={subPostActions.likeDislikeModalVisible}
        setModalVisible={subPostActions.setLikeDislikeModalVisible}
      >
        <Text style={styles.modalTitle}>{subPostActions.likeDislikeModalTitle}</Text>
        <ScrollView>
          {(subPostActions.likeDislikeModalTitle === "Liked By" ? subPostActions.likedBy : subPostActions.dislikedBy).map(
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
        modalVisible={subPostActions.formModalVisible}
        setModalVisible={subPostActions.setFormModalVisible}
      >
        {subPostActions.formType === "challenge" ? (
          <CreateChallengeForm
            setModalVisible={subPostActions.setFormModalVisible}
            originalNoteId={subPost.id}
          />
        ) : (
          <CreateSubForm
            setModalVisible={subPostActions.setFormModalVisible}
            originalNoteId={subPost.id}
          />
        )}
      </RenderModal>
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
  originalPostContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#E8E8E8',  // Slightly different background color for visual distinction
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
  iconButton: {
    width: 24,
    height: 24,
    marginRight: 8,
  }
});

export default SubCard;
