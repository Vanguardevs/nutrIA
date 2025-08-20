import * as firebaseApp from "firebase/app";
import * as firebaseAuth from "firebase/auth";
import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

let getReactNativePersistence: ((storage: any) => any) | undefined;

try {
  // Use require to avoid bundler issues; the module may not be present in some setups.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const rn = require("firebase/auth/react-native");
  if (rn && typeof rn.getReactNativePersistence === "function") {
    getReactNativePersistence = rn.getReactNativePersistence;
  }
} catch (e) {
  // Module not available or different SDK version — will fall back below.
}

const firebaseConfig = {
  apiKey: "AIzaSyD_XRGEfu32U4V1GIawL_CBvivf2CYeNmQ",
  authDomain: "nutria-eafaa.firebaseapp.com",
  projectId: "nutria-eafaa",
  storageBucket: "nutria-eafaa.firebasestorage.app",
  messagingSenderId: "697528025140",
  appId: "1:697528025140:web:239547cb5c4db250884a61",
  measurementId: "G-S784H05KTT",
};

const app: FirebaseApp = firebaseApp.initializeApp(firebaseConfig);

let auth: Auth;
if (Platform.OS === "web") {
  auth = firebaseAuth.getAuth(app);
  // Ensure browser persistence on web
  firebaseAuth.setPersistence(auth, firebaseAuth.browserLocalPersistence).catch((e) => {
    console.warn("[Firebase] Failed to set browser persistence:", e);
  });
} else {
  // React Native (iOS/Android)
  // initializeAuth may not exist in some SDK builds; getReactNativePersistence may also be undefined.
  const initAuthFn = (firebaseAuth as any).initializeAuth;
  if (typeof initAuthFn === "function") {
    if (getReactNativePersistence) {
      auth = initAuthFn(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    } else {
      console.warn("[Firebase] react-native persistence not available; initializing auth without persistence.");
      auth = initAuthFn(app);
    }
  } else {
    // Fallback: use getAuth if initializeAuth isn't present.
    console.warn(
      "[Firebase] initializeAuth not available; falling back to getAuth(). Persistence may be limited.",
    );
    auth = firebaseAuth.getAuth(app);
  }
}

export { app, auth };
