import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, browserLocalPersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyD_XRGEfu32U4V1GIawL_CBvivf2CYeNmQ",
  authDomain: "nutria-eafaa.firebaseapp.com",
  projectId: "nutria-eafaa",
  storageBucket: "nutria-eafaa.firebasestorage.app",
  messagingSenderId: "697528025140",
  appId: "1:697528025140:web:239547cb5c4db250884a61",
  measurementId: "G-S784H05KTT"
};

const app = initializeApp(firebaseConfig);


//Modo Site
  const auth = initializeAuth(app, {
     persistence: browserLocalPersistence,
   });

// Modo Mobile
//  const auth = initializeAuth(app, {
//    persistence: getReactNativePersistence(AsyncStorage),
//  });

export { app, auth };