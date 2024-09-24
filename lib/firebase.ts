// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDTZre75b4R7jnuTjNhbJPThP2asqv0msw",
    authDomain: "socratic-solver.firebaseapp.com",
    projectId: "socratic-solver",
    storageBucket: "socratic-solver.appspot.com",
    messagingSenderId: "287495215295",
    appId: "1:287495215295:web:e80d1d217c2b35b406ce0a",
    measurementId: "G-QHKTKWSLSF"
  };
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
