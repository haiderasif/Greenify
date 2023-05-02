import React from "react";
import { View } from "react-native";
import Lottie from 'lottie-react-native';


export const AppLoader = () => {
    return(
        <Lottie source={require('../../assets/appLoader.json')}
        autoPlay loop
        style = {{justifyContent: 'center', alignItems: 'center',backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 1}}
        />
    );
}