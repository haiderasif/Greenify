import React from "react";
import { createStackNavigator, TransitionPresets  } from '@react-navigation/stack'
import { MapScreen } from "../screens/MapScreen";
import { MapDetailedScreen } from "../screens/MapDetailedScreen";
const Stack = createStackNavigator()
export const MapNavigator = () => {
    return (
        <Stack.Navigator
        screenOptions={{
            ...TransitionPresets.ModalSlideFromBottomIOS,
            }}
        >
            <Stack.Screen 
            name = 'map'
            options={{ headerShown: false }}
            component = {MapScreen}
            />
             <Stack.Screen 
            name = 'MapDetailedScreen'
            options={{ headerShown: true, headerTitle: "", headerStyle: {backgroundColor: '#F8F1F1',}, headerBackTitle: "Back" }}
            component = {MapDetailedScreen}
            />
        </Stack.Navigator>
    )
}
