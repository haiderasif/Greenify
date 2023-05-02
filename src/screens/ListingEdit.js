import React, {useContext, useEffect, useState} from "react";
import { Alert, StyleSheet,Modal,View, KeyboardAvoidingView,ScrollView} from "react-native";
import * as Yup from "yup";
import {Text} from 'react-native'
import AppForm from "../components/forms/AppForm";
import AppFormPicker from "../components/forms/AppFormPicker";
import AppFormField from "../components/forms/AppFormField";
import SubmitButton from "../components/forms/SubmitButton";
import Screen from "../components/Screen";
import CategoryPickerItem from "../components/CategoryPickerItem.js";
import colors from "../styles/colors";
import FormImagePicker from "../components/forms/FormImagePicker";
import useLocation from "../services/location.service";
import { getDatabase, ref, onValue, set,push } from 'firebase/database';
import { AuthenticationContext } from "../services/authentication/authentication.context";
import {getStorage, uploadBytes,ref as sRef, getDownloadURL, list} from 'firebase/storage'
import { getAuth } from "firebase/auth";
import { Button } from "react-native-paper";
import MapView,{Marker,PROVIDER_GOOGLE } from 'react-native-maps';
import { MapInput } from "../components/search.component";
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import { FirebaseContext } from "../services/FirebaseData";
import { useIsFocused } from "@react-navigation/native";
import { AppLoader } from "../components/AppLoader";
import Lottie from 'lottie-react-native';
import * as MediaLibrary from 'expo-media-library';
import * as Notification from "expo-notifications";
import * as Permission from "expo-permissions";


const validationSchema = Yup.object().shape({
  title: Yup.string().required().min(1).label("Title"),
  description: Yup.string().label("DEscription"),
  UserLocation: Yup.string().label("Enter Location Name"),
  category: Yup.object().required().nullable().label("category"),
  images: Yup.string().label("Add image")
});
const d = new Date()
var categories = [
  {
    label: "Site",
    value: 1,
    backgroundColor: "#fc5c65",
    icon: "map-marker-plus-outline",
  },
  {
    backgroundColor: "#45aaf2",
    icon: "bell-plus-outline",
    label: "campaign",
    value: 6,
    startDate: d.getMonth()+1+"/"+d.getDate()+"/"+d.getFullYear(),
    startTime: d.getHours()+":"+d.getMinutes()
  },
];
Notification.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: true,
      shouldShowAlert: true,
    };
  },
});

