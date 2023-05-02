import React, { useState,useEffect, useContext } from "react";
import { FlatList, SafeAreaView, Pressable, View, Text,TouchableOpacity } from "react-native";
import { Button, Card, ActivityIndicator } from "react-native-paper";
import { styles } from "../styles/styles";
import { FirebaseContext } from "../services/FirebaseData";
import { getDatabase, ref, onValue,push,update } from 'firebase/database';
import { AppLoader } from "../components/AppLoader";

export const CampaignScreen = ({ navigation }) => {
  const {GetCampaign,campaignData, CheckCampaign} = useContext(FirebaseContext)
  const [isLoading,setIsLoading] = useState(true)
  const dateobj = new Date()
  const month = dateobj.getMonth()+1
  var day = dateobj.getDate()
  const db = getDatabase();
  if(day<10)
  {
    day = '0'+day
  }
  const year = dateobj.getFullYear()
  const date = month+'/'+day+'/'+year
useEffect(() => {
  CheckCampaign()
  GetCampaign()
  setTimeout(() => {
    setIsLoading(false)
  },3000)
},[])



  return (
    <>
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={campaignData}
        keyExtractor={(listing) => listing.key}
        renderItem={({item}) => {
          return (
            <TouchableOpacity 
            onPress={() => {
                navigation.navigate("CampaignDetailedScreen", {
                  detail: item,
                });
              }}
            >
            <Card  style={styles.RestrauntCard}>
              <Card.Cover
                key={item.title}
                source={{ uri: item.imageUrl }}
                style={styles.RestrauntCardCover}
              />
              <View style={styles.info}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.startTime}>Start Date: {item.startDate}</Text>
                <Text style={styles.startTime}>Location:{item.LocationName}</Text>
                {item.startDate <= date ? 
                (
        
                <Text style = {{alignSelf: "center", color: 'red', fontWeight: 'bold', paddingTop: 20}}>Campaign Completed</Text>
               )
                 : null}
              </View>
              
            </Card>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
   {isLoading ?  <AppLoader />: null}
    </>
  );
};
