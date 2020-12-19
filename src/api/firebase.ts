import axios from "axios"

const firebase = axios.create({
  baseURL: "https://my-spot-b5bc1-default-rtdb.firebaseio.com",
})

export default firebase
