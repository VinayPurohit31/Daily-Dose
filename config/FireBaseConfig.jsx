// Import the required Firebase functions
import { initializeApp} from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

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

const app = initializeApp(firebaseConfig);

export const auth= initializeAuth(app,{
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const db=getFirestore(app)
