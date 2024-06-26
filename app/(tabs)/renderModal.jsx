import React from "react";
import { Modal, View, TouchableOpacity, StyleSheet, PanResponder } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const RenderModal = ({ modalVisible, setModalVisible, children }) => {
  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // If the user is swiping down
        return gestureState.dy > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        // You can implement visual feedback while swiping here if needed
      },
      onPanResponderRelease: (_, gestureState) => {
        // If the swipe was significant enough, close the modal
        if (gestureState.dy > 30) {
          setModalVisible(false);
        }
      },
    })
  ).current;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent} {...panResponder.panHandlers}>
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <AntDesign name="downcircle" size={24} color="#80FFDB" />
            </TouchableOpacity>
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "100%",
    height: "87%",
    backgroundColor: "#5E60CE",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  modalText: {
    fontFamily: "pmedium",
    color: "#D0D0D0",
  },
  // ... other styles
});

export default RenderModal;
