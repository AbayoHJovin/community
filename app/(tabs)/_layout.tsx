import { Tabs } from "expo-router";
import { Platform, Text, View } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: () => (
          <View style={{ flex: 1, backgroundColor: "white" }} />
        ),
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            paddingBottom: 15,
            paddingTop: 10,
            height: 70, // Increase overall height if needed
            backgroundColor: "white",
          },
          android: {
            position: "absolute",
            paddingBottom: 15,
            paddingTop: 10,
            height: 70, // Increase overall height if needed
            backgroundColor: "white",
          },
          default: {
            position: "absolute",
            paddingBottom: 15,
            paddingTop: 10,
            height: 70, // Increase overall height if needed
            backgroundColor: "white",
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: "#25B14C",
                opacity: focused ? 1 : 0.4,
              }}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? "#25B14C" : "gray",
                fontSize: 12,
                marginTop: 4,
              }}
            >
              Home
            </Text>
          ),
        }}
      />

      <Tabs.Screen
        name="complaints"
        options={{
          title: "Complaints",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: "#25B14C",
                opacity: focused ? 1 : 0.4,
              }}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? "#25B14C" : "gray",
                fontSize: 12,
                marginTop: 4,
              }}
            >
              Complaints
            </Text>
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: "#25B14C",
                opacity: focused ? 1 : 0.4,
              }}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? "#25B14C" : "gray",
                fontSize: 12,
                marginTop: 4,
              }}
            >
              Search
            </Text>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: "#25B14C",
                opacity: focused ? 1 : 0.4,
              }}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? "#25B14C" : "gray",
                fontSize: 12,
                marginTop: 4,
              }}
            >
              Profile
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}

export default TabLayout;
