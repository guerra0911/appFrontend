import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Picks = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <Text className="text-2xl text-white font-psemibold px-4 my-6">Picks</Text>
    </SafeAreaView>
  );
};

export default Picks;
