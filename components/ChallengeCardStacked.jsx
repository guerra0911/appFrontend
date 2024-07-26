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
  const [frontCardHeight, setFrontCardHeight] = useState(0);
  const [showEntryCard, setShowEntryCard] = useState(false);
  const [showBackgroundCard, setShowBackgroundCard] = useState(true);
  const [dxValue, setDxValue] = useState(0);
  const [swipingHeight, setSwipingHeight] = useState(0);
  const [backCardHeight, setBackCardHeight] = useState(0);

  const originalPost = challenge.original_note;
  const challengerPost = challenge.challenger_note;
  const originalHeightRef = useRef(0);
  const challengerHeightRef = useRef(0);
  const flippedRef = useRef(flipped);
  const minHeightRef = useRef(minHeight);

  useEffect(() => {
    originalHeightRef.current = originalHeight;
  }, [originalHeight]);

  useEffect(() => {
    challengerHeightRef.current = challengerHeight;
  }, [challengerHeight]);

  useEffect(() => {
    flippedRef.current = flipped;
  }, [flipped]);

  useEffect(() => {
    minHeight.current = minHeight;
  }, [minHeight]);

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
      onPanResponderMove: (e, gestureState) => {
        // console.log("Current dx:", gestureState.dx);
        setDxValue(gestureState.dx);
        Animated.event([null, { dx: translateX }], {
          useNativeDriver: false,
        })(e, gestureState);
      },
      onPanResponderRelease: (e, { dx }) => {
        // console.log("PanResponder released with dx:", dx);
        if (Math.abs(dx) > screenWidth / 4) {
          // console.log("Swiping card off the screen");
          // console.log("Original Ref = ", originalHeightRef.current);
          // console.log("Challenger Ref = ",challengerHeightRef.current);
          // console.log("Flipped = ", flippedRef.current);
          //Start Back card to Grow as it moves into front card position
          if (flippedRef.current) {
            setBackCardHeight(challengerHeightRef.current);
          } else {
            setBackCardHeight(originalHeightRef.current);
          }

          if (flippedRef.current) {
            // console.log(
            //   "Setting Swipe Height to Challenger: ",
            //   challengerHeightRef.current
            // );
            setSwipingHeight(challengerHeightRef.current);
          } else {
            setSwipingHeight(originalHeightRef.current);
            // console.log(
            //   "Setting Swipe Height to Original: ",
            //   originalHeightRef.current
            // );
          }
          Animated.parallel([
            //Front Card Swiping off of Screen After Complete Swipe
            Animated.timing(translateX, {
              toValue: dx > 0 ? screenWidth + 175 : -screenWidth - 250,
              duration: 300,
              useNativeDriver: false,
            }),
            //Background Card Moving Up
            Animated.timing(translateYBack, {
              toValue: 0,
              duration: 300,
              useNativeDriver: false,
            }),
            //Background Card Moving Right
            Animated.timing(translateXBack, {
              toValue: 0,
              duration: 300,
              useNativeDriver: false,
            }),
          ]).start(() => {
            // console.log("Front card swipe animation completed");
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut
            );
            setFlipped((prevFlipped) => {
              // console.log("Flipping card:", !prevFlipped);
              return !prevFlipped;
            });

            translateX.setValue(0);
            translateYBack.setValue(10);
            translateXBack.setValue(-30);

            setShowEntryCard(true);
            setShowBackgroundCard(false);
            setBackCardHeight(minHeightRef.current);

            translateXEntry.setValue(-screenWidth);
            //Entry Card Swiping in
            Animated.timing(translateXEntry, {
              toValue: -30,
              duration: 300,
              useNativeDriver: false,
            }).start(() => {
              // console.log("Entry card animation completed");
              setShowEntryCard(false);
              setShowBackgroundCard(true);
            });
          });
        } else {
          if (flippedRef.current) {
            setSwipingHeight(originalHeightRef.current);
          } else {
            setSwipingHeight(challengerHeightRef.current);
          }
          // console.log("Swipe not significant, resetting front card position");
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: false,
          }).start(() => {
            // console.log("Front card reset animation completed");
          });
        }
      },
    })
  ).current;

  useEffect(() => {
    if (originalHeight > 0 && challengerHeight > 0) {
      const minHeight = Math.min(originalHeight, challengerHeight);
      setMinHeight(minHeight);
      setMeasured(true);
      // console.log(
      //   "Heights measured. Original:",
      //   originalHeight,
      //   "Challenger:",
      //   challengerHeight,
      //   "Minimum:",
      //   minHeight
      // );
    }
  }, [originalHeight, challengerHeight]);

  useEffect(() => {
    const calculateSwipingHeight = () => {
      // Your custom calculation using dxValue, originalHeight, challengerHeight, minHeight, frontCardHeight, and flipped
      const clampedDxValue = Math.max(
        Math.min(Math.abs(dxValue) / (screenWidth / 4), 1),
        -1
      );
      if (flipped) {
        const swipeHeight =
          originalHeight - (originalHeight - minHeight) * clampedDxValue;
        setSwipingHeight(swipeHeight);
      } else {
        const swipeHeight =
          challengerHeight - (challengerHeight - minHeight) * clampedDxValue;
        setSwipingHeight(swipeHeight);
      }
    };

    calculateSwipingHeight();
  }, [dxValue]);

  const startBackCardGrowth = () => {
    if (flippedRef.current) {
      setBackCardHeight(originalHeightRef.current);
    } else {
      setBackCardHeight(challengerHeightRef.current);
    }
  };

  const measureCardHeight = (event, type) => {
    const { height } = event.nativeEvent.layout;
    // console.log(`${type} card height measured:`, height);

    if (type === "original") {
      setOriginalHeight(height);
      // console.log("Content: ", originalPost.content);
    } else {
      setChallengerHeight(height);
      // console.log("Content: ", challengerPost.content);
    }
  };

  useEffect(() => {
    // console.log("swipingHeight changed:", swipingHeight);
  }, [swipingHeight]);

  if (!measured) {
    return (
      <View style={{ position: "absolute", top: -9999 }}>
        <View onLayout={(event) => measureCardHeight(event, "original")}>
          <ChallengeCard
            post={originalPost}
            onLikeDislikeUpdate={onLikeDislikeUpdate}
          />
        </View>
        <View onLayout={(event) => measureCardHeight(event, "challenger")}>
          <ChallengeCard
            post={challengerPost}
            onLikeDislikeUpdate={onLikeDislikeUpdate}
          />
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.challengeCard,
        { height: swipingHeight !== 0 ? swipingHeight : frontCardHeight },
      ]}
    >
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
            <ChallengeCard
              post={flipped ? challengerPost : originalPost}
              height={minHeight}
              defaultHeight={flipped ? challengerHeight : originalHeight}
            />
          </Animated.View>
        )}
        {showBackgroundCard && (
          <Animated.View
            style={[
              styles.backgroundCard,
              {
                transform: [
                  { translateY: translateYBack },
                  { translateX: translateXBack },
                ],
                zIndex: 0,
              },
            ]}
          >
            <ChallengeCard
              post={flipped ? challengerPost : originalPost}
              height={backCardHeight !== 0 ? backCardHeight : minHeight}
              defaultHeight={flipped ? challengerHeight : originalHeight}
            />
          </Animated.View>
        )}
        {flipped && (
          <Animated.View
            style={[
              styles.postContainer,
              {
                transform: [{ translateX }, { rotate: frontRotate }],
                opacity: frontOpacity,
                zIndex: 2,
              },
            ]}
            onLayout={(event) => {
              const height = event.nativeEvent.layout.height;
              setFrontCardHeight(height);
              // console.log("Front card height set:", height);
            }}
            {...panResponder.panHandlers}
          >
            <ChallengeCard
              post={originalPost}
              onLikeDislikeUpdate={onLikeDislikeUpdate}
              {...(swipingHeight !== 0 && { height: swipingHeight })}
            />
          </Animated.View>
        )}
        {!flipped && (
          <Animated.View
            style={[
              styles.postContainer,
              {
                transform: [{ translateX }, { rotate: frontRotate }],
                opacity: frontOpacity,
                zIndex: 2,
              },
            ]}
            onLayout={(event) => {
              const height = event.nativeEvent.layout.height;
              setFrontCardHeight(height);
              // console.log("Front card height set:", height);
            }}
            {...panResponder.panHandlers}
          >
            <ChallengeCard
              post={challengerPost}
              onLikeDislikeUpdate={onLikeDislikeUpdate}
              {...(swipingHeight !== 0 && { height: swipingHeight })}
            />
          </Animated.View>
        )}
        {/* <Animated.View
          style={[
            styles.postContainer,
            {
              transform: [{ translateX }, { rotate: frontRotate }],
              opacity: frontOpacity,
              zIndex: 2,
            },
          ]}
          onLayout={(event) => {
            const height = event.nativeEvent.layout.height;
            setFrontCardHeight(height);
            // console.log("Front card height set:", height);
          }}
          {...panResponder.panHandlers}
        >
          {flipped ? (
            <ChallengeCard
              post={originalPost}
              onLikeDislikeUpdate={onLikeDislikeUpdate}
              // {...(swipingHeight !== 0 && { height: swipingHeight })}
            />
          ) : (
            <ChallengeCard
              post={challengerPost}
              onLikeDislikeUpdate={onLikeDislikeUpdate}
              // {...(swipingHeight !== 0 && { height: swipingHeight })}
            />
          )}
        </Animated.View> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  challengeCard: {
    width: "100%",
    marginBottom: 24,
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
