import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import { icons } from "../constants";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  height = "auto",
  multiline = false, // Add multiline prop with a default value
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = title === "Password" || title === "Confirm Password";

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className={`space-y-2 ${otherStyles}`}>
        <Text className="text-base text-gray-100 font-pmedium">{title}</Text>

        <View
          className={`w-full px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary flex flex-row items-center`}
        >
          <TextInput
            className="flex-1 text-white font-psemibold text-base"
            value={value}
            textAlignVertical="top"
            placeholder={placeholder}
            placeholderTextColor="#7B7B8B"
            onChangeText={handleChangeText}
            secureTextEntry={isPasswordField && !showPassword}
            style={{
              minHeight: 50,
              height: height,
              paddingTop: 10,
              paddingBottom: 10,
              textAlign: "left",
            }}
            {...props}
            multiline={multiline} // Use the multiline prop
          />

          {isPasswordField && (
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Image
                source={!showPassword ? icons.eyeHide : icons.eye}
                className="w-6 h-6"
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default FormField;
