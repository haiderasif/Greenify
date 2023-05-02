import React, {useContext, useState,useEffect} from "react";
import { StyleSheet, View, ScrollView, Text,Image } from "react-native";
import { ActivityIndicator, List } from "react-native-paper";
import { getDatabase, ref, onValue } from 'firebase/database';
import { useIsFocused } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { FirebaseContext } from "../services/FirebaseData";

import Card from "../components/Card";
import Screen from "../components/Screen";
import colors from "../styles/colors";

function MyCampaignUsers({route}) {
  const detail = route.params
  console.log(detail.detail.title);
  const {GetRegisteredCampaignUsers,registeredCampaignUsers} = useContext(FirebaseContext)

useEffect(() => {
  GetRegisteredCampaignUsers(detail)
},[])
  return (
    <Screen style={styles.screen}>
    <Text style = {{ fontSize: 20, fontWeight: 'bold', alignSelf: 'center',paddingTop: 20, paddingBottom: 20}}>Registered Users</Text>
    <List.Section>
    {registeredCampaignUsers.map((data) => {
      if(data.TreePlanted == 'Yes' && detail.detail.title == data.CampaignTitle)
      {
        return(
          <List.Accordion
          style = {{backgroundColor: '#F8F1F1'}}
          key = {data.key}
          title={data.Name}
          left={props => <List.Icon {...props} icon="folder" />}>
          <View style = {{paddingTop: 30, paddingBottom: 30}}>
            <Text style = {{ fontSize: 16}}>Name: {data.Name}</Text>
            <Text style = {{fontSize: 16}}>Enrolment: {data.Enrollment}</Text>
            <Text style = {{ fontSize: 16}}>Department: {data.Department}</Text>
            <Text style = {{fontSize: 16}}>Email: {data.Email}</Text>
            <Text style = {{fontSize: 16}}>Planted a tree?: {data.TreePlanted}</Text>
            <Image
          source={{ uri: data.TreeImage }}
          style={{ width: 300, height: 200, marginTop: 20}}
          />
          </View>
        </List.Accordion>
          )
      }
    })}
    </List.Section>
    </Screen>
  );
}
const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.light,
  },
});

export default MyCampaignUsers;
