import React, {useEffect, useState, useContext} from 'react';
import { styles } from "../styles/styles";
import {MapInput} from '../components/search.component'
import { MyMapView } from "../components/mapview.component";
import { getDatabase, ref, onValue } from 'firebase/database';
import { View } from "react-native";
import { Colors } from 'react-native-paper';
import { ActivityIndicator } from 'react-native-paper';
import { FirebaseContext } from '../services/FirebaseData';

export const MapScreen = ({navigation}) => {
  const {GetMapData,mapData} = useContext(FirebaseContext)
  const [isLoading,setIsLoading] = useState(true)
  const [region, setRegion] = useState({
    latitude: 33.6844,
    longitude:  73.0479,
    latitudeDelta: 0.3,
    longitudeDelta: 0.3,
})   
    useEffect(() => {
        GetMapData()
        setTimeout(() => {
          setIsLoading(false)
        }, 5000);
    },[])
    
      const getCoordsFromName =(loc) => {
        setRegion({
          latitude: loc.lat,
            longitude: loc.lng,
            latitudeDelta: 0.003,
            longitudeDelta: 0.003,
        })
      }
    return (
<>
    <View style= {{position: 'absolute', top: '50%', left: '50%', zIndex: 10000}}>
        {isLoading && (
        <ActivityIndicator size = {50} style =  {{marginLeft: -25, zIndex: 1}} animating={true} color="#0000ff" />
      )}
    </View>
    <MapInput notifyChange={(loc) => getCoordsFromName(loc)}/>
    
    <MyMapView
    navigation = {navigation}
    listingData = {mapData}
    region={region}
    />
</>
    )
    }
