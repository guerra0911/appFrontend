import React from "react";
import { View, StyleSheet } from "react-native";
import PostCard from "./PostCard";

const SubCard = ({ sub, onLikeDislikeUpdate }) => {
  return (
    <View style={styles.subCard}>
      <PostCard
        profilePicture={sub.sub_note.author.profile.image}
        username={sub.sub_note.author.username}
        date={sub.sub_note.created_at}
        content={sub.sub_note.content}
        likes={sub.sub_note.likes}
        dislikes={sub.sub_note.dislikes}
        comments={sub.sub_note.comments}
        post={sub.sub_note}
        images={[sub.sub_note.image1, sub.sub_note.image2, sub.sub_note.image3]}
        onLikeDislikeUpdate={onLikeDislikeUpdate}
      />
      <View style={styles.originalPostContainer}>
        <PostCard
          profilePicture={sub.original_note.author.profile.image}
          username={sub.original_note.author.username}
          date={sub.original_note.created_at}
          content={sub.original_note.content}
          likes={sub.original_note.likes}
          dislikes={sub.original_note.dislikes}
          comments={sub.original_note.comments}
          post={sub.original_note}
          images={[sub.original_note.image1, sub.original_note.image2, sub.original_note.image3]}
          onLikeDislikeUpdate={onLikeDislikeUpdate}
        />
      </View>
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
});

export default SubCard;
