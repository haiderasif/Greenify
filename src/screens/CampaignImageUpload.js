import React, { useContext, useState,useEffect } from "react";
import { StyleSheet, View, Text, ScrollView,Platform } from "react-native";
import * as Yup from "yup";
import { RadioButton } from "react-native-paper";

import Screen from "../components/Screen";
import AppForm from "../components/forms/AppForm";
import AppFormField from "../components/forms/AppFormField";
import SubmitButton from "../components/forms/SubmitButton";
import { getAuth } from "firebase/auth";
import { useIsFocused } from "@react-navigation/native";
import { getDatabase, ref, onValue,push,update } from 'firebase/database';
import {getStorage, uploadBytes,ref as sRef, getDownloadURL, list} from 'firebase/storage'
import FormImagePicker from "../components/forms/FormImagePicker";
import SelectDropdown from 'react-native-select-dropdown'
import colors from "../styles/colors";
import { async } from "@firebase/util";
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import * as MediaLibrary from 'expo-media-library';
import emailjs from '@emailjs/browser';
import { AppLoader } from "../components/AppLoader";



const validationSchema = Yup.object().shape({
    images: Yup.string().required().label("Image")
});

function CampaignImageUpload({ route}) {
  const detail = route.params;
  const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        if (isFocused){
          getInitialData()
        }
      },[isFocused])
      const getInitialData = async () => {
        setError(false)
      }

    const auth = getAuth();
    const user = auth.currentUser;
    const isFocused = useIsFocused()
    const [listingDatas,setListingsData] = useState([])
    const [error, setError] = useState(false)
    const dateobj = new Date()
    const month = dateobj.getMonth()+1
    var day = dateobj.getDate()
    if(day<10)
    {
      day = '0'+day
    }
    const year = dateobj.getFullYear()
    const date = month+'/'+day+'/'+year

    const upload = async (values) => {
      setIsLoading(true)   
        var image = ""
      const resizedImage = await manipulateAsync(values.images, [
        {resize: {width: 400, height: 200}}
      ],
        {compress: 0.5, format: SaveFormat.PNG});
        image = resizedImage.uri.toString()
        const storage = getStorage();
        if(Platform.OS==='ios')
        {
          const assets = await MediaLibrary.getAssetsAsync(image);
          const asset = assets.assets
          for(let i=0; i<asset.length; i++)
          {
            const imageData = await MediaLibrary.getAssetInfoAsync(asset[i].id);
            if(imageData.location)
            {
              console.log(imageData.location)
              const db = getDatabase();
            const reference = ref(db, 'CampaignList');
            onValue(reference, snapshot => {
                snapshot.forEach((data) => {
                let result = data.val()
                if(result.UserId == user.uid && result.CampaignId == detail.detail.detail.userId && result.CampaignTitle == detail.detail.detail.title)
                {
                    result["key"]  = data.key;
                    var templateParams = {
                      name: result.Name,
                      email: result.Email,
                      campaign: detail.detail.detail.title,
                      lat: imageData.location.latitude,
                      lng: imageData.location.longitude,
                      reply_to: 'greenifya@gmail.com',
                      accessToken: 'kgs-sCOJflo_1IUjfputc'

                  };
                  emailjs.send('service_ja47ixg', 'template_gapfovr', templateParams, 'TJhwkUh1KZJ8HPJeg')
                  .then((result) => {
                      console.log(result);
                  }, (error) => {
                      console.log(error.text);
                  });
                    return
                }
              })
            })
              
            }
          }
        }
        else if(Platform.OS==='android')
        {
          const db = getDatabase();
            const reference = ref(db, 'CampaignList');
            onValue(reference, snapshot => {
                snapshot.forEach((data) => {
                let result = data.val()
                if(result.UserId == user.uid && result.CampaignId == detail.detail.detail.userId  && result.CampaignTitle == detail.detail.detail.title)
                {
                    result["key"]  = data.key;
                    var templateParams = {
                      name: result.Name,
                      email: result.Email,
                      campaign: detail.detail.detail.title,
                      lat: detail.detail.detail.latitude,
                      lng: detail.detail.detail.longitude,
                      reply_to: 'greenifya@gmail.com',
                      accessToken: 'kgs-sCOJflo_1IUjfputc'

                  };
                  emailjs.send('service_ja47ixg', 'template_gapfovr', templateParams, 'TJhwkUh1KZJ8HPJeg')
                  .then((result) => {
                      console.log(result);
                  }, (error) => {
                      console.log(error.text);
                  });
                    return
                }
              })
            })
        }
      var URL = ""
      const filename = image.substring(image.lastIndexOf('/'))
      const StorageRef = sRef(storage, 'CampaignList/'+filename)
      const img = await fetch(image)
      const bytes = await img.blob()
      await uploadBytes(StorageRef, bytes)
      const DownloadRef = sRef(storage, 'CampaignList/'+filename)
      await getDownloadURL(DownloadRef).then((u) => {
          URL = u
          })
          .catch((e) => {
            console.log(e)
          })
            const db = getDatabase();
            const reference = ref(db, 'CampaignList');
            onValue(reference, snapshot => {
                snapshot.forEach((data) => {
                let result = data.val()
                if(result.UserId == user.uid && result.CampaignId == detail.detail.detail.userId && result.CampaignTitle == detail.detail.detail.title)
                {
                    result["key"]  = data.key;
                    const updateList = ref(db, 'CampaignList/'+result.key);
                    update(updateList, {
                        TreePlanted: "Yes",
                        TreeImage: URL,
                    });
                    return
                }
              })
            })
            setIsLoading(false)   
            alert('Data has been uploaded')
        }
    var finished = [];
    const check = (values) => {
        const db = getDatabase();
        const reference = ref(db, 'CampaignList');
        onValue(reference, snapshot => {
        snapshot.forEach((data) => {
        let result = data.val()
        if(result.UserId == user.uid && result.TreePlanted=="Yes" && result.CampaignId == detail.detail.detail.userId && result.CampaignTitle == detail.detail.detail.title)
        {
        result["key"]  = data.key;
        finished.push(result)
        return
        }
      })
      setListingsData(finished)
    })
    }
  return (
    <>
    <ScrollView style = {{backgroundColor: '#F8F1F1'}}>
    <Screen style={styles.container}>
      <AppForm
        initialValues={{ images:"" }}
        onSubmit={(values,{resetForm}) => {
            check(values)
            if(!finished.length==0)
            {
                setError(true)
            }
            else{
                setError(false)
                upload(values)
                resetForm({values: ""})
            }
                }}
                validationSchema={validationSchema}
      >
        <FormImagePicker name="images" />
        <SubmitButton title="Submit"  bgcolor = {'#16C79A'} width = {'90%'}/>
      </AppForm>
      {error ? (<Text>User already registered</Text>) : null }
    </Screen>
    </ScrollView>
    {isLoading ?  <AppLoader /> : null}
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 10,
    
    paddingTop: 50
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 10,
  },
});

export default CampaignImageUpload;
