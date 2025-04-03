import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDXUMv86rcbH3PRn_c9C4s6WiSLfGwFdQc",
    authDomain: "kanban-board-rudadron.firebaseapp.com",
    projectId: "kanban-board-rudadron",
    storageBucket: "kanban-board-rudadron.firebasestorage.app",
    messagingSenderId: "15485576277",
    appId: "1:15485576277:web:b27e182820bd7e2e37a0dc",
    measurementId: "G-RZXG786RNP"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot };