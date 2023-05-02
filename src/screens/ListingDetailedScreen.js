import React, {useEffect, useState} from "react";
import { Image, View, StyleSheet, Text, ScrollView } from "react-native";
import { Button } from "react-native-paper";
import AppText from "../components/AppText";
import colors from "../styles/colors";
import ListItem from "../components/LisingItem";
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth } from "firebase/auth";
import AppButton from '../components/AppButton'
import { TabActions } from '@react-navigation/native';
import { useIsFocused } from "@react-navigation/native";


function ListingDetailsScreen({ route,navigation }) {
  const listing = route.params;
  const [x, setX] = useState([])
  const [user, setUser] = useState([])
  const auth = getAuth();
  const Curuser = auth.currentUser;
  const isFocused = useIsFocused()
  useEffect(() => {
    if (isFocused){
    getInitialData()
    const db = getDatabase();
    const reference = ref(db, 'data');
    const userReference = ref(db, 'User')
    onValue(reference, snapshot => {
      let result
      snapshot.forEach((data) => {
        result = data.val()
        if(result.Location.replace(/ /g, '') === listing.LocationName.replace(/ /g, ''))
        {
          setX(result)
        }
        result["key"]  = data.key;
      })
    })
    onValue(userReference, snapshot => {
      snapshot.forEach((data) => {
        let result = data.val()
        if(result.UserId == listing.userId)
        {
          setUser(result)
        }
        result["key"]  = data.key;
      })
    })
  }
},[isFocused])
const getInitialData = async () => {}
  return (
    <>
    <ScrollView>
    <View>
      <Image style={styles.image} source={{uri: listing.imageUrl}} />
      <View style={styles.detailContainer}>
        <Text style={styles.title}>{listing.title}</Text>
        <Text style={styles.description}>{listing.description}</Text>
        <Text style={styles.loc}>Location: {listing.LocationName}</Text>
        </View>
        <View style={styles.userContainer}>
        <ListItem
          title={user.Name}
          subTitle={user.Email}
          image={user.Picture}
          onPress = {() => {
            navigation.navigate('UserAccount',{
              user: {user}
            })
          }}
        />
        <View style = {{paddingTop: 20}}>
        {x.length==0 ? (<Text style = {{alignSelf: 'center', fontSize: 14, fontWeight: 'bold', color: 'red'}}>Data is being uploaded. Please try again in few minutes</Text>) : (<AppButton
          width = "90%"
          title="Go to location"
          bgcolor="#16C79A"
          onPress={() => { 
            navigation.navigate('MapDetailed',{
              detail: {x}
            })
          }}
        />)}
        </View>
        </View>
    </View>
    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 200,
  },
  detailContainer: {
    padding: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: "600",
    alignSelf: 'center',
    paddingBottom: 50
  },
  userContainer: {
    marginVertical: 20,
  },
  description: {
    fontSize: 15,
    paddingBottom: 10,
  },
  loc: {
    fontWeight: '500'
  }
});

export default ListingDetailsScreen;
