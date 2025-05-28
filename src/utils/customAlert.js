// src/components/CustomAlert.js
import React from "react";
import { View, Text, Pressable, StyleSheet, Modal } from "react-native";
import { useFonts } from "expo-font";
import { RFValue } from "react-native-responsive-fontsize";

const CustomAlert = ({
  visible,
  title,
  message,
  onClose,
  buttonText = "OK",
}) => {
  const [fontsLoaded] = useFonts({
    PressStart2P: require("../../assets/fonts/PressStart2P-Regular.ttf"),
    Nunio: require("../../assets/fonts/Nunito-VariableFont_wght.ttf"),
    Quicksand: require("../../assets/fonts/Quicksand-VariableFont_wght.ttf"),
  });
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <Pressable onPress={onClose} style={styles.button}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    // backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    backgroundColor: "#6B8E23",
    padding: 24,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
  },
  title: {
    // fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "PressStart2P",
    fontSize: RFValue(24),
    textAlign: "center",
    color: "black",
  },
  message: {
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Quicksand",
    fontSize: RFValue(18),
    color: "black",
  },
  button: {
    backgroundColor: "#6B8E23",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: "black",
    fontFamily: "PressStart2P",
    textAlign: "center",
  },
});

export default CustomAlert;
