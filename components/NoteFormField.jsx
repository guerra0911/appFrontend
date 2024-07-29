import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  Animated,
} from "react-native";

import { icons } from "../constants";

const MAX_CHARACTERS = 230;
const NEW_LINE_PENALTY = 23;
const TAB_PENALTY = 8;

const NoteFormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  height = "auto",
  multiline = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [remainingCharacters, setRemainingCharacters] = useState(MAX_CHARACTERS);
  const isPasswordField = title === "Password" || title === "Confirm Password";
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const calculateRemainingCharacters = (text) => {
    const newLineCount = (text.match(/\n/g) || []).length;
    const tabCount = (text.match(/\t/g) || []).length;
    const effectiveLength = text.length + (newLineCount * NEW_LINE_PENALTY) + (tabCount * TAB_PENALTY);
    return MAX_CHARACTERS - effectiveLength;
  };

  useEffect(() => {
    setRemainingCharacters(calculateRemainingCharacters(value));
  }, [value]);

  const handleTextChange = (text) => {
    const remainingChars = calculateRemainingCharacters(text);
    if (remainingChars >= 0) {
      handleChangeText(text);
      setRemainingCharacters(remainingChars);
    } else {
      // Trigger the shake animation when the limit is reached
      Animated.sequence([
        Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true })
      ]).start();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Animated.View style={[styles.container, otherStyles, { transform: [{ translateX: shakeAnimation }] }]}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.textInput, { height: height }]}
            value={value}
            textAlignVertical="top"
            placeholder={placeholder}
            placeholderTextColor="#7B7B8B"
            onChangeText={handleTextChange}
            secureTextEntry={isPasswordField && !showPassword}
            {...props}
            multiline={multiline}
            maxLength={value.length + remainingCharacters}
          />

          {isPasswordField && (
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Image
                source={!showPassword ? icons.eyeHide : icons.eye}
                style={styles.icon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.charCount}>Characters left: {remainingCharacters}</Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    color: '#7B7B8B',
    marginBottom: 8,
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 16,
    backgroundColor: '#DCDCDC',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#DCDCDC',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    color: 'black',
    fontSize: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
  charCount: {
    marginTop: 4,
    fontSize: 12,
    color: '#7B7B8B',
  },
});

export default NoteFormField;
