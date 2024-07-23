import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
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

const ChallengeCard = ({ challenge, onLikeDislikeUpdate }) => {
  const originalPost = challenge.original_note;
  const challengerPost = challenge.challenger_note;

  const imagesOriginal = [
    originalPost.image1,
    originalPost.image2,
    originalPost.image3,
  ].filter(Boolean);
  const imagesChallenger = [
    challengerPost.image1,
    challengerPost.image2,
    challengerPost.image3,
  ].filter(Boolean);

  const navigation = useNavigation();
  const originalPostActions = usePostActions(originalPost, onLikeDislikeUpdate);
  const challengerPostActions = usePostActions(
    challengerPost,
    onLikeDislikeUpdate
  );

  const navigateToProfile = (userId) => {
    originalPostActions.setLikeDislikeModalVisible(false);
    originalPostActions.setFormModalVisible(false);
    challengerPostActions.setLikeDislikeModalVisible(false);
    challengerPostActions.setFormModalVisible(false);
    navigation.navigate("otherProfile", { userId });
  };

  return (
    <View style={styles.challengeCard}>
      <View style={styles.postContainer}>
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
            <ScrollView horizontal pagingEnabled style={styles.imageContainer}>
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
            {challengerPost.author.id !== challengerPostActions.user.id && (
              <>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={challengerPostActions.openChallengeForm}
                >
                  <Image source={{ uri: sword }} style={styles.iconButton} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={challengerPostActions.openSubForm}
                >
                  <Image source={{ uri: quote }} style={styles.iconButton} />
                </TouchableOpacity>
              </>
            )}
          </View>

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

        <View style={styles.divider}>
          <View style={styles.circle}>
            <Text style={styles.vsText}>VS.</Text>
          </View>
        </View>

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
            <ScrollView horizontal pagingEnabled style={styles.imageContainer}>
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
            {originalPost.author.id !== originalPostActions.user.id && (
              <>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={originalPostActions.openChallengeForm}
                >
                  <Image source={{ uri: sword }} style={styles.iconButton} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={originalPostActions.openSubForm}
                >
                  <Image source={{ uri: quote }} style={styles.iconButton} />
                </TouchableOpacity>
              </>
            )}
          </View>

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
    </View>
  );
};

const styles = StyleSheet.create({
  challengeCard: {
    width: "100%",
    padding: 0,
    marginBottom: 16,
  },
  postContainer: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderColor: "#DCDCDC",
    borderRadius: 10,
    borderWidth: 1,
    padding: 16,
    position: "relative",
  },
  postCard: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  profilePictureContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#69C3FF",
  },
  profilePicture: {
    width: "100%",
    height: "100%",
  },
  userInfo: {
    marginLeft: 8,
  },
  userName: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  date: {
    color: "#aaa",
    fontSize: 14,
  },
  content: {
    color: "black",
    fontSize: 16,
    marginBottom: 16,
  },
  imageContainer: {
    marginBottom: 16,
    height: 200,
  },
  image: {
    width: 300,
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
  separator: {
    height: 1,
    backgroundColor: "#DCDCDC",
    marginVertical: 1,
    marginHorizontal: 13,
  },
  divider: {
    width: 1,
    backgroundColor: "#DCDCDC",
    marginHorizontal: 20,
    position: "relative",
  },
  circle: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    borderWidth: 1,
    borderColor: "#DCDCDC",
    backgroundColor: "#F5F5F5",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -12.5 }, { translateY: -12.5 }],
    justifyContent: "center",
    alignItems: "center",
  },
  vsText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "black",
  },
  iconButton: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
});

export default ChallengeCard;
