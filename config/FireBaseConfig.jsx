// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAY5t3wRJA1TJNzBD4-L9jiz8hnS7qCqDU",
  authDomain: "daily-dose-b6bb1.firebaseapp.com",
  projectId: "daily-dose-b6bb1",
  storageBucket: "daily-dose-b6bb1.firebasestorage.app",
  messagingSenderId: "452298291990",
  appId: "1:452298291990:web:d11a023669047ce738ee37",
  measurementId: "G-WN4MQBW2YT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth(app);