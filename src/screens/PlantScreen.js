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

export default function PlantScreen() {
  const [fontsLoaded] = useFonts({
    PressStart2P: require("../../assets/fonts/PressStart2P-Regular.ttf"),
    Nunio: require("../../assets/fonts/Nunito-VariableFont_wght.ttf"),
    Quicksand: require("../../assets/fonts/Quicksand-VariableFont_wght.ttf"),
  });

  const [plants, setPlants] = useState([]);
  const [locations, setLocations] = useState([]);

  // const sound = useRef();

  // useEffect(() => {
  //   const playMusic = async () => {
  //     const { sound: playbackObj } = await Audio.Sound.createAsync(
  //       require("./assets/audio/music/temp_theme.mp3"),
  //       { shouldPlay: true, isLooping: true }
  //     );
  //     sound.current = playbackObj;
  //     await sound.current.playAsync();
  //   };

  //   playMusic();

  //   return () => {
  //     if (sound.current) {
  //       sound.current.unloadAsync();
  //     }
  //   };
  // }, []);

  useEffect(() => {
    const fetchPlants = async () => {
      const { data, error } = await supabase
        .from("plants")
        .select("*, plant_ref:ref_id(*)");

      if (error) {
        console.error("Error fetching plants:", error.message);
      } else {
        setPlants(data);
      }
    };

    const fetchLocations = async () => {
      const { data, error } = await supabase.from("locations").select("*");

      if (error) {
        console.error("Error fetching locations:", error.message);
      } else {
        setLocations(data);
      }
    };

    fetchPlants();
    fetchLocations();
  }, []);

  const locationsMap = useMemo(() => {
    const map = new Map();
    for (const location of locations) {
      map.set(location.id, location.name);
    }
    return map;
  }, [locations]);

  useEffect(() => {
    setBackgroundColorAsync("lightgreen");
  }, []);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome to Bloomily!</Text>
      <View style={{ height: "100%" }}>
        <FlatList
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          data={plants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.body_text}>
                <Text style={{ fontWeight: "bold", color: "#FF6D89" }}>
                  Name:
                </Text>{" "}
                {item.nickname || item.plant_ref.common_name}
              </Text>
              <Text style={styles.body_text}>
                <Text style={{ fontWeight: "bold", color: "#FF6D89" }}>
                  Scientific Name:
                </Text>{" "}
                {item.plant_ref.scientific_name}
              </Text>
              <Text style={styles.body_text}>
                <Text style={{ fontWeight: "bold", color: "#FF6D89" }}>
                  Plant Type:
                </Text>{" "}
                {item.plant_ref.plant_type}
              </Text>
              <Text style={styles.body_text}>
                <Text style={{ fontWeight: "bold", color: "#FF6D89" }}>
                  Location:
                </Text>{" "}
                {locationsMap.get(item.location_id)}
              </Text>
              <Text style={styles.body_text}>
                <Text style={{ fontWeight: "bold", color: "#FF6D89" }}>
                  Last watered:
                </Text>{" "}
                {item.last_watered ? formatDate(item.last_watered) : "N/A"}
              </Text>
              <Text style={styles.body_text}>
                <Text style={{ fontWeight: "bold", color: "#FF6D89" }}>
                  Watering Flag:
                </Text>{" "}
                {item.watering_flag}
              </Text>
            </View>
          )}
        />
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgreen",
    alignItems: "center",
  },
  title: {
    fontFamily: "PressStart2P",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    color: "#FF6D89",
  },

  body_text: {
    fontFamily: "Quicksand",
    fontSize: 13,
    textAlign: "left",
    paddingHorizontal: 20,
    color: "#ADFF2F",
  },
  card: {
    backgroundColor: "#2E8B57",
    padding: 16,
    alignSelf: "center",
    marginVertical: 8,
    borderRadius: 8,
    width: 300,
    shadowColor: "#00FF7F",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
});
