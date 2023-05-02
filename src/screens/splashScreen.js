import React from "react";
import { ImageBackground, StyleSheet, Image, Text, View } from "react-native";
import AppButton from "../components/AppButton";

function Welcome({ navigation }) {
  return (
    <ImageBackground
      style={styles.background}
      source = {require('../../assets/green.jpg')}
      blurRadius= {10}
    >
      <View style={styles.alignitem}>
        <Image style={styles.logo} source={require("../../assets/logo1.jpg")} />
        <View style = {{top: 100}}>
        <View style = {{flexDirection:"row" , alignSelf: 'center'}}>
          <Text style = {{fontSize: 45, fontWeight: "bold"}}>Plant a </Text>
           <Text style = {{color: '#16C79A',fontSize: 45, fontWeight: "bold"}}>tree,</Text>
        </View>
        <View style = {{flexDirection:"row", alignSelf: 'center'}}>
          <Text  style = {{color: '#16C79A',fontSize: 45,fontWeight: "bold"}}>green </Text>
           <Text style = {{fontSize: 45,fontWeight: "bold"}}>the earth</Text>
        </View>
        </View>
      </View>
      <View style={styles.containerView}>
        <AppButton
          width = "90%"
          title="Sign in"
          bgcolor="#16C79A"
          onPress={() => navigation.navigate('Login')}
        />
        <AppButton
          width = "90%"
          title="Create Account"
          bgcolor="#F8F1F1"
          textcol="black"
          onPress={() => navigation.navigate('Register')}
        />
      </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#F8F1F1',
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 300,
    height: 250,
    top: 30,
  },
  containerView: {
    flex: 1,
    padding: 20,
    width: "100%",
    justifyContent: "flex-end",
  },
  alignitem: {
    flex: 1,
    position: "relative",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  tag: {
    fontSize: 25,
    fontWeight: "600",
  },
});
export default Welcome;
