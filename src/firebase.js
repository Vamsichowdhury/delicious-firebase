import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyB7he6svPYD64A-Gm9313OJVgINnorDEsY",
  authDomain: "smartmenufy.firebaseapp.com",
  projectId: "smartmenufy",
  storageBucket: "smartmenufy.appspot.com",
  messagingSenderId: "568575579832",
  appId: "1:568575579832:web:d20299171fddfee776064d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const firebaseAuth = getAuth(app);

export { db, collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, storage, ref, uploadBytes, getDownloadURL, firebaseAuth };
