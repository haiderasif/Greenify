import React, {useContext} from 'react'
import { AppNavigator } from "./app.navigator";
import { View,Text } from 'react-native';
import AuthNavigator from './auth.navigator';
import { NavigationContainer } from '@react-navigation/native';
import { AuthenticationContext } from "../services/authentication/authentication.context";
export const Navigator = () => {
    const {isauthenticated} = useContext(AuthenticationContext)
    return ( 
        <NavigationContainer>
            {isauthenticated ? <AppNavigator /> : (<AuthNavigator />)}
        </NavigationContainer>
)
}