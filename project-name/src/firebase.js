// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJmZbFJc5l5eET0T0JgjIWPIm-UaeaVdQ",
  authDomain: "websiteproject-cb618.firebaseapp.com",
  projectId: "websiteproject-cb618",
  storageBucket: "websiteproject-cb618.firebasestorage.app",
  messagingSenderId: "924450092972",
  appId: "1:924450092972:web:d15a42a34d2feeb78aac09",
  measurementId: "G-E9TKTWG5GQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);