import React, { useState, useEffect, useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import HomePage from "../components/homepage.js";
import DiscoverPage from "../components/discover/DiscoverPage.js";
import ProfilePage from "../components/profile/ProfilePage.js";
import UserPage from "./profile/UserPage.js";
import { View } from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";

const loadFonts = async () => {
  await Font.loadAsync({
    FontAwesome: require("@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/FontAwesome.ttf"),
    MaterialCommunityIcons: require("@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf"),
  });
};

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const DiscoverStack = createStackNavigator();

const DiscoverStackScreen = () => (
  <DiscoverStack.Navigator screenOptions={{ headerShown: false }}>
    <DiscoverStack.Screen name="DiscoverPage" component={DiscoverPage} />
    <DiscoverStack.Screen name="UserPage" component={UserPage} />
  </DiscoverStack.Navigator>
);

const Tabs = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    SplashScreen.preventAutoHideAsync().catch((error) => console.warn(error));
    loadFonts()
      .then(() => {
        setIsReady(true);
        SplashScreen.hideAsync().catch((error) => console.warn(error));
      })
      .catch((error) => console.warn(error));
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TabNavigator">
        {() => (
          <Tab.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: "#010312",
                borderBottomWidth: 2,
                borderBottomColor: "#6abdff",
              },
              headerTintColor: "#FFF",
              tabBarStyle: {
                height: 80,
                backgroundColor: "#010312",
                paddingTop: 12,
                borderTopWidth: 2,
                borderTopColor: "#ff0000",
                position: "absolute",
                overflow: "hidden",
              },
              tabBarActiveTintColor: "#ff0000",
              tabBarInactiveTintColor: "#6abdff",
              headerShown: false,
            }}
          >
            <Tab.Screen
              name="Homepage"
              component={HomePage}
              options={{
                tabBarIcon: ({ focused }) => (
                  <View
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <FontAwesome
                      name="home"
                      size={24}
                      color={focused ? "#ff0000" : "#6abdff"}
                    />
                  </View>
                ),
                headerShown: false,
              }}
            />
            <Tab.Screen
              name="Discover"
              component={DiscoverStackScreen}
              options={{
                tabBarIcon: ({ focused }) => (
                  <View
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <FontAwesome
                      name="search"
                      size={24}
                      color={focused ? "#ff0000" : "#6abdff"}
                    />
                  </View>
                ),
                headerShown: false,
              }}
            />
            <Tab.Screen
              name="Profile"
              component={ProfilePage}
              options={{
                tabBarIcon: ({ focused }) => (
                  <View
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <MaterialCommunityIcons
                      name="account"
                      size={24}
                      color={focused ? "#ff0000" : "#6abdff"}
                    />
                  </View>
                ),
                headerShown: false,
              }}
            />
          </Tab.Navigator>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default Tabs;
