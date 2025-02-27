// Import the required Firebase functions
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
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

// Check if Firebase is already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
