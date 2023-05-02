import { CampaignInfo } from "../components/campaign-info.component";
import React, {useContext, useState,useEffect} from "react";

import { SafeAreaView, Image, Text, View, StyleSheet,ScrollView } from "react-native";
import { styles } from "../styles/styles";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import { FirebaseContext } from "../services/FirebaseData";
import { List } from "react-native-paper";
import FormImagePicker from "../components/forms/FormImagePicker";
import { getAuth } from "firebase/auth";
import getDirections from 'react-native-google-maps-directions'




export const CampaignDetailedScreen = ({ route, navigation }) => {
  const detail = route.params;
  const dateobj = new Date()
  const month = dateobj.getMonth()+1
  var day = dateobj.getDate()
  if(day<10)
  {
    day = '0'+day
  }
  const year = dateobj.getFullYear()
  const date = month+'/'+day+'/'+year
  const auth = getAuth();
  const user = auth.currentUser;
  const {GetRegisteredCampaignUsers,registeredCampaignUsers} = useContext(FirebaseContext)
  const images = ""
  useEffect(() => {
    GetRegisteredCampaignUsers(detail)
  },[])
  const handleGetDirections = () => {
    const data = {
      destination: {
        latitude: parseFloat(detail.detail.latitude),
        longitude: parseFloat(detail.detail.longitude)
      },
      params: [
        {
          key: "travelmode",
          value: "driving"        // may be "walking", "bicycling" or "transit" as well
        },
        {
          key: "dir_action",
          value: "navigate"       // this instantly initializes navigation using the given travel mode
        }
      ],
    }
 
    getDirections(data)
  }
  return (
    <ScrollView style = {{backgroundColor: '#F8F1F1'}}>
      <View style={styles.info}>
        <Text style={[styles.title, {paddingBottom: 50, fontSize: 25, alignSelf: 'center'}]}>{detail.detail.title}</Text>
        <Text style={{fontSize: 17,paddingBottom: 10}}>{detail.detail.description}</Text>
        <Text style={{paddingBottom: 10, fontWeight: '500'}}>Location: {detail.detail.LocationName}</Text>
        <Text style={{fontWeight: '500'}}>Start Date: {detail.detail.startDate}</Text>
        <Text style={{fontWeight: '500'}}>Start Time: {detail.detail.startTime}</Text>
        </View>
        <View style = {{paddingBottom: 20}}>
        <Image
        source={{ uri: detail.detail.imageUrl }}
        style={{ width: '100%', height: 200 }}
      />
      </View>
        {detail.detail.startDate <= date ? (<View> 
          {registeredCampaignUsers.map((data) => {
            if(data.UserId == user.uid && detail.detail.title == data.CampaignTitle)
            {
            return(
              <View>
                <AppButton
          onPress={() => {
            navigation.navigate("Campaign Image Upload",{
              detail
            });
          }}
          title={"Upload Plant"}
          bgcolor = {'#16C79A'}
          width = {'80%'}
        ></AppButton>
        <AppButton 
    bgcolor="#16C79A"
    width= '80%'
    onPress={handleGetDirections}
    title = 'Go to location'
    />
              </View>
            )
            }
          })}
           </View>) :  <AppButton
          onPress={() => {
            navigation.navigate("CampaignFormScreen",{
              detail
            });
          }}
          title={"Join Now"}
          bgcolor = {'#16C79A'}
          width = {'80%'}
        ></AppButton>}
       
    </ScrollView>
  );
};
