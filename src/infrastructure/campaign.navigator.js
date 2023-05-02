import React from "react";
import { createStackNavigator, TransitionPresets  } from '@react-navigation/stack'
import { CampaignScreen } from "../screens/CampaignScreen";
import { CampaignDetailedScreen } from "../screens/CampaignDetailedScreen";
import CampaignFormScreen from "../screens/CampaignFormScreen";
import CampaignImageUpload from "../screens/CampaignImageUpload";
const Stack = createStackNavigator()
export const CampaignNavigator = () => {
    return (
        <Stack.Navigator
        screenOptions={{
            ...TransitionPresets.ModalSlideFromBottomIOS,
            }}
        >
            <Stack.Screen 
            name = 'campaign'
            options={{ headerShown: false}}
            component = {CampaignScreen}
            />
             <Stack.Screen 
            name = 'CampaignDetailedScreen'
            options={{ headerShown: true, headerTitle: "", headerStyle: {backgroundColor: '#F8F1F1',}, headerBackTitle: "Back" }}
            component = {CampaignDetailedScreen}
            />
            <Stack.Screen name="CampaignFormScreen" options={{ headerShown: true, headerTitle: "", headerStyle: {backgroundColor: '#F8F1F1',}, headerBackTitle: "Back" }} component={CampaignFormScreen} />
            <Stack.Screen name="Campaign Image Upload" options={{ headerShown: true, headerTitle: "", headerStyle: {backgroundColor: '#F8F1F1',}, headerBackTitle: "Back" }} component={CampaignImageUpload} />
        </Stack.Navigator>
    )
}