function  ListingEditScreen() {
  const auth = getAuth();
  const user = auth.currentUser;
  const {location} = useContext(AuthenticationContext)
  const {GetListingCampaign,listingCampaignData} = useContext(FirebaseContext)
  const [isLoading, setIsLoading] = useState(false)

  const handleNotification = () => {
    Notification.scheduleNotificationAsync({
      content: {
        title: "New Campaign",
        body: "A new campaign has been uploaded",
      },
      trigger: {
        seconds: 5,
      },
    });
  };
  const uploadSite = (values) => {
    setIsLoading(true) 
        const lat = values.latitude
        const lng = values.longitude
        const myLocation = values.UserLocation
        fetch('http://10.97.22.186:5000', {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .then(async () => {
            fetch('http://10.97.22.186:5000/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({lat,lng,myLocation})
          })
            setIsLoading(false)   
            Alert.alert("Data has been uploaded")
            setServerError(false)
            var image = ""
    const resizedImage = await manipulateAsync(values.images, [
      {resize: {width: 400, height: 200}}
    ],
      {compress: 0.5, format: SaveFormat.PNG});
      image = resizedImage.uri.toString()  
    const storage = getStorage();
    var URL = ""
    const filename = image.substring(image.lastIndexOf('/'))
    const StorageRef = sRef(storage, 'listing/'+filename)
    const img = await fetch(image)
    const bytes = await img.blob()
    await uploadBytes(StorageRef, bytes)
    const DownloadRef = sRef(storage, 'listing/'+filename)
    await getDownloadURL(DownloadRef).then((u) => {
        URL = u
        })
        .catch((e) => {
          console.log(e)
        })
        const db = getDatabase();
        const reference = ref(db, 'listing/');
        push(reference, {
            title: values.title,
            category: values.category.label,
            latitude: values.latitude,
            longitude: values.longitude,
            description: values.Description,
            userId: user.uid,
            imageUrl: URL,
            LocationName: values.UserLocation,
        });
          })
          .catch(() => {
            setIsLoading(false)
            setServerError(true)
          })
    }

    const uploadCampaign = async (values) => {
      var image = ""
      const resizedImage = await manipulateAsync(values.images, [
        {resize: {width: 400, height: 200}}
      ],
        {compress: 0.5, format: SaveFormat.PNG});
        image = resizedImage.uri.toString()
      setIsLoading(true)
      const storage = getStorage();
      var URL = ""
      const filename = image.substring(image.lastIndexOf('/'))
      const StorageRef = sRef(storage, 'Campaign/'+filename)
      const img = await fetch(image)
      const bytes = await img.blob()
      await uploadBytes(StorageRef, bytes)
      const DownloadRef = sRef(storage, 'Campaign/'+filename)
      await getDownloadURL(DownloadRef).then((u) => {
          URL = u
          })
          .catch((e) => {
            console.log(e)
          })
          const db = getDatabase();
          const reference = ref(db, 'Campaign/');
          push(reference, {
              title: values.title,
              category: values.category.label,
              latitude: values.latitude,
              longitude: values.longitude,
              LocationName: values.UserLocation,
              description: values.Description,
              userId: user.uid,
              imageUrl: URL,
              startDate: values.category.startDate,
              startTime: values.category.startTime,
              CampaignStatus: "inProcess"
          });
          setIsLoading(false) 
          handleNotification()  
          Alert.alert("Data has been uploaded")
      }
    
    const [region, setRegion] = useState({
      latitude: location.latitude,
      longitude:  location.longitude,
      latitudeDelta: 0.3,
      longitudeDelta: 0.3,
  })
  const [modalVisible, setModalVisible] = useState(false);
  const getCoordsFromName =(loc) => {
    setRegion({
      latitude: loc.lat,
        longitude: loc.lng,
        latitudeDelta: 0.3,
        longitudeDelta: 0.3,
    })
  }



  const [error, setError] = useState(false)
  const [serverError, setServerError] = useState(false)
  const isFocused = useIsFocused()
  useEffect(() => {
    Permission.getAsync(Permission.NOTIFICATIONS)
      .then((response) => {
        if (response.status !== "granted") {
          return Permission.askAsync(Permission.NOTIFICATIONS);
        }
        return response;
      })
      .then((response) => {
        if (response.status !== "granted") {
          return;
        }
      });
  }, []);
  useEffect(() => {
    if (isFocused){
      GetListingCampaign()
      getInitialData()
    }
  },[isFocused])
const getInitialData = async () => {
  setError(false)
  setServerError(false)
}
const dateobj = new Date()
const month = dateobj.getMonth()+1
const day = dateobj.getDate()
const year = dateobj.getFullYear()
const date = month+'/'+day+'/'+year
  return (
    <>
    <ScrollView keyboardShouldPersistTaps="always">
    <Screen style={styles.container}>
      <AppForm
        initialValues={{
          title: "",
          latitude: region.latitude,
          longitude: region.longitude,
          description: "",
          category: '',
          images: "",
          UserLocation: ""
        }}
        onSubmit={(values,{resetForm}) => {   
              if(values.category.label == 'Site')
            {
              values.latitude = region.latitude
              values.longitude = region.longitude
              uploadSite(values)
              resetForm(values="")
            }
            else if(values.category.label == 'campaign')
            {
              values.latitude = region.latitude
              values.longitude = region.longitude
              let check = false
              if(listingCampaignData.length == 0)
              {
                uploadCampaign(values)
              }       
              listingCampaignData.map((data) => {
                if(data.userId == user.uid && data.CampaignStatus == 'inProcess')
                {
                  
                  setError(true)
                  check = false
                }
                else{
                 
                  setError(false)
                  check = true 
                }
                })
                {check ? (uploadCampaign(values)) : null}
                resetForm(values="")
            }
        }}
        validationSchema={validationSchema}
      >
        <FormImagePicker name="images" />
        <AppFormField  maxLength={225} name="title" placeholder="Title" />
        <View style = {styles.Textcontainer}>
        <Text style = {{alignSelf: 'center'}}>{region.latitude.toFixed(4) +", "+ region.longitude.toFixed(4)}</Text>
        <Text  style={{paddingLeft: 90 , color: '#16C79A'}} onPress={() => {
        setModalVisible(true)
      }}> Set Location</Text>
        </View>
        <AppFormField  maxLength={225} name="UserLocation" placeholder="Enter Location Name" />
        <AppFormPicker
          name="category"
          numberOfColumns={3}
          PickerItemComponent={CategoryPickerItem}
          items={categories}
          placeholder="Category"
          width="50%"
        />
        <AppFormField
          maxLength={255}
          multiline
          name="Description"
          numberOfLines={3}
          placeholder="Description"
        />
        
        <SubmitButton title={"Post"} width = {"90%"} bgcolor = {'#16C79A'}/>
      </AppForm>
    
      <Modal
        animationType="slide"
        visible={modalVisible}
      >
            <MapInput notifyChange={(loc) => getCoordsFromName(loc)}/>
            <MapView 
            style = {{width: '100%', height: '100%'}}
            region = {region}
            //showsUserLocation={true}
            onPress = {(e) => {
              setRegion({
                latitude:e.nativeEvent.coordinate.latitude, 
                longitude:e.nativeEvent.coordinate.longitude,
                latitudeDelta: 0.3,
                longitudeDelta: 0.3,
              })
            }}
            //onRegionChangeComplete={(reg) => setRegion(reg)}
            //provider= {PROVIDER_GOOGLE}
            > 
              <Marker
                coordinate={region} />
            </MapView>
          <Button
              mode="contained" 
              style={{position: 'absolute', top: '90%', //for center align
              alignSelf: 'center', width: '100%', height: 40 }}
              onPress={() => setModalVisible(!modalVisible)}
            >
            Set Location
            </Button>
      </Modal>
      {error ? (<Text style = {{color: 'red', marginLeft: 20, fontWeight: 'bold'}}>You have already started a campaign. Please try again later</Text>) : null}
      {serverError ? (<Text style = {{color: 'red', marginLeft: 20, fontWeight: 'bold'}}>Please check your server and try again</Text>) : null}
    </Screen>
    </ScrollView>
    {isLoading ?  <AppLoader /> : null}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: -20,
    padding: 10,
  },
    Textcontainer: {
      backgroundColor: colors.light,
      borderRadius: 5,
      borderWidth: 1,
      flexDirection: "row",
      width: "90%",
      padding: 15,
      marginVertical: 10,
      marginLeft: 20,
    },
    modalView: {
      backgroundColor: "white",
      borderRadius: 20,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      }
    },
    Datecontainer: {
      backgroundColor: colors.light,
      borderRadius: 5,
      borderWidth: 1,
      flexDirection: "row",
      width: "90%",
      padding: 15,
      marginVertical: 10,
      marginLeft: 20,
      flexDirection: 'row',
    },
    title: {
      textAlign: 'left',
      fontSize: 20,
      fontWeight: 'bold',
    },
    datePickerStyle: {
      width: 230,
    },
    text: {
      textAlign: 'left',
      width: 230,
      fontSize: 16,
      color : "#000"
    }
});
export default ListingEditScreen