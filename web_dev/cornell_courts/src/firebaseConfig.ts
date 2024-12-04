// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkpiTFsQS78k1owPHf_5m0HtUZ5MF5a_0",
  authDomain: "cornellcourts-1b1a0.firebaseapp.com",
  projectId: "cornellcourts-1b1a0",
  storageBucket: "cornellcourts-1b1a0.firebasestorage.app",
  messagingSenderId: "665158821593",
  appId: "1:665158821593:web:1be5ea84f1ec78c77500c8",
  measurementId: "G-PC9CESF0R1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

export { auth, db };