import React, {useContext, useEffect} from "react";
import { StyleSheet, Image,Text,View, TouchableOpacity } from "react-native";
import * as Yup from "yup";
import Screen from "../components/Screen";
import { AppForm, AppFormField, SubmitButton } from "../components/forms/index";
import { AuthenticationContext } from "../services/authentication/authentication.context";
import { AppLoader } from "../components/AppLoader";
import { useIsFocused } from "@react-navigation/native";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
});

function ForgetPassword({navigation}) {
  const {forgetPassord,isLoading,error,setError} = useContext(AuthenticationContext)
  const initialvalues = {
    email: "", 
  }
  const isFocused = useIsFocused()
  useEffect(() => {
    if (isFocused){
      getInitialData()
    }
  },[isFocused])
const getInitialData = async () => {
  setError(false)
}
  return (
    <>
    <Screen style={styles.container}>
      <View style = {{paddingTop: 60}}>
      <AppForm
        initialValues={initialvalues}
        onSubmit={(values) => {
            forgetPassord(values.email)
        }}
        validationSchema={validationSchema}
      >
        <Text style = {{marginLeft: 20, fontSize: 25, paddingBottom: 10}}>Forgot Password?</Text>
        <AppFormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="email"
          keyboardType="email-address"
          name="email"
          placeholder="Email"
          textContentType="emailAddress"
        />
        {error ?  (<Text style = {{color: 'red', marginLeft: 20, fontWeight: 'bold'}}>User not found</Text>) : null}
        <SubmitButton title={"Send email"} width = {"90%"} bgcolor = {'#16C79A'}/>
      </AppForm>
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

export default ForgetPassword;
