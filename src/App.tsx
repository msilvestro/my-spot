import React, { useState, useEffect } from "react"
import "./App.css"

import firebase from "./api/firebase"

interface Dictionary<T> {
  [key: string]: T
}

interface User {
  name: string
  watching: boolean
}

const App: React.FC = () => {
  const myId = "matteo"
  const name = "Matteo"
  const [users, setUsers] = useState<Dictionary<User>>({})
  const [selectedDuration, setSelectedDuration] = useState(0)

  const getUsers = async () => {
    try {
      const response = await firebase.get("users.json")
      setUsers(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const updateWatching = async (watching: boolean) => {
    try {
      const response = await firebase.put(
        `users/${myId}/watching.json`,
        watching.toString()
      )
      console.log(response)
    } catch (error) {
      console.log(error)
    }
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
        {Object.values(users).map((user) => {
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

      {users[myId] && (
        <div>
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
                  className={
                    "episode" + toggleClass("episode-selected", selected)
                  }
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
          {!users[myId].watching ? (
            <button
              id="start"
              disabled={selectedDuration === 0}
              onClick={() => updateWatching(true)}
            >
              Comincia a guardare
            </button>
          ) : (
            <button id="stop" onClick={() => updateWatching(false)}>
              Interrompi
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default App
