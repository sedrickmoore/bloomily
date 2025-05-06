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
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView,
  Dimensions,
} from "react-native";
import { ActivityIndicator } from "react-native";
import { setBackgroundColorAsync } from "expo-system-ui";
import { supabase } from "../../lib/supabase";
import { formatDate } from "../utils/formatDate";
import { RFValue } from "react-native-responsive-fontsize";

export default function PlantScreen() {
  const screenWidth = Dimensions.get("window").width;

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
    setBackgroundColorAsync("#014421");
  }, []);

  if (!fontsLoaded || !plants) {
    return (
      <View style={[styles.container, { backgroundColor: "#014421" }]}>
        <ActivityIndicator size="large" color="#B8860B" />
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Plants</Text>
      <View style={{ height: "100%", width: "100%" }}>
        <FlatList
          horizontal
          pagingEnabled
          snapToInterval={screenWidth}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingVertical: "50%",
            // paddingLeft: "10%",
            alignItems: "center",
            // gap: "5%",
          }}
          data={plants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.card, { width: screenWidth,}]}>
              <ScrollView style={styles.card_text_box}>
                <Text style={styles.body_text}>
                  <Text style={{ fontWeight: "bold", color: "#B8860B" }}>
                    Name:
                  </Text>{" "}
                  {item.nickname || item.plant_ref.common_name}
                </Text>
                <Text style={styles.body_text}>
                  <Text style={{ fontWeight: "bold", color: "#B8860B" }}>
                    Scientific Name:
                  </Text>{" "}
                  {item.plant_ref.scientific_name}
                </Text>
                <Text style={styles.body_text}>
                  <Text style={{ fontWeight: "bold", color: "#B8860B" }}>
                    Plant Type:
                  </Text>{" "}
                  {item.plant_ref.plant_type}
                </Text>
                <Text style={styles.body_text}>
                  <Text style={{ fontWeight: "bold", color: "#B8860B" }}>
                    Location:
                  </Text>{" "}
                  {locationsMap.get(item.location_id)}
                </Text>
                <Text style={styles.body_text}>
                  <Text style={{ fontWeight: "bold", color: "#B8860B" }}>
                    Last watered:
                  </Text>{" "}
                  {item.last_watered ? formatDate(item.last_watered) : "N/A"}
                </Text>
                <Text style={styles.body_text}>
                  <Text style={{ fontWeight: "bold", color: "#B8860B" }}>
                    Watering Flag:
                  </Text>{" "}
                  {item.watering_flag}
                </Text>
              </ScrollView>
              
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
    backgroundColor: "#014421",
    alignItems: "center",
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
    fontSize: RFValue(13),
    textAlign: "left",
    paddingHorizontal: 20,
    color: "#DAA520",
  },
  card: {
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#154406",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  card_text_box: {
    backgroundColor: "#033500",
    width: "90%",
    borderRadius: 8,
  }
});
