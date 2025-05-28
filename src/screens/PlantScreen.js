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
  Pressable,
  Image,
  Platform,
  Modal,
} from "react-native";
import { ActivityIndicator } from "react-native";
import { setBackgroundColorAsync } from "expo-system-ui";
import { supabase } from "../../lib/supabase";
import { formatDate } from "../utils/formatDate";
import { RFValue } from "react-native-responsive-fontsize";
import Ionicons from "react-native-vector-icons/Ionicons";
import CustomAlert from "../utils/customAlert";

export default function PlantScreen() {
  const screenWidth = Dimensions.get("window").width;
  const imageSize = screenWidth * 0.5;

  const [fontsLoaded] = useFonts({
    PressStart2P: require("../../assets/fonts/PressStart2P-Regular.ttf"),
    Nunio: require("../../assets/fonts/Nunito-VariableFont_wght.ttf"),
    Quicksand: require("../../assets/fonts/Quicksand-VariableFont_wght.ttf"),
  });

  const [plants, setPlants] = useState([]);
  const [locations, setLocations] = useState([]);
  const [user, setUser] = useState([]);
  const [plantImages, setPlantImages] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);

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
    const fetchUser = async () => {
      const { data, error } = await supabase.from("users").select("*");

      if (error) {
        console.error("Error fetching user:", error.message);
      } else {
        setUser(data[0]);
      }
    };

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
    fetchUser();
    fetchPlants();
    fetchLocations();
  }, []);

  const getPlantImageUrl = (userId, plantId) => {
    const bucket = `plants-${userId}`;
    const url = `https://qoyfucmpjdwjoomqpbru.supabase.co/storage/v1/object/public/${bucket}/${plantId}.jpg`;

    return new Promise((resolve) => {
      Image.getSize(
        url,
        () => resolve(url), // image exists
        () => resolve(null) // image doesn't exist
      );
    });
  };

  useEffect(() => {
    if (!user || !user.id || plants.length === 0) return;
    const fetchImages = async () => {
      const imageMap = {};
      for (const plant of plants) {
        const url = await getPlantImageUrl(user.id, plant.id);
        if (url) {
          imageMap[plant.id] = url;
        }
      }
      console.log(imageMap);
      setPlantImages(imageMap);
    };

    fetchImages();
  }, [user, user.id, plants]);

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
            paddingVertical: "18%",
            alignItems: "center",
          }}
          data={plants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.card, { width: screenWidth }]}>
              <ScrollView
                style={[styles.card_text_box]}
                contentContainerStyle={{ flexGrow: 1 }}
              >
                <Pressable
                  onPress={() => {
                    setShowToolbar(!showToolbar);
                  }}
                  onLongPress={() => {
                    setMenuOpen(true);
                    console.log(
                      "Opening menu for " + item.plant_ref.common_name + "."
                    );
                  }}
                  style={({ pressed }) => [
                    {
                      paddingTop: 15,
                      alignItems: "center",
                      right: 17,
                      opacity: pressed ? 0.6 : 1,
                      alignSelf: "flex-end",
                    },
                  ]}
                >
                  <Ionicons name="menu" size={50} color={"#B8860B"}></Ionicons>
                </Pressable>
                {showToolbar && (
                  <View style={styles.toolbar}>
                    <Pressable
                      onPress={() => {
                        console.log(
                          item.plant_ref.common_name + " was watered!"
                        );
                      }}
                      style={({ pressed }) => [
                        {
                          backgroundColor: pressed ? "lightblue" : "#B8860B",
                          borderRadius: 15,
                          padding: 10,
                          alignItems: "center",
                          opacity: pressed ? 0.6 : 1,
                        },
                      ]}
                    >
                      <Ionicons
                        name="water"
                        size={25}
                        color={"blue"}
                      ></Ionicons>
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        console.log(
                          item.plant_ref.common_name + " was fertilized!"
                        );
                      }}
                      style={({ pressed }) => [
                        {
                          backgroundColor: pressed ? "#F4A460" : "#B8860B",
                          borderRadius: 15,
                          padding: 10,
                          alignItems: "center",
                          opacity: pressed ? 0.6 : 1,
                        },
                      ]}
                    >
                      <Ionicons
                        name="beaker"
                        size={25}
                        color={"brown"}
                      ></Ionicons>
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        console.log(
                          item.plant_ref.common_name + " was pruned!"
                        );
                      }}
                      style={({ pressed }) => [
                        {
                          backgroundColor: pressed ? "pink" : "#B8860B",
                          borderRadius: 15,
                          padding: 10,
                          alignItems: "center",
                          opacity: pressed ? 0.6 : 1,
                        },
                      ]}
                    >
                      <Ionicons
                        name="cut"
                        size={25}
                        color={"darkorchid"}
                        style={{ transform: [{ rotate: "90deg" }] }}
                      ></Ionicons>
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        console.log(
                          item.plant_ref.common_name + " was treated!"
                        );
                      }}
                      style={({ pressed }) => [
                        {
                          backgroundColor: pressed ? "tomato" : "#B8860B",
                          borderRadius: 15,
                          padding: 10,
                          alignItems: "center",
                          opacity: pressed ? 0.6 : 1,
                        },
                      ]}
                    >
                      <Ionicons
                        name="medkit"
                        size={25}
                        color={"darkred"}
                      ></Ionicons>
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        console.log(
                          item.plant_ref.common_name + " was repotted!"
                        );
                      }}
                      style={({ pressed }) => [
                        {
                          backgroundColor: pressed ? "#F4A460" : "#B8860B",
                          borderRadius: 15,
                          padding: 10,
                          alignItems: "center",
                          opacity: pressed ? 0.6 : 1,
                        },
                      ]}
                    >
                      <Ionicons
                        name="swap-vertical"
                        size={25}
                        color={"#8B4513"}
                      ></Ionicons>
                    </Pressable>
                  </View>
                )}
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                  }}
                >
                  <View style={styles.shadowWrapper}>
                    <Image
                      source={
                        plantImages[item.id] && plantImages[item.id].length > 0
                          ? { uri: plantImages[item.id] }
                          : require("../../assets/images/default-plant.png")
                      }
                      style={{
                        width: imageSize,
                        height: imageSize,
                        borderRadius: 15,
                        borderWidth: 2,
                        borderColor: "#B8860B",
                      }}
                    />
                  </View>

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
                </View>
              </ScrollView>
            </View>
          )}
        />
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={menuOpen}
        onRequestClose={() => {
          setMenuOpen(!menuOpen);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.title}>Menu</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setMenuOpen(!menuOpen);
              }}
            >
              <Text style={styles.body_text}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <CustomAlert
        visible={showAlert}
        title="Saving Plant"
        message="Your plant has been saved!"
        onClose={() => {
          setShowAlert(false);
        }}
      />
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
    height: "100%",
  },
  card_text_box: {
    backgroundColor: "#033500",
    width: "90%",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#B8860B",
  },
  shadowWrapper: {
    alignSelf: "center",
    marginBottom: 25,
    borderRadius: 15,
    ...Platform.select({
      ios: {
        shadowColor: "#B8860B",
        shadowOffset: { width: 10, height: 15 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        backgroundColor: "#014421", // or any solid color to make shadow show
      },
      android: {
        elevation: -26,
        backgroundColor: "#014421", // same as background so it looks seamless
      },
    }),
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,.9)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#014421",
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  toolbar: {
    alignItems: "center",
    zIndex: 100,
    justifyContent: "space-between",
    gap: 25,
    position: "absolute",
    top: 80,
    right: 20,
    flexDirection: "column",
    alignSelf: "flex-end",
  },
});
