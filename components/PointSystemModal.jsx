import React from "react";
import { Modal, View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const PointSystemModal = ({ modalVisible, setModalVisible, pointSystem }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPressOut={() => setModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <AntDesign name="downcircle" size={24} color="#69C3FF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>Point System</Text>
          <View style={styles.separator} />
          <View style={styles.pointSystem}>
            <View style={styles.pointRow}>
              <Text style={styles.roundText}>Round of 16</Text>
              <Text style={styles.pointsText}>+{pointSystem[0]}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.pointRow}>
              <Text style={styles.roundText}>Quarterfinals</Text>
              <Text style={styles.pointsText}>+{pointSystem[1]}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.pointRow}>
              <Text style={styles.roundText}>Semifinals</Text>
              <Text style={styles.pointsText}>+{pointSystem[2]}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.pointRow}>
              <Text style={[styles.roundText, styles.finalsText]}>Finals</Text>
              <Text style={[styles.pointsText, styles.goldText]}>+{pointSystem[3]}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.pointRow}>
              <Text style={styles.roundText}>Late Bracket</Text>
              <Text style={styles.uneligibleText}>Uneligible</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  modalContent: {
    width: "100%",
    height: "45%",
    backgroundColor: "#F5F5F5",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    color: "black",
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: 10,
    paddingLeft: 0,
  },
  separator: {
    height: 1,
    backgroundColor: "#DCDCDC",
    marginVertical: 10,
    marginHorizontal: 0,
  },
  pointSystem: {
    paddingLeft: 0,
  },
  pointRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  roundText: {
    color: "black",
    fontSize: 20,
  },
  pointsText: {
    color: "#A5DD9B",
    fontSize: 20,
  },
  finalsText: {
    color: "black",
  },
  goldText: {
    color: "#FFD700",
  },
  uneligibleText: {
    color: "#FF0000",
    fontSize: 20,
  },
});

export default PointSystemModal;
