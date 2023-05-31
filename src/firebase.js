import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDa1l0FmitwDWKJcE9zsvQF80sU2z_8sXA",
  authDomain: "veryintersting.firebaseapp.com",
  projectId: "veryintersting",
  storageBucket: "veryintersting.appspot.com",
  messagingSenderId: "98772716473",
  appId: "1:98772716473:web:eb5f6bbf0052a189364468",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
