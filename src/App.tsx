import React, { useState, useEffect } from "react"
import "./App.css"

import firebase from "./api/firebase"

type User = {
  name: string
  watching: boolean
}

const App: React.FC = () => {
  const name = "Matteo"
  const [users, setUsers] = useState<Array<User>>([])
  const [selectedDuration, setSelectedDuration] = useState(0)

  const getUsers = async () => {
    const response = await firebase.get("users.json")
    setUsers(Object.values(response.data))
  }

  useEffect(() => {
    getUsers()
  })

  const toggleClass = (className = "selected", condition: boolean) => {
    return condition ? ` ${className}` : ""
  }

  return (
    <div className="App">
      <h1>Sei seduto al mio posto!</h1>
      <div id="tvs-container">
        {users.map((user) => {
          const isMe = name === user.name
          const watchingSentencte = isMe ? "stai guardando" : "sta guardando"

          return (
            <div
              key={user.name}
              className={
                "tv" +
                toggleClass("tv-watching", user.watching) +
                toggleClass("tv-mine", isMe)
              }
            >
              <div className="screen">
                <p>{isMe ? "Tu" : user.name}</p>
              </div>
              <div className="bottomBar">
                {user.watching ? watchingSentencte : "non " + watchingSentencte}
              </div>
            </div>
          )
        })}
      </div>
      <p>Ciao {name}, cosa vuoi vedere oggi?</p>
      <div id="episodes-container">
        {[
          { title: "Sitcom", duration: 20 },
          { title: "Puntata standard", duration: 40 },
          { title: "Puntata lunga", duration: 60 },
          { title: "Film", duration: 120 },
        ].map((episode) => {
          const selected = episode.duration === selectedDuration

          return (
            <div
              key={episode.title}
              className={"episode" + toggleClass("episode-selected", selected)}
              onClick={() => setSelectedDuration(episode.duration)}
            >
              <div className="title">
                <span>{episode.title}</span>
              </div>
              <div className="duration">~ {episode.duration} minuti</div>
            </div>
          )
        })}
      </div>
      <button id="start" disabled={selectedDuration === 0}>
        Comincia a guardare
      </button>
    </div>
  )
}

export default App
