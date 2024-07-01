import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
} from "react-native";

import { icons } from "../constants";

const FormField = ({
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
  const isPasswordField = title === "Password" || title === "Confirm Password";

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, otherStyles]}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.textInput, { height: height }]}
            value={value}
            textAlignVertical="top"
            placeholder={placeholder}
            placeholderTextColor="#7B7B8B"
            onChangeText={handleChangeText}
            secureTextEntry={isPasswordField && !showPassword}
            {...props}
            multiline={multiline} // Use the multiline prop
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
      </View>
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
});

export default FormField;
