import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { Platform, Image } from "react-native";

// Import screens
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import SignupScreen from "../screens/SignupScreen";
import ExploreScreen from "../screens/ExploreScreen";
import BrowseScreen from "../screens/BrowseScreen";
import ProductsScreen from "../screens/ProductsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import BrowseTabScreen from "../screens/BrowseTabScreen";
import GardenDesignScreen from "../screens/GardenDesignScreen";

import { theme } from "../constants";
import GardenDesignCanvas from "../screens/GardenDesignCanvas";
import ARView from "../components/ARView";

// Create the Stack Navigator
const Stack = createStackNavigator();

console.log("AppNavigator loaded");
console.log(WelcomeScreen, LoginScreen, ForgotPasswordScreen, SignupScreen, ExploreScreen, BrowseScreen, ProductsScreen, SettingsScreen, BrowseTabScreen, GardenDesignScreen, GardenDesignCanvas, ARView);



function AppNavigator() {
  
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="welcome"
        screenOptions={{
          headerStyle: {
            height: theme.sizes.base * 4,
            backgroundColor: theme.colors.white,
            borderBottomColor: "transparent",
            elevation: 0, // Disabling elevation for Android
          },
          headerBackImage: () => (
            <Image source={require("../../assets/icons/back.png")} />
          ),
          headerBackTitle: null,
          headerLeftContainerStyle: {
            alignItems: "center",
            marginLeft: Platform.OS === "ios" ? theme.sizes.base : 0,
            padding: theme.sizes.base,
          },
          headerRightContainerStyle: {
            alignItems: "center",
            marginLeft: Platform.OS === "ios" ? theme.sizes.base : 0,
            padding: theme.sizes.base,
          },
        }}
      >
        <Stack.Screen name="welcome" component={WelcomeScreen} />
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="forgot_password" component={ForgotPasswordScreen} />
        <Stack.Screen name="signup" component={SignupScreen} />
        <Stack.Screen name="browse" component={BrowseTabScreen} />
        <Stack.Screen name="explore" component={ExploreScreen} />
        <Stack.Screen name="products" component={ProductsScreen} />
        <Stack.Screen name="settings" component={SettingsScreen} />
        <Stack.Screen name="browseScreen" component={BrowseScreen} />
        <Stack.Screen name="GardenDesign" component={GardenDesignScreen} />
        <Stack.Screen name="GardenDesignCanvas" component={GardenDesignCanvas} />
        <Stack.Screen name="ARView" component={ARView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
