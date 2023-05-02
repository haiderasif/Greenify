import React, { useState,useRef  } from "react";
import {View, Text,SafeAreaView,ScrollView,Modal, Pressable} from 'react-native'
import { styles } from "../styles/styles";
import { List,Button } from 'react-native-paper';
import Slideshow from 'react-native-image-slider-show';
import getDirections from 'react-native-google-maps-directions'
import useLocation from '../services/location.service'
import { ImageSlider } from "react-native-image-slider-banner";
import AppButton from '../components/AppButton'
export const MapDetailedScreen = ({route}) => {
     const scrollView = useRef();
    const location = useLocation();
    const lat = location.latitude
    const lng = location.longitude
    const {detail} = route.params
    const [destLat, setDestLat] = useState()
    const [destLng, setDestLng] = useState()
    const [nurseryName, setNurseryName] = useState()
    const [modalVisible, setModalVisible] = useState(false);
    const [expanded, setExpanded] = React.useState(true);
    const handlePress = () => setExpanded(!expanded);

    const getNearbyNursery = () => {
      const googleAPIKey = 'AIzaSyBy9zj9lPNOZWZHenVb3uf1S1NHXgzdrJk';
    const placeType = 'nursery';
    const latitude =lat;
    const longitude = lng;
    // Search within maximum 4 km radius.
    let radius = 2 * 1000;

    const url =
      'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' +
      latitude +
      ',' +
      longitude +
      '&radius=' +
      radius +
      '&keyword=' +
      placeType +
      '&key=' +
      googleAPIKey;
      fetch(url)
      .then(res => {
        return res.json();
      })
      .then(res => {
        for (let googlePlace of res.results) {
          var place = {};
          var myLat = googlePlace.geometry.location.lat;
          var myLong = googlePlace.geometry.location.lng;
          var coordinate = {
            latitude: myLat,
            longitude: myLong,
          };
          place['placeTypes'] = googlePlace.types;
          place['coordinate'] = coordinate;
          place['placeId'] = googlePlace.place_id;
          place['placeName'] = googlePlace.name;
        }
        // Show all the places around 4 km from San Francisco.
        setNurseryName(place.placeName)
        setDestLat (place.coordinate.latitude)
        setDestLng (place.coordinate.longitude)
      })
      .catch(error => { 
        //console.log(error);
      });
    }
    const handleGetNurseryDirection = () => {
      const data = {
         source: {location},
        destination: {
          latitude: parseFloat(destLat),
          longitude: parseFloat(destLng)
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
    const handleGetDirections = () => {
      const data = {
         source: {location},
        destination: {
          latitude: parseFloat(detail.x.Latitude),
          longitude: parseFloat(detail.x.Longitude)
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
    return(
      <>
      <ScrollView>
    <SafeAreaView style = {styles.SafeAreaView}>
        <View>
        <Slideshow 
        titleStyle = {{fontSize: 20, color: 'white'}}
        overlay = {false}
        height = {300}
      dataSource={[
        { title : 'Current Location',
          url: detail.x.NewUrl},
        { title: 'Total trees detected',
          url:detail.x.NewProcessedUrl },
        { title: 'Plantation Area',
          url:detail.x.NewNDVIUrl },
        { title : 'Old Location',
          url: detail.x.OldUrl },
        { title: 'Total trees detected',
          url: detail.x.OldProcessedUrl},
        { title: 'Plantation Area',
          url: detail.x.OldNDVIurl}
    ]}/>
        </View>
        <List.Section>
      <List.Accordion
        title="Current Area Details"
        left={props => <List.Icon {...props} icon="pine-tree" />}>
        <View style = {{padding: 30}}>
          <Text style = {{ fontSize: 16}}>Location: {detail.x.Location}</Text>
          <Text style = {{ fontSize: 16}}>Region: {detail.x.Region}</Text>
          <Text style = {{fontSize: 16}}>Trees Detected: {detail.x.TotalTreesPlantedCurrent}</Text>
        </View>
      </List.Accordion>
      <List.Accordion
        title="Past Area Details"
        left={props => <List.Icon {...props} icon="pine-tree" />}
        onPress={handlePress}>
        <View style = {{padding: 30}}>
          <Text style = {{ fontSize: 16}}>Location: {detail.x.Location}</Text>
          <Text style = {{ fontSize: 16}}>Region: {detail.x.Region}</Text>
          <Text style = {{ fontSize: 16}}>Trees Detected: {detail.x.TotalTreesPlantedOld}</Text>
        </View>
      </List.Accordion>
    </List.Section>
    <View style = {{paddingTop: 30}}>
    <AppButton 
    bgcolor="#16C79A"
    width= '70%'
    onPress={handleGetDirections}
    title = 'Plant a tree'
    />
    </View>
      <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {getNearbyNursery()}
            <Text style={styles.modalText}>Nursery found near your location</Text>
            <Text style = {{fontSize: 14, paddingBottom: 10}}>Name: {nurseryName} </Text>
            <Text style = {{fontSize: 14}}>Location: {destLat},{destLng}</Text>
            <Button
              onPress={() => handleGetNurseryDirection()}
              mode="contained" 
              style={{width: 300, marginTop: 20}}
              color = {'#11698E'}
            >
             Go to Location
            </Button>
            <Button
              icon="arrow-left-circle"
              style={{paddingTop: 20}}
              color = {'black'}
              onPress={() => setModalVisible(!modalVisible)}
            >
            </Button>
          </View>
        </View>
      </Modal>
    </View>
    <AppButton 
    bgcolor="#11698E"
    width= '70%'
    onPress={() => setModalVisible(true)}
     title = 'Nearby Nursery'
    />
    </SafeAreaView>
    </ScrollView>
    </>
    )
}