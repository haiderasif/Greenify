import React, { useContext,useState,useEffect } from "react";
import ListItem from "../components/ListingItem";
import Screen from "../components/Screen";
import { StyleSheet, View, FlatList,Image } from "react-native";
import colors from "../styles/colors";
import Icon from "../components/Icons";
import {AuthenticationContext} from '../services/authentication/authentication.context'
import { getAuth,signOut } from "firebase/auth";
import { useIsFocused } from "@react-navigation/native";

function AccountScreen({ navigation }) {
const auth = getAuth();
const user = auth.currentUser;
const {setIsAuthenticated} = useContext(AuthenticationContext)
const isFocused = useIsFocused()

useEffect(() => {
  if (isFocused){
    getInitialData()
  }
},[isFocused])
const getInitialData = async () => {}
  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        <ListItem
          title={user.displayName}
          subTitle={user.email}
          image={user.photoURL}
          onPress = {() => {
            navigation.navigate('Edit Profile')
          }}
        />
      </View>
      <ListItem
        title={"My Listings"}
        IconComponent={<Icon name={"format-list-bulleted"} backgroundColor="#1E5631" />}
        onPress = {() => {
          navigation.navigate('My Listing')
        }}
      />
      <ListItem
        title={"My Campaign"}
        IconComponent={<Icon name={"image-marker-outline"} backgroundColor="#1E5631" />}
        onPress = {() => {
          navigation.navigate('My Campagin')
        }}
      />
      <ListItem
        title={"Log Out"}
        IconComponent={<Icon name={"logout"} backgroundColor="#ffe66d" />}
        onPress = {() => {
          signOut(auth).then(() => {
          setIsAuthenticated(false)
          })
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  screen: {
    paddingTop: 30,
    backgroundColor: colors.light,
  },
});

export default AccountScreen;
