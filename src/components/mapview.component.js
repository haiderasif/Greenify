import React, {useState, useEffect, useContext} from 'react';
import { SafeAreaView,View } from 'react-native';
import MapView, {Marker,PROVIDER_GOOGLE } from 'react-native-maps';
import { styles } from '../styles/styles';
import { MapCallout } from './map.callout';
import useLocation from '../services/location.service'
import { ActivityIndicator } from "react-native";
import { Button } from 'react-native-paper';

export const MyMapView = (props) => {
    return (
        <SafeAreaView style = {styles.safeArea}>
        <MapView
        mapType='standard'
        style = {styles.mapContainer}
        zoomEnabled = {true}
        zoomControlEnabled = {true}
        provider= {PROVIDER_GOOGLE}
        region={props.region}
        showsUserLocation={true}
        showsMyLocationButton = {true}
        >
            {
                    props.listingData.map((x) => {
                        return(
                            <Marker 
                            key={x.key}
                            tracksViewChanges={false}
                            coordinate ={{
                                latitude: parseFloat(x.Latitude),
                                longitude: parseFloat(x.Longitude)
                            }}
                            >
                        <MapView.Callout
                        onPress = {() => props.navigation.navigate('MapDetailedScreen',{
                            detail: {x}
                        })}>
                            
                            <MapCallout x = {x}/>

                        </MapView.Callout>
                        </Marker>
                        )
                    })
                    
            }

          </MapView>
          </SafeAreaView>
    )
}