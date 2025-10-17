// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7cLsV1ROfalgYouY5_h5K8DTyoUsH_O8",
  authDomain: "pharmida-healthcare.firebaseapp.com",
  projectId: "pharmida-healthcare",
  storageBucket: "pharmida-healthcare.firebasestorage.app",
  messagingSenderId: "998490085971",
  appId: "1:998490085971:web:11f09b6132d3ec731ac4a6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;