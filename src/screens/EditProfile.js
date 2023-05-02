import React, {useContext, useState} from "react";
import { StyleSheet,Text, ScrollView } from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import AppForm from "../components/forms/AppForm";
import AppFormField from "../components/forms/AppFormField";
import SubmitButton from "../components/forms/SubmitButton";
import { AuthenticationContext } from "../services/authentication/authentication.context";
import FormImagePicker from "../components/forms/FormImagePicker";
import {getStorage, uploadBytes,ref as sRef, getDownloadURL} from 'firebase/storage'
import { getAuth,updateProfile,updateEmail,reauthenticateWithCredential, signInWithEmailAndPassword } from "firebase/auth";
import AppButton from "../components/AppButton";
import colors from "../styles/colors";


const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
  images: Yup.string().required().label("Image"),
});
function EditProfile({navigation}) {
const auth = getAuth();
const user = auth.currentUser
const {setIsAuthenticated} = useContext(AuthenticationContext)
const [Error,setError] = useState(false)
  return (
    <>
    <ScrollView>
    <Screen style={styles.container}>
      <AppForm
        initialValues={{ name: user.displayName, email: user.email, password: user.password,images: user.photoURL}}
        onSubmit={(values) => {
            signInWithEmailAndPassword(auth, user.email, values.password)
            .then((u) => {
            setError(false)
            updateEmail(u.user,values.email)
            updateProfile(u.user,{
              displayName: values.name
            })
            alert('Updated')
        })
        .catch(() => {
          setError(true)
        })
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
        <SubmitButton title="Update" width = {"90%"} bgcolor = {'#16C79A'}/>
        <AppButton
          width = "90%"
          title="Delete User"
          bgcolor="red"
          textcol="white"
          onPress={() => navigation.navigate('Delete User')}
        />
      </AppForm>
      {Error ? (<Text style= {{marginLeft: 20, color: 'red', fontWeight: 'bold'}}>Wrong Email/Password</Text>) : (null)}
    </Screen>
    </ScrollView>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default EditProfile;
