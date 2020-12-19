import React, { useState, useEffect } from "react"
import "./App.css"

import firebase from "./api/firebase"

type Dictionary<T> = {
  [key: string]: T
}

type User = {
  name: string
  end_time: number
}

const App: React.FC = () => {
  const myId = "matteo"
  const [users, setUsers] = useState<Dictionary<User>>({})
  const [selectedDuration, setSelectedDuration] = useState(0)

  const getUsers = async () => {
    try {
      const response = await firebase.get<Dictionary<User>>("users.json")
      setUsers(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const updateWatching = async (duration: number) => {
    try {
      const response = await firebase.put<boolean>(
        `users/${myId}/end_time.json`,
        Math.floor(Date.now() / 1000) + duration * 60
      )
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  const getRemaining = (
    user: User,
    type: "seconds" | "minutes" = "seconds"
  ) => {
    const remainingSeconds = user.end_time - Math.floor(Date.now() / 1000)
    switch (type) {
      case "seconds":
        return remainingSeconds
      case "minutes":
        return Math.ceil(remainingSeconds / 60)
    }
  }

  const isWatching = (user: User) => {
    return getRemaining(user, "seconds") > 0
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
        {Object.keys(users).map((userId) => {
          const user = users[userId]
          const isMe = userId === myId
          const watchingSentence = isMe ? "stai guardando" : "sta guardando"
          const watching = isWatching(user)

          return (
            <div
              key={user.name}
              className={
                "tv" +
                toggleClass("tv-watching", watching) +
                toggleClass("tv-mine", isMe)
              }
            >
              <div className="screen">
                <p>{isMe ? "Tu" : user.name}</p>
              </div>
              <div className="bottomBar">
                <p>{watching ? watchingSentence : "non " + watchingSentence}</p>

                {watching ? (
                  <p>
                    mancano <b>{getRemaining(user, "minutes")}</b> minuti
                  </p>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>

      {users[myId] && (
        <div>
          <p>
            Ciao <b>{users[myId].name}</b>, cosa vuoi vedere oggi?
          </p>
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
          {!isWatching(users[myId]) ? (
            <button
              id="start"
              disabled={selectedDuration === 0}
              onClick={() => updateWatching(selectedDuration)}
            >
              Comincia a guardare
            </button>
          ) : (
            <button id="stop" onClick={() => updateWatching(0)}>
              Interrompi
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default App
