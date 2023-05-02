import React from "react";
import { createStackNavigator,TransitionPresets } from "@react-navigation/stack";
import AccountScreen from "../screens/AccountScreen";
import MyListingScreen from "../screens/MyListing";
import MyCampaignUsers from "../screens/myCampaignUsers";
import MyCampaign from "../screens/MyCampaign";
import EditProfile from "../screens/EditProfile";
import DeleteUser from "../screens/DeleteUser";
import UpdatePost from "../screens/UpdatePost"
const Stack = createStackNavigator();

export const AccountNavigator = () => (
  <Stack.Navigator
  screenOptions={{
    ...TransitionPresets.ModalSlideFromBottomIOS,
    }}
  >
    <Stack.Screen name="Account" options={{ headerShown:false}} component={AccountScreen} />
    <Stack.Screen name="Edit Profile"  options={{ headerShown: true, headerTitle: "", headerStyle: {backgroundColor: '#F8F1F1',}, headerBackTitle: "Back" }} component={EditProfile} />
    <Stack.Screen name="My Listing"  options={{ headerShown: true, headerTitle: "My lisitng", headerStyle: {backgroundColor: '#F8F1F1',}, headerBackTitle: "Back" }} component={MyListingScreen} />
    <Stack.Screen name="My Campagin Users" options={{ headerShown: true, headerTitle: "", headerStyle: {backgroundColor: '#F8F1F1',}, headerBackTitle: "Back" }} component={MyCampaignUsers} />
    <Stack.Screen name="My Campagin" options={{ headerShown: true, headerTitle: "My Campaign", headerStyle: {backgroundColor: '#F8F1F1',}, headerBackTitle: "Back" }} component={MyCampaign} />
    <Stack.Screen name="Delete User" options={{ headerShown: true, headerTitle: "", headerStyle: {backgroundColor: '#F8F1F1',}, headerBackTitle: "Back" }} component={DeleteUser} />
    <Stack.Screen name="Update Post" options={{ headerShown: true, headerTitle: "", headerStyle: {backgroundColor: '#F8F1F1',}, headerBackTitle: "Back" }} component={UpdatePost} />

  </Stack.Navigator>
);

