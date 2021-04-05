// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import firebase from "firebase/app"

// Add the Firebase services that you want to use
import "firebase/auth"
import "firebase/database"

// Import Firebase configuration
import { firebaseConfig } from "./firebaseConfig"

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
firebase.auth().languageCode = "it"

export const provider = new firebase.auth.GoogleAuthProvider()
export const auth = firebase.auth()
export const database = firebase.database()
