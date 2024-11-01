import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; //use Firebase Authentication service
import { getFirestore } from "firebase/firestore"; //use Firestore Database service (for structured data: RealTime data storage like user info/chat message..)
import { getStorage } from "firebase/storage"; //use Firestore Storage service (storing & serving larger files like images/videos/audio files...)

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
