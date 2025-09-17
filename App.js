import "react-native-gesture-handler";
import 'react-native-reanimated';
import "./global.css";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Platform, View } from "react-native";
import RootNavigation from "./navigation";

export default function App() {
  return (
    <View className="flex-1 bg-slate-100">
      <SafeAreaView className="flex-1">
        <RootNavigation />
         <StatusBar 
          style="light" 
          backgroundColor={Platform.OS === 'android' ? '#667eea' : 'transparent'}
          translucent={Platform.OS === 'android' ? false : true}
        />
      </SafeAreaView>
    </View>
  );
}
