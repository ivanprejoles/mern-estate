// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-12d5b.firebaseapp.com",
  projectId: "mern-estate-12d5b",
  storageBucket: "mern-estate-12d5b.appspot.com",
  messagingSenderId: "354622255179",
  appId: "1:354622255179:web:91fd5f31627f5e48b35dce"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);