import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDl6BIImnZ9XNkndKg3WwR8NxV5HseKCMo",
  authDomain: "impact-production001.firebaseapp.com",
  projectId: "impact-production001",
  storageBucket: "impact-production001.firebasestorage.app",
  messagingSenderId: "990287436967",
  appId: "1:990287436967:web:953059deffba6544944f82",
  measurementId: "G-KTFHE4SNDQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };