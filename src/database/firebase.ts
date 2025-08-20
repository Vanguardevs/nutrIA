import { initializeApp, FirebaseApp } from "firebase/app";
import { initializeAuth, browserLocalPersistence, getAuth, setPersistence, Auth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

let getReactNativePersistence: ((storage: any) => any) | undefined;

try {
  const rn = require("firebase/auth/react-native");
  getReactNativePersistence = rn.getReactNativePersistence;
} catch (e) {}

const firebaseConfig = {
  apiKey: "AIzaSyD_XRGEfu32U4V1GIawL_CBvivf2CYeNmQ",
  authDomain: "nutria-eafaa.firebaseapp.com",
  projectId: "nutria-eafaa",
  storageBucket: "nutria-eafaa.firebasestorage.app",
  messagingSenderId: "697528025140",
  appId: "1:697528025140:web:239547cb5c4db250884a61",
  measurementId: "G-S784H05KTT",
};

const app: FirebaseApp = initializeApp(firebaseConfig);

let auth: Auth;
if (Platform.OS === "web") {
  auth = getAuth(app);
  // Ensure browser persistence on web
  setPersistence(auth, browserLocalPersistence).catch((e) => {
    console.warn("[Firebase] Failed to set browser persistence:", e);
  });
} else {
  // React Native (iOS/Android)
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

export { app, auth };
