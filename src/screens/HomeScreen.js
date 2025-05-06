import { useFonts } from "expo-font";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  SafeAreaView,
  SafeAreaProvider,
  SafeAreaInsetsContext,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Audio } from "expo-av";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { ActivityIndicator } from "react-native";
import { setBackgroundColorAsync } from "expo-system-ui";
import { supabase } from "../../lib/supabase";
import { formatDate } from "../utils/formatDate";
import { RFValue } from "react-native-responsive-fontsize";

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    PressStart2P: require("../../assets/fonts/PressStart2P-Regular.ttf"),
    Nunio: require("../../assets/fonts/Nunito-VariableFont_wght.ttf"),
    Quicksand: require("../../assets/fonts/Quicksand-VariableFont_wght.ttf"),
  });

  const [plants, setPlants] = useState([]);
  const [locations, setLocations] = useState([]);
  const [user, setUser] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.from("users").select("*");

      if (error) {
        console.error("Error fetching user:", error.message);
      } else {
        setUser(data[0]);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    setBackgroundColorAsync("#014421");
  }, []);

  if (!user.username || !fontsLoaded) {
    return (
      <View style={[styles.container, { backgroundColor: "#014421" }]}>
        <ActivityIndicator size="large" color="#B8860B" />
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Hello, {user.username}!</Text>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#014421",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "PressStart2P",
    fontSize: RFValue(24),
    textAlign: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    color: "#B8860B",
  },

  body_text: {
    fontFamily: "Quicksand",
    fontSize: 13,
    textAlign: "left",
    paddingHorizontal: 20,
    color: "#DAA520",
  },
  card: {
    backgroundColor: "#033500",
    padding: 16,
    alignSelf: "center",
    marginVertical: 8,
    borderRadius: 8,
    width: 300,
    shadowColor: "#154406",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
});
