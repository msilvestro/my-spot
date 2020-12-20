// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import firebase from "firebase/app"

// Add the Firebase services that you want to use
import "firebase/auth"
import "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyAVw0U7w8OMQ5HoZDu7FXh7VIWEYfjiTH0",
  authDomain: "my-netflix-spot.firebaseapp.com",
  databaseURL: "https://my-netflix-spot-default-rtdb.firebaseio.com",
  projectId: "my-netflix-spot",
  storageBucket: "my-netflix-spot.appspot.com",
  messagingSenderId: "4704680775",
  appId: "1:4704680775:web:01008bbcf30cfc84af6a62",
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

firebase.auth().languageCode = "it"
export const provider = new firebase.auth.GoogleAuthProvider()

export default firebase
