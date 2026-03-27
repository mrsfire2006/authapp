// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "mernauth-212b7.firebaseapp.com",
  projectId: "mernauth-212b7",
  storageBucket: "mernauth-212b7.firebasestorage.app",
  messagingSenderId: "1038881657262",
  appId: "1:1038881657262:web:588f42d16e1ce01959b83f",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
