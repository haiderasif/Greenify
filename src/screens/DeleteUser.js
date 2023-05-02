import React, {useContext, useState} from "react";
import { StyleSheet,Text, ScrollView } from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import AppForm from "../components/forms/AppForm";
import AppFormField from "../components/forms/AppFormField";
import SubmitButton from "../components/forms/SubmitButton";
import { AuthenticationContext } from "../services/authentication/authentication.context";
import FormImagePicker from "../components/forms/FormImagePicker";
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import {getStorage,ref as Sref,deleteObject} from 'firebase/storage'
import { getAuth, signInWithEmailAndPassword, deleteUser } from "firebase/auth";
import { AppLoader } from "../components/AppLoader";
import AppButton from "../components/AppButton";
import colors from "../styles/colors";


const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
});
function DeleteUser({navigation}) {
const auth = getAuth();
const user = auth.currentUser
const {setIsAuthenticated} = useContext(AuthenticationContext)
const [Error,setError] = useState(false)
const db = getDatabase();
const storage = getStorage();
const [isLoading, setIsLoading] = useState(false)
const deleteUser = async (values) => {
  signInWithEmailAndPassword(auth, values.email, values.password)
            .then((u) => {
              setIsLoading(true)
                setError(false)
                const campaignUserRef = ref(db, 'CampaignList/' + u.user.uid);
                remove(campaignUserRef)
                const campaignRef = ref(db, 'Campaign/');
                  onValue(campaignRef, snapshot => {
                    snapshot.forEach((data) => {
                      let result = data.val()
                      if(result.userId == u.user.uid)
                      {
                      result["key"]  = data.key;  
                      const filename = result.imageUrl.substring(result.imageUrl.lastIndexOf('F')+1,result.imageUrl.lastIndexOf('?alt'))
                      const desertRef = Sref(storage, 'Campaign/'+filename);
                      deleteObject(desertRef)
                      const deleteCampaign = ref(db, 'Campaign/'+result.key)
                      remove(deleteCampaign)
                      }
                    })
                  })
                  const listingRef = ref(db, 'listing/');
                  onValue(listingRef, snapshot => {
                    snapshot.forEach((data) => {
                      let result = data.val()
                      if(result.userId == u.user.uid)
                      {
                      result["key"]  = data.key;  
                      const filename = result.imageUrl.substring(result.imageUrl.lastIndexOf('F')+1,result.imageUrl.lastIndexOf('?alt'))
                      const desertRef = Sref(storage, 'listing/'+filename);
                      deleteObject(desertRef)
                      const deletelisting = ref(db, 'listing/'+result.key)
                      remove(deletelisting)
                      }
                    })
                  })
                  const userRef = ref(db, 'User/');
                  onValue(userRef, snapshot => {
                    snapshot.forEach((data) => {
                      let result = data.val()
                      if(result.UserId == u.user.uid)
                      {
                      result["key"]  = data.key;  
                      const filename = result.Picture.substring(result.Picture.lastIndexOf('F')+1,result.Picture.lastIndexOf('?alt'))
                      const desertRef = Sref(storage, 'users/'+filename);
                      deleteObject(desertRef)
                      const deleteuser = ref(db, 'User/'+result.key)
                      remove(deleteuser)
                      }
                    })
                  })
                  setIsLoading(false)
                   deleteUser(u.user).then(() => {
                   setIsAuthenticated(false)
                   })
        })
        .catch((e) => {
            console.log(e);
          setError(true)
          setIsLoading(false)
        })

}
  return (
    <>
    <ScrollView>
    <Screen style={styles.container}>
        <Text style = {{marginLeft: 20, fontSize: 25, paddingBottom: 10}}>Delete User?</Text>
      <AppForm
        initialValues={{  email:"", password:""}}
        onSubmit={(values) => {
          deleteUser(values)
            
        }}
        validationSchema={validationSchema}
      >
       
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
        <SubmitButton title="Delete" width = {"90%"} bgcolor = {'red'}/>
      </AppForm>
      {Error ? (<Text style= {{marginLeft: 20, color: 'red', fontWeight: 'bold'}}>Wrong Email/Password</Text>) : (null)}
    </Screen>
    </ScrollView>
    {isLoading ?  <AppLoader /> : null}
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 10
  },
});

export default DeleteUser;
