import React, {useContext, useState,useEffect} from "react";
import { FlatList, StyleSheet,DevSettings, View, ActivityIndicator,Alert } from "react-native";
import { Button } from "react-native-paper";
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import { getStorage, ref as Sref, deleteObject } from "firebase/storage";
import { getAuth } from "firebase/auth";


import { useIsFocused } from "@react-navigation/native";

import Card from "../components/Card";
import Screen from "../components/Screen";
import colors from "../styles/colors";
import {FirebaseContext} from '../services/FirebaseData'
import {AuthenticationContext} from '../services/authentication/authentication.context'
import {AppLoader} from '../components/AppLoader'

function MyCampaign({ navigation }) {
  const [isLoading,setIsLoading] = useState(false)
  const {myCampaignData,GetMyCampaign} = useContext(FirebaseContext)
  const db = getDatabase();
  const storage = getStorage();
  const auth = getAuth();
  const user = auth.currentUser;
useEffect(() => {
  GetMyCampaign()
},[])

  return (
    <>
    <Screen style={styles.screen}>
      <FlatList
        data={myCampaignData}
        keyExtractor={(listing) => listing.key}
        renderItem={({ item }) => (
          <Card
            title={item.title}
            subTitle={item.LocationName}
            image={item.imageUrl}
            startDate={item.startDate}
            startTime={item.startTime}
            onPress = {() => {
              Alert.alert("Manage Campaign", "Do you want to update or delete campaign?", [
                { text: "Delete", onPress: () => {
                  setIsLoading(true)
                  const campaignUserRef = ref(db, 'CampaignList');
                  onValue(campaignUserRef, snapshot => {
                    snapshot.forEach((data) => {
                      let result = data.val()
                      if(result.CampaignId == item.userId)
                      {
                      result["key"]  = data.key;  
                      const deleteCampaignUser = ref(db, 'CampaignList/'+result.key)
                      remove(deleteCampaignUser)
                      }
                    })
                  })
                  const filename = item.imageUrl.substring(item.imageUrl.lastIndexOf('F')+1,item.imageUrl.lastIndexOf('?alt'))
                  const desertRef = Sref(storage, 'Campaign/'+filename);
                  deleteObject(desertRef)
                  const deleteRef = ref(db, 'Campaign/'+item.key);
                  remove(deleteRef)
                  setIsLoading(false)
                  navigation.navigate('Account')
                  
                }},
                { text: "Update", onPress: () => {
                  navigation.navigate('Update Post',{detail: {item}})
                } },
                { text: "Registered Users", onPress: () => {
                  navigation.navigate('My Campagin Users',{detail: item})
                } },
                { text: "Back"},
              ]);
            }}
          />
        )}
      />
    </Screen>
    {isLoading ?  <AppLoader /> : null}
    </>
  );
}
const styles = StyleSheet.create({
  screen: {
    padding: 20,
    backgroundColor: colors.light,
  },
});

export default MyCampaign;
