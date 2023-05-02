import React, {useContext, useState,useEffect} from "react";
import { FlatList, StyleSheet,DevSettings, View } from "react-native";
import { Button } from "react-native-paper";
import { getDatabase, ref, onValue } from 'firebase/database';
import { useIsFocused } from "@react-navigation/native";
import {ActivityIndicator} from 'react-native-paper'

import Card from "../components/Card";
import Screen from "../components/Screen";
import colors from "../styles/colors";
import {FirebaseContext} from '../services/FirebaseData'
import { AppLoader } from "../components/AppLoader";

function ListingScreen({ navigation }) {
  const {GetListingData,listingData} = useContext(FirebaseContext)
  const [isLoading,setIsLoading] = useState(true)
useEffect(() => {
  GetListingData()
  setTimeout(() => {
    setIsLoading(false)
  },3000)
},[])

  return (
    <>
    <Screen style={styles.screen}>
      <FlatList
        data={listingData}
        keyExtractor={(listing) => listing.key}
        renderItem={({ item }) => (
          <Card
            title={item.title}
            subTitle={item.LocationName}
            image={item.imageUrl}
            onPress={() => navigation.navigate('ListingDetails', item)}
          />
        )}
      />
    </Screen>
    {isLoading ?  <AppLoader />: null}
    </>
  );
}
const styles = StyleSheet.create({
  screen: {
    padding: 20,
    backgroundColor: colors.light,
  },
});

export default ListingScreen;
