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
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);


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
          multiline
          textAlignVertical="top"
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          style={{
            minHeight: 50,
            height: height,
            paddingTop: 10,
            paddingBottom: 10,
            textAlign: "left",
          }}
          {...props}
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
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
