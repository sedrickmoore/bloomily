import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, StyleSheet, Pressable, Text, Button } from "react-native";
import { supabase } from "../../lib/supabase";
import PlantScreen from "../screens/PlantScreen";
import HomeScreen from "../screens/HomeScreen";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

export default function UserTab({ route, navigation }) {
  return (
    <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: "#014421", // Dark green
        borderTopColor: "transparent",
      },
      tabBarActiveTintColor: "#FF6D89",
      tabBarInactiveTintColor: "#B8860B",
    }}
    initialRouteName="Home"
  >
     <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
            tabBarShowLabel: false,
          }}
      />
      <Tab.Screen
        name="Plants"
        component={PlantScreen}
        options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="rose" size={size} color={color} />
            ),
            tabBarShowLabel: false,
          }}
      />
     
    </Tab.Navigator>
  );
}
