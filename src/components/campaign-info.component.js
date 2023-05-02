import React from "react";
import { Text, View,  } from "react-native";
import { Button, Card } from 'react-native-paper';
import { styles } from "../styles/styles";

export const CampaignInfo = ({campaign = { }}) => {
    const {
        name = 'Bahria Campaign',
        photos = [
            "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?cs=srgb&dl=pexels-pixabay-260922.jpg&fm=jpg"
        ],
        hasStarted = false,
        startTime = '10 November 2022'
    } = campaign
    return(
        <Card elevation={5} style = {styles.RestrauntCard}>
            <Card.Cover key = {name}  source={{uri: photos[0]}} style = {styles.RestrauntCardCover}/>
            <View style = {styles.info}>
            <Text style = {styles.title}>{name}</Text>
            <Text style = {styles.startTime}>{startTime}</Text>
            {hasStarted ? <Text>Campaign started</Text> :  <Button mode="contained" style = {styles.button}>Set Reminder</Button>}
            </View>
        </Card>
    )
}