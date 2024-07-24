import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  UIManager,
  LayoutAnimation,
  Platform,
} from "react-native";
import ChallengeCard from "./ChallengeCard";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const screenWidth = Dimensions.get("window").width;

const ChallengeCardStacked = ({ challenge, onLikeDislikeUpdate }) => {
  const [flipped, setFlipped] = useState(false);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [challengerHeight, setChallengerHeight] = useState(0);
  const [minHeight, setMinHeight] = useState(0);
  const [measured, setMeasured] = useState(false);
  
  // Keep these states as requested
  const [frontCardHeight, setFrontCardHeight] = useState(0);
  const [showEntryCard, setShowEntryCard] = useState(false);
  const [showBackgroundCard, setShowBackgroundCard] = useState(true);

  const originalPost = challenge.original_note;
  const challengerPost = challenge.challenger_note;

  const translateX = useRef(new Animated.Value(0)).current;
  const translateXEntry = useRef(new Animated.Value(-screenWidth)).current;
  const translateYBack = useRef(new Animated.Value(10)).current;
  const translateXBack = useRef(new Animated.Value(-30)).current;

  const frontRotate = translateX.interpolate({
    inputRange: [-screenWidth, 0, screenWidth],
    outputRange: ["-10deg", "0deg", "10deg"],
    extrapolate: "clamp",
  });

  const frontOpacity = translateX.interpolate({
    inputRange: [-screenWidth, 0, screenWidth],
    outputRange: [0.8, 1, 0.8],
    extrapolate: "clamp",
  });

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: translateX }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, { dx }) => {
        if (Math.abs(dx) > screenWidth / 4) {
          Animated.parallel([
            Animated.timing(translateX, {
              toValue: dx > 0 ? screenWidth : -screenWidth,
              duration: 1000,
              useNativeDriver: false,
            }),
            Animated.timing(translateYBack, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: false,
            }),
            Animated.timing(translateXBack, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: false,
            }),
          ]).start(() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setFlipped((prevFlipped) => !prevFlipped);
            translateX.setValue(0);
            translateYBack.setValue(10);
            translateXBack.setValue(-30);

            setShowEntryCard(true);
            setShowBackgroundCard(false);
            translateXEntry.setValue(-screenWidth);
            Animated.timing(translateXEntry, {
              toValue: -30,
              duration: 1000,
              useNativeDriver: false,
            }).start(() => {
              setShowEntryCard(false);
              setShowBackgroundCard(true);
            });
          });
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (originalHeight > 0 && challengerHeight > 0) {
      const minHeight = Math.min(originalHeight, challengerHeight);
      setMinHeight(minHeight);
      setMeasured(true);
      console.log("Original Post Height:", originalHeight);
      console.log("Challenger Post Height:", challengerHeight);
      console.log("Minimum Height:", minHeight);
    }
  }, [originalHeight, challengerHeight]);
  
  const measureCardHeight = (event, type) => {
    const { height } = event.nativeEvent.layout;
    if (type === "original") {
      setOriginalHeight(height);
    } else {
      setChallengerHeight(height);
    }
  };

  if (!measured) {
    return (
      <View style={{ position: 'absolute', top: -9999 }}>
        <View onLayout={(event) => measureCardHeight(event, "original")}>
          <ChallengeCard post={originalPost} onLikeDislikeUpdate={onLikeDislikeUpdate} />
        </View>
        <View onLayout={(event) => measureCardHeight(event, "challenger")}>
          <ChallengeCard post={challengerPost} onLikeDislikeUpdate={onLikeDislikeUpdate} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.challengeCard, { height: frontCardHeight }]}>
      <View style={styles.cardsContainer}>
        {showEntryCard && (
          <Animated.View
            style={[
              styles.entryCard,
              {
                transform: [{ translateX: translateXEntry }],
                zIndex: 1,
              },
            ]}
          >
            <ChallengeCard post={flipped ? challengerPost : originalPost} height={minHeight}  defaultHeight={flipped ? challengerHeight : originalHeight}/>
          </Animated.View>
        )}
        {showBackgroundCard && (
          <Animated.View
            style={[
              styles.backgroundCard,
              {
                transform: [{ translateY: translateYBack }, { translateX: translateXBack }],
                zIndex: 0,
              },
            ]}
          >
            <ChallengeCard post={flipped ? challengerPost : originalPost} height={minHeight} defaultHeight={flipped ? challengerHeight : originalHeight}/>
          </Animated.View>
        )}
        <Animated.View
          style={[
            styles.postContainer,
            {
              transform: [{ translateX }, { rotate: frontRotate }],
              opacity: frontOpacity,
              zIndex: 2,
            },
          ]}
          onLayout={(event) => setFrontCardHeight(event.nativeEvent.layout.height)}
          {...panResponder.panHandlers}
        >
          {flipped ? (
            <ChallengeCard
              post={originalPost}
              onLikeDislikeUpdate={onLikeDislikeUpdate}
            />
          ) : (
            <ChallengeCard
              post={challengerPost}
              onLikeDislikeUpdate={onLikeDislikeUpdate}
            />
          )}
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  challengeCard: {
    width: "100%",
    marginBottom: 16,
    paddingLeft: 32,
  },
  cardsContainer: {
    position: "relative",
    width: "100%",
    paddingBottom: 20,
  },
  postContainer: {
    position: "absolute",
    borderRadius: 10,
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#F5F5F5",
    overflow: "hidden",
  },
  backgroundCard: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#F5F5F5",
    overflow: "hidden",
  },
  entryCard: {
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    backgroundColor: "#F5F5F5",
    overflow: "hidden",
  },
});

export default ChallengeCardStacked;
