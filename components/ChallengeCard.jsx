import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import RenderModal from "../app/(tabs)/renderModal";
import CreateChallengeForm from "./CreateChallengeForm";
import CreateSubForm from "./CreateSubForm";
import { formatDistanceToNow } from "date-fns";
import usePostActions from "../hooks/usePostActions";

const ChallengeCard = ({ challenge, onLikeDislikeUpdate }) => {
  const originalPost = challenge.original_note;
  const challengerPost = challenge.challenger_note;

  const imagesOriginal = [originalPost.image1, originalPost.image2, originalPost.image3].filter(Boolean);
  const imagesChallenger = [challengerPost.image1, challengerPost.image2, challengerPost.image3].filter(Boolean);

  const navigation = useNavigation();
  const originalPostActions = usePostActions(originalPost, onLikeDislikeUpdate);
  const challengerPostActions = usePostActions(challengerPost, onLikeDislikeUpdate);

  const navigateToProfile = (userId) => {
    originalPostActions.setLikeDislikeModalVisible(false);
    originalPostActions.setFormModalVisible(false);
    challengerPostActions.setLikeDislikeModalVisible(false);
    challengerPostActions.setFormModalVisible(false);
    navigation.navigate("otherProfile", { userId });
  };

  return (
    <View style={styles.challengeCard}>
      <View style={styles.postCard}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigateToProfile(challengerPost?.author?.id)}
            style={styles.profilePictureContainer}
          >
            <Image
              source={{ uri: challengerPost.author?.profile?.image }}
              style={styles.profilePicture}
              resizeMode="cover"
            />
          </TouchableOpacity>
          <View style={styles.userInfo}>
            <Text
              style={styles.userName}
              onPress={() => navigateToProfile(challengerPost?.author?.id)}
            >
              @{challengerPost.author?.username}
            </Text>
            <Text style={styles.date}>
              {formatDistanceToNow(new Date(challengerPost.created_at), {
                addSuffix: true,
              })}
            </Text>
          </View>
        </View>

        <Text style={styles.content}>{challengerPost.content}</Text>

        {imagesChallenger.length > 0 && (
          <ScrollView
            horizontal
            pagingEnabled
            style={styles.imageContainer}
          >
            {imagesChallenger.map((image, index) => (
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
          <TouchableOpacity style={styles.actionButton} onPress={challengerPostActions.handleLike}>
            <FontAwesome name="thumbs-up" size={18} color="#69C3FF" />
            <TouchableOpacity onPress={challengerPostActions.openLikedByModal}>
              <Text style={styles.actionText}>{challengerPostActions.likeCount}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={challengerPostActions.handleDislike}>
            <FontAwesome name="thumbs-down" size={18} color="#FF0000" />
            <TouchableOpacity onPress={challengerPostActions.openDislikedByModal}>
              <Text style={styles.actionText}>{challengerPostActions.dislikeCount}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <FontAwesome name="comment" size={18} color="black" />
            <Text style={styles.actionText}>{challengerPost.comments.length}</Text>
          </TouchableOpacity>
          {challengerPost.author.id !== challengerPostActions.user.id && (
            <>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={challengerPostActions.openChallengeForm}
              >
                <FontAwesome name="exchange" size={18} color="black" />
                <Text style={styles.actionText}>Challenge</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={challengerPostActions.openSubForm}
              >
                <FontAwesome name="subscript" size={18} color="black" />
                <Text style={styles.actionText}>Sub</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <RenderModal
          modalVisible={challengerPostActions.likeDislikeModalVisible}
          setModalVisible={challengerPostActions.setLikeDislikeModalVisible}
        >
          <Text style={styles.modalTitle}>{challengerPostActions.likeDislikeModalTitle}</Text>
          <ScrollView>
            {(challengerPostActions.likeDislikeModalTitle === "Liked By" ? challengerPostActions.likedBy : challengerPostActions.dislikedBy).map(
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
          modalVisible={challengerPostActions.formModalVisible}
          setModalVisible={challengerPostActions.setFormModalVisible}
        >
          {challengerPostActions.formType === "challenge" ? (
            <CreateChallengeForm
              setModalVisible={challengerPostActions.setFormModalVisible}
              originalNoteId={challengerPost.id}
            />
          ) : (
            <CreateSubForm
              setModalVisible={challengerPostActions.setFormModalVisible}
              originalNoteId={challengerPost.id}
            />
          )}
        </RenderModal>
      </View>

      <Text style={styles.vsText}>vs.</Text>

      <View style={styles.postCard}>
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
          <View style={styles.userInfo}>
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

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={originalPostActions.handleLike}>
            <FontAwesome name="thumbs-up" size={18} color="#69C3FF" />
            <TouchableOpacity onPress={originalPostActions.openLikedByModal}>
              <Text style={styles.actionText}>{originalPostActions.likeCount}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={originalPostActions.handleDislike}>
            <FontAwesome name="thumbs-down" size={18} color="#FF0000" />
            <TouchableOpacity onPress={originalPostActions.openDislikedByModal}>
              <Text style={styles.actionText}>{originalPostActions.dislikeCount}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <FontAwesome name="comment" size={18} color="black" />
            <Text style={styles.actionText}>{originalPost.comments.length}</Text>
          </TouchableOpacity>
          {originalPost.author.id !== originalPostActions.user.id && (
            <>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={originalPostActions.openChallengeForm}
              >
                <FontAwesome name="exchange" size={18} color="black" />
                <Text style={styles.actionText}>Challenge</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={originalPostActions.openSubForm}
              >
                <FontAwesome name="subscript" size={18} color="black" />
                <Text style={styles.actionText}>Sub</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <RenderModal
          modalVisible={originalPostActions.likeDislikeModalVisible}
          setModalVisible={originalPostActions.setLikeDislikeModalVisible}
        >
          <Text style={styles.modalTitle}>{originalPostActions.likeDislikeModalTitle}</Text>
          <ScrollView>
            {(originalPostActions.likeDislikeModalTitle === "Liked By" ? originalPostActions.likedBy : originalPostActions.dislikedBy).map(
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
          modalVisible={originalPostActions.formModalVisible}
          setModalVisible={originalPostActions.setFormModalVisible}
        >
          {originalPostActions.formType === "challenge" ? (
            <CreateChallengeForm
              setModalVisible={originalPostActions.setFormModalVisible}
              originalNoteId={originalPost.id}
            />
          ) : (
            <CreateSubForm
              setModalVisible={originalPostActions.setFormModalVisible}
              originalNoteId={originalPost.id}
            />
          )}
        </RenderModal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  challengeCard: {
    width: '100%',
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  postCard: {
    flex: 1,
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
  userInfo: {
    alignItems: 'center',
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
    marginHorizontal: 8,
  },
});

export default ChallengeCard;
