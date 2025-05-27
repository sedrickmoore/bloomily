import { SafeAreaProvider } from "react-native-safe-area-context";
import { supabase } from "./lib/supabase";
import React from "react";
// import "react-native-gesture-handler";
import RootNavigation from "./src/navigation/RootNavigation";


export default function App() {
  return (
    <SafeAreaProvider>
      <RootNavigation />
    </SafeAreaProvider>
  );
}
