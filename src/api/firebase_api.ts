import axios from "axios"

const firebase_api = axios.create({
  baseURL: process.env.REACT_APP_FIREBASE_URL,
})

export default firebase_api
