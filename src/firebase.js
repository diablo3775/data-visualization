// Import the functions you need from the SDKs you need
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDm8NIwCEmZg59KHhFePXwgnq2z7PRNwmQ",
  authDomain: "data-visualization-3c45e.firebaseapp.com",
  projectId: "data-visualization-3c45e",
  storageBucket: "data-visualization-3c45e.firebasestorage.app",
  messagingSenderId: "988416482126",
  appId: "1:988416482126:web:8e6810cd5d16dd15bd9c1f",
  measurementId: "G-VH5E6TH1VZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { auth, db }
export default app;
