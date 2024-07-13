import React from "react";
import { View, Text, StyleSheet } from "react-native";
import PostCard from "./PostCard";

const ChallengeCard = ({ challenge, onLikeDislikeUpdate }) => {
  const originalNote = challenge.original_note;
  const challengerNote = challenge.challenger_note;

  return (
    <View style={styles.challengeCard}>
      <View style={styles.postContainer}>
        {originalNote && (
          <PostCard
            profilePicture={originalNote.author?.profile?.image}
            username={originalNote.author?.username}
            date={originalNote.created_at}
            content={originalNote.content}
            likes={originalNote.likes}
            dislikes={originalNote.dislikes}
            comments={originalNote.comments}
            post={originalNote}
            images={[originalNote.image1, originalNote.image2, originalNote.image3]}
            onLikeDislikeUpdate={onLikeDislikeUpdate}
          />
        )}
      </View>
      <Text style={styles.vsText}>vs.</Text>
      <View style={styles.postContainer}>
        {challengerNote && (
          <PostCard
            profilePicture={challengerNote.author?.profile?.image}
            username={challengerNote.author?.username}
            date={challengerNote.created_at}
            content={challengerNote.content}
            likes={challengerNote.likes}
            dislikes={challengerNote.dislikes}
            comments={challengerNote.comments}
            post={challengerNote}
            images={[challengerNote.image1, challengerNote.image2, challengerNote.image3]}
            onLikeDislikeUpdate={onLikeDislikeUpdate}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  challengeCard: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    borderColor: "#DCDCDC",
    borderRadius: 10,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  postContainer: {
    flex: 1,
  },
  vsText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
});

export default ChallengeCard;
