import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDOztJ3rCfOUIY-dFQ6LKW69N_oLDBGPT8",
  authDomain: "euro-feather.firebaseapp.com",
  projectId: "euro-feather",
  storageBucket: "euro-feather.firebasestorage.app",
  messagingSenderId: "248652066938",
  appId: "1:248652066938:web:f6df6ff86551419171cbc3",
  measurementId: "G-DHS5MXMVTP"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);