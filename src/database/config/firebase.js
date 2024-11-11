import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyAu78taqzJ5bTyeZ5YLoA0zBfJFTG-Y7yc",
  authDomain: "nutria-unofficial.firebaseapp.com",
  projectId: "nutria-unofficial",
  storageBucket: "nutria-unofficial.firebasestorage.app",
  messagingSenderId: "1018138205626",
  appId: "1:1018138205626:web:0324ba08553142e30ed183",
  measurementId: "G-568G9NLRXE"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export default {app, analytics, auth}