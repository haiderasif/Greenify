import React, {useContext, useState,useEffect, useReducer} from "react";
import { StyleSheet,Text,View, Alert } from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import AppForm from "../components/forms/AppForm";
import AppFormField from "../components/forms/AppFormField";
import SubmitButton from "../components/forms/SubmitButton";
import { AuthenticationContext } from "../services/authentication/authentication.context";
import FormImagePicker from "../components/forms/FormImagePicker";
import {getStorage, uploadBytes,ref as sRef, getDownloadURL} from 'firebase/storage'
import AppButton from "../components/AppButton";
import colors from "../styles/colors";
import { AppLoader } from "../components/AppLoader";
import { useIsFocused } from "@react-navigation/native";
import { getAuth } from "firebase/auth";


const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
  images: Yup.string().required().label("Image"),
});
function RegisterScreen({navigation}) {
  const {onRegister,error, setError} = useContext(AuthenticationContext)
  const [isLoading, setIsLoading] = useState(false)

  const isFocused = useIsFocused()
  useEffect(() => {
    if (isFocused){
      getInitialData()
    }
  },[isFocused])
const getInitialData = async () => {
  setError(false)
}
const auth = getAuth();
  const upload = async (values) => {
    setIsLoading(true)
    const storage = getStorage();
    const filename = values.images.substring(values.images.lastIndexOf('/'))
    const StorageRef = sRef(storage, 'users/'+filename)
    const img = await fetch(values.images)
    const bytes = await img.blob()
    await uploadBytes(StorageRef, bytes)
    var URL = ""
    const DownloadRef = sRef(storage, 'users/'+filename )
    await getDownloadURL(DownloadRef).then((u) => {
        URL = u
        })
        .catch((e) => {
          console.log("Error: "+ e)
        })
        onRegister(values.email, values.password,values.name,URL)
        setIsLoading(false)
        Alert.alert('Email Verification', 'Email verification link has been sent to ' +values.email,[
          {text: 'Okay'},
          {text: 'Login', onPress:() => {
            navigation.navigate('Login')
           }} 
        ])
    }
  return (
    <>
    <Screen style={styles.container}>
      <View>
      <AppForm
        initialValues={{ name: "", email: "", password: "",images: ""}}
        onSubmit={(values) => {
          upload(values)
        }}
        validationSchema={validationSchema}
      >
         <FormImagePicker name="images" />
        <AppFormField
          autoCorrect={false}
          icon="account"
          name="name"
          placeholder="Name"
        />
        <AppFormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="email"
          keyboardType="email-address"
          name="email"
          placeholder="Email"
          textContentType="emailAddress"
        />
        <AppFormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="lock"
          name="password"
          placeholder="Password"
          secureTextEntry
          textContentType="password"
        />
        {error ?  (<Text style = {{color: 'red', marginLeft: 20, fontWeight: 'bold'}}>User already registered</Text>) : null}
        <SubmitButton title="Register" width = {"90%"} margin = {20} bgcolor = {'#16C79A'}/>
      </AppForm>
      </View>
      <View style = {{flexDirection:'row', alignSelf: 'center'}}>
        <Text>Already have an account? </Text>
         <Text onPress={() => {
          navigation.navigate('Login')
         }} 
         style = {{color: colors.primery}}>Login</Text>
        </View>
    </Screen>
    {isLoading ?  <AppLoader /> : null}
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F1F1',
    padding: 10,
  },
});

export default RegisterScreen;
