import firebase from "firebase/app";
import "firebase/auth";

export const auth = firebase
  .initializeApp({
    apiKey: "AIzaSyAMqZ0EFJ2OW5H7lfRklLPi6R2GXlQRTs0",
    authDomain: "chatting-app-f24d5.firebaseapp.com",
    projectId: "chatting-app-f24d5",
    storageBucket: "chatting-app-f24d5.appspot.com",
    messagingSenderId: "970058000287",
    appId: "1:970058000287:web:eea0787e2749f953dcffaa",
  })
  .auth();
