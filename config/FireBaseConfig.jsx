import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  initializeAuth, 
  getReactNativePersistence, 
  browserLocalPersistence 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAY5t3wRJA1TJNzBD4-L9jiz8hnS7qCqDU",
  authDomain: "daily-dose-b6bb1.firebaseapp.com",
  projectId: "daily-dose-b6bb1",
  storageBucket: "daily-dose-b6bb1.appspot.com",
  messagingSenderId: "452298291990",
  appId: "1:452298291990:web:d11a023669047ce738ee37",
  measurementId: "G-WN4MQBW2YT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Handle platform-specific persistence
const auth = Platform.OS === "web"
  ? getAuth(app)  // Use default auth for web
  : initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });

// Apply persistence settings for Web
if (Platform.OS === "web") {
  import("firebase/auth").then(({ setPersistence }) => {
    setPersistence(auth, browserLocalPersistence);
  });
}

// Firestore
const db = getFirestore(app);

export { auth, db };
