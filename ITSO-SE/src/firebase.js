import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA9qzLL1o9V4cc8sYhqyInC8BSDxxeZ2wg",
  authDomain: "immacutech.firebaseapp.com",
  databaseURL: "https://immacutech-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "immacutech",
  storageBucket: "immacutech.firebasestorage.app",
  messagingSenderId: "737406616170",
  appId: "1:737406616170:web:85be4b0403e43e7802c013",
  measurementId: "G-CQ8N7TELR2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { storage,auth, db };
