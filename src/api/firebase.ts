import axios from "axios"

const firebase = axios.create({
  baseURL: process.env.REACT_APP_FIREBASE_URL,
})

export default firebase
