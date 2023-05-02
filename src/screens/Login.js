import React, {useContext, useEffect} from "react";
import { StyleSheet, Image,Text,View, TouchableOpacity } from "react-native";
import * as Yup from "yup";
import Screen from "../components/Screen";
import { AppForm, AppFormField, SubmitButton } from "../components/forms/index";
import { AuthenticationContext } from "../services/authentication/authentication.context";
import colors from "../styles/colors";
import { AppLoader } from "../components/AppLoader";
import { useIsFocused } from "@react-navigation/native";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

function LoginScreen({navigation}) {
  const {onLogin,isLoading,error,setError,verified, setVerified} = useContext(AuthenticationContext)
  const initialvalues = {
    email: "haiderasif70@gmail.com", 
    password: "Locallogin123",
  }
  const isFocused = useIsFocused()
  useEffect(() => {
    if (isFocused){
      getInitialData()
    }
  },[isFocused])
const getInitialData = async () => {
  setError(false)
  setVerified(true)
}
  return (
    <>
    <Screen style={styles.container}>
      <Image style={styles.logo} source={require("../../assets/greenify-01.png")} />
      <View style = {{paddingTop: 60}}>
      <AppForm
        initialValues={initialvalues}
        onSubmit={(values,) => {
          onLogin(values.email, values.password)
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
          placeholder="Password"
          name={"password"}
          secureTextEntry
          textContentType="password"
        />
        {error ?  (<Text style = {{color: 'red', marginLeft: 20, fontWeight: 'bold'}}>Wrong email/password</Text>) : null}
        {!verified ? (<Text style = {{color: 'red', marginLeft: 20, fontWeight: 'bold'}}>Please verify your email and try again</Text>) : null}
        <SubmitButton title={"Login"} width = {"90%"} bgcolor = {'#16C79A'}/>
        <View style = {{marginLeft: 20}}>
         <Text onPress={() => {
          navigation.navigate('ForgetPassword')
         }} 
         style = {{color: colors.primery}}>Forgot your password?</Text>
        </View>
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
  logo: {
    width: 200,
    height: 230,
    alignSelf: "center",
    marginTop: 50,
  },
});

export default LoginScreen;
