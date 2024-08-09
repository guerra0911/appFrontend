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
import ChallengeFooter from "./ChallengeFooter";
import { useGlobalContext } from "../context/GlobalProvider";
import Loader from "./Loader";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const screenWidth = Dimensions.get("window").width;

const ChallengeCardStacked = ({ challenge, onLikeDislikeUpdate, isRequestView = false, setScrollEnabled = () => {}, buttonTypes = [], onMeasurement}) => {
  const { updatePickStatus, pickStatus, pickCounts } = useGlobalContext();
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
  const [isLoading, setIsLoading] = useState(true);


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
    minHeightRef.current = minHeight;
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
      onMoveShouldSetPanResponder: (e, gestureState) => {
        if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
          setScrollEnabled(false); // Disable vertical scroll on horizontal swipe
          return true;
        }
        setScrollEnabled(true); // Enable vertical scroll otherwise
        return false;
      },
      onPanResponderMove: (e, gestureState) => {
        setDxValue(gestureState.dx);
        Animated.event([null, { dx: translateX }], {
          useNativeDriver: false,
        })(e, gestureState);
      },
      onPanResponderRelease: (e, { dx }) => {
        setScrollEnabled(true); // Re-enable vertical scroll after swipe
        if (Math.abs(dx) > screenWidth / 4) {
          // If successful swipe, start growing Background card into size of the New Front Card
          if (flippedRef.current) {
            setBackCardHeight(challengerHeightRef.current);
          } else {
            setBackCardHeight(originalHeightRef.current);
          }

          // If Successful Swipe, Set Card to height of Next Card to Show up
          if (flippedRef.current) {
            setSwipingHeight(challengerHeightRef.current);
          } else {
            setSwipingHeight(originalHeightRef.current);
          }
          Animated.parallel([
            // Front Card Swiping off of Screen After Complete Swipe
            Animated.timing(translateX, {
              toValue: dx > 0 ? screenWidth + 175 : -screenWidth - 250,
              duration: 300,
              useNativeDriver: false,
            }),
            // Background Card Moving Up
            Animated.timing(translateYBack, {
              toValue: 0,
              duration: 300,
              useNativeDriver: false,
            }),
            // Background Card Moving Right
            Animated.timing(translateXBack, {
              toValue: 0,
              duration: 300,
              useNativeDriver: false,
            }),
          ]).start(() => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut
            );
            setFlipped((prevFlipped) => {
              return !prevFlipped;
            });

            translateX.setValue(0);
            translateYBack.setValue(10);
            translateXBack.setValue(-30);

            setShowEntryCard(true);
            setShowBackgroundCard(false);
            setBackCardHeight(minHeightRef.current);

            translateXEntry.setValue(-screenWidth);
            Animated.timing(translateXEntry, {
              toValue: -30,
              duration: 300,
              useNativeDriver: false,
            }).start(() => {
              setShowEntryCard(false);
              setShowBackgroundCard(true);
            });
          });
        } else {
          // If Unsuccessful Swipe, just revert back to original size
          if (flippedRef.current) {
            setSwipingHeight(originalHeightRef.current);
          } else {
            setSwipingHeight(challengerHeightRef.current);
          }
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: false,
          }).start(() => {
          });
        }
      },
    })
  ).current;

  // Set the Minimum Height for the Entry and Background Card on Loadup
  useEffect(() => {
    if (originalHeight > 0 && challengerHeight > 0) {
      const minHeight = Math.min(originalHeight, challengerHeight);
      setMinHeight(minHeight);
      setMeasured(true);
      onMeasurement();
    }
    setIsLoading(false);
  }, [originalHeight, challengerHeight]);


  // As the user swipes away, decrease card height to minimum height in real time
  useEffect(() => {
    const calculateSwipingHeight = () => {
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

  // Render and Measure cards off screen on loadup to get Default height values
  const measureCardHeight = (event, type) => {
    const { height } = event.nativeEvent.layout;
    if (type === "original") {
      setOriginalHeight(height);
    } else {
      setChallengerHeight(height);
    }
  };

  // Allow users to pick which post is the winner
  const handlePickUpdate = async (pickType) => {
    if (isRequestView) {
      return;
    }
    try {
      await updatePickStatus(challenge.id, pickType); // Update the pick status and counts in the global state
    } catch (error) {
      console.error("Error updating pick", error);
    }
  };

  if (isLoading) {
    return (
      <Loader isLoading={isLoading}/>
    );
  }

  if (!measured) {
    return (
      <View>
        <View onLayout={(event) => measureCardHeight(event, "original")}>
          <ChallengeCard
            post={originalPost}
            onLikeDislikeUpdate={onLikeDislikeUpdate}
            isRequestView={isRequestView}
          />
        </View>
        <View onLayout={(event) => measureCardHeight(event, "challenger")}>
          <ChallengeCard
            post={challengerPost}
            onLikeDislikeUpdate={onLikeDislikeUpdate}
            isRequestView={isRequestView}
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
              handlePickUpdate={handlePickUpdate}
              isRequestView={isRequestView}
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
              handlePickUpdate={handlePickUpdate}
              isRequestView={isRequestView}
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
            }}
            {...panResponder.panHandlers}
          >
            <ChallengeCard
              post={originalPost}
              onLikeDislikeUpdate={onLikeDislikeUpdate}
              {...(swipingHeight !== 0 && { height: swipingHeight })}
              handlePickUpdate={handlePickUpdate}
              isRequestView={isRequestView}
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
            }}
            {...panResponder.panHandlers}
          >
            <ChallengeCard
              post={challengerPost}
              onLikeDislikeUpdate={onLikeDislikeUpdate}
              {...(swipingHeight !== 0 && { height: swipingHeight })}
              handlePickUpdate={handlePickUpdate}
              isRequestView={isRequestView}
            />
          </Animated.View>
        )}
      </View>

      <ChallengeFooter
        hasCurrentUserSelectedWinner={pickStatus[challenge.id]}
        originalPost={originalPost}
        challengerPost={challengerPost}
        originalPicks={pickCounts[challenge.id]?.originalPicks || 0}
        challengerPicks={pickCounts[challenge.id]?.challengerPicks || 0}
        isRequestView={isRequestView}
        challengeId={challenge.id}
        buttonTypes={buttonTypes}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  challengeCard: {
    width: "100%",
    marginBottom: 36,
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
