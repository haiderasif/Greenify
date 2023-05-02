import React from "react";
import {Text, StatusBar, SafeAreaView, Image} from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import {styles} from '../styles/styles'
import {CampaignNavigator} from '../infrastructure/campaign.navigator'
import { MapNavigator } from "./Map.navigator";
import { AccountNavigator } from "./account.navigator";
import  ListingEditScreen  from "../screens/ListingEdit";
import NewListingButton from "../components/NewListingButton";
import FeedNavigator from "./feed.navigator";



const url = 'https://firebasestorage.googleapis.com/v0/b/greenifyfinal-3819e.appspot.com/o/10%2FNew_image.png?alt=media&token=c38814bd-8637-443d-b6cb-d70cf063709b'

function SocialFeed() {
    return(
    <SafeAreaView style = {styles.safeArea}>
    <Text>This is a setting screen</Text>
  </SafeAreaView>
    )
}
function Report() {
    return(
    <SafeAreaView style = {styles.safeArea}>
    <Text>This is a setting screen</Text>
  </SafeAreaView>
    )
}
const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
    return(
        <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
    
            if (route.name === 'Campaign') {
              iconName ='calendar-sharp';

            }
            else if(route.name ==='Social Feed') {
                iconName ='people-sharp';
            }
            else if (route.name === 'Settings') {
              iconName = 'md-settings';
            }
              else if(route.name === 'Map'){
              iconName = 'md-map';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'green',
          tabBarInactiveTintColor: 'gray',
          headerShown: false

        })}
        >
            <Tab.Screen name="Map" component={MapNavigator} />
            <Tab.Screen name="Campaign" component={CampaignNavigator} />
            <Tab.Screen
      name="ListingEdit"
      component={ListingEditScreen}
      options={({ navigation }) => ({
        tabBarButton: () => (
          <NewListingButton
            onPress={() => navigation.navigate('ListingEdit')}
          />
        ),
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons
            name="plus-circle"
            color={color}
            size={size}
          />
        ),
      })}
    />
            <Tab.Screen name="Social Feed" component={FeedNavigator} />
            <Tab.Screen name="Settings" component={AccountNavigator} />
          </Tab.Navigator>
    )

}