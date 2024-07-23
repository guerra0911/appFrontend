import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  UIManager,
  Platform,
} from "react-native";
import PostCard from "./PostCard";
import * as Animatable from 'react-native-animatable';
import { LayoutAnimation } from "react-native";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Define custom animations
const flipInY = {
  from: {
    rotateY: '90deg',
  },
  to: {
    rotateY: '0deg',
  },
};

const flipOutY = {
  from: {
    rotateY: '-90deg',
  },
  to: {
    rotateY: '0deg',
  },
};

const jitter = {
  0: {
    rotateY: '0deg',
  },
  0.2: {
    rotateY: '20deg',
  },
  0.4: {
    rotateY: '-20deg',
  },
  0.6: {
    rotateY: '20deg',
  },
  0.8: {
    rotateY: '-20deg',
  },
  1: {
    rotateY: '0deg',
  },
};

const ChallengeCardFlip = ({ challenge, onLikeDislikeUpdate }) => {
  const [flipped, setFlipped] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const flipAnimationRef = useRef(null);

  const originalPost = challenge.original_note;
  const challengerPost = challenge.challenger_note;

  const toggleFlip = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFlipped((prev) => !prev);
    setInteracted(true);

    // Reset animation
    if (flipAnimationRef.current) {
      flipAnimationRef.current.animate(flipped ? flipOutY : flipInY, 800);
    }
  };

  useEffect(() => {
    let jitterInterval;
    if (!interacted) {
      jitterInterval = setInterval(() => {
        if (flipAnimationRef.current) {
          flipAnimationRef.current.animate(jitter,1600);
        }
      }, 5000);
    }

    return () => {
      if (jitterInterval) {
        clearInterval(jitterInterval);
      }
    };
  }, [interacted]);

  useEffect(() => {
    if (!interacted && flipAnimationRef.current) {
      flipAnimationRef.current.animate(jitter, 1600);
    }
  }, []);

  return (
    <View style={styles.challengeCard}>
      <TouchableOpacity onPress={toggleFlip} activeOpacity={1}>
        <Animatable.View
          ref={flipAnimationRef}
          style={styles.postContainer}
          animation={flipped ? flipOutY : flipInY}
          duration={800}
        >
          {flipped ? (
            <PostCard post={originalPost} onLikeDislikeUpdate={onLikeDislikeUpdate} />
          ) : (
            <PostCard post={challengerPost} onLikeDislikeUpdate={onLikeDislikeUpdate} />
          )}
        </Animatable.View>
      </TouchableOpacity>
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
    backgroundColor: "#F5F5F5",
    overflow: "hidden",
  },
});

export default ChallengeCardFlip;