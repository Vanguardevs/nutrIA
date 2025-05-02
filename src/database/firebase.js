import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, browserLocalPersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAu78taqzJ5bTyeZ5YLoA0zBfJFTG-Y7yc",
  authDomain: "nutria-unofficial.firebaseapp.com",
  databaseURL: "https://nutria-unofficial-default-rtdb.firebaseio.com",
  projectId: "nutria-unofficial",
  storageBucket: "nutria-unofficial.firebasestorage.app",
  messagingSenderId: "1018138205626",
  appId: "1:1018138205626:web:0324ba08553142e30ed183",
  measurementId: "G-568G9NLRXE"
};

const app = initializeApp(firebaseConfig);


//Modo Site
 const auth = initializeAuth(app, {
    persistence: browserLocalPersistence,
  });

// Modo Mobile
// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage),
// });

export { app, auth };