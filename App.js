import { getApps, initializeApp } from "firebase/app";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { Navigator } from './src/infrastructure/index';
import { AuthenticationContextProvider } from "./src/services/authentication/authentication.context";
import { FirebaseContextProvider } from "./src/services/FirebaseData";
import { LogBox } from 'react-native';


const InitializeFirebase = {
  apiKey: "AIzaSyC2pCHeKeHnoqLoEGVzCAd9RdCUv0F7EvA",
  authDomain: "greenifyfinal-3819e.firebaseapp.com",
  databaseURL: "https://greenifyfinal-3819e-default-rtdb.firebaseio.com",
  projectId: "greenifyfinal-3819e",
  storageBucket: "greenifyfinal-3819e.appspot.com",
  messagingSenderId: "631489850109",
  appId: "1:631489850109:web:cd221c1d657f588183ac94",
  measurementId: "G-2SMM5VS9VK"
};

if(!getApps.length){
  initializeApp(InitializeFirebase)
}

export default function App() {
  LogBox.ignoreAllLogs()
  return (
   <>
   <FirebaseContextProvider>
   <AuthenticationContextProvider>
      <Navigator />
    </AuthenticationContextProvider>
    </FirebaseContextProvider>
      <ExpoStatusBar style="auto" />
    </>
  );
}

