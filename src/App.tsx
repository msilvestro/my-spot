import React, { useState, useEffect, FC } from "react"
import "./App.css"

import { provider, auth, database } from "./firebase"
import { User, isWatching, setEndTime } from "./firebase/users"

import CollapsibleDiv from "./components/CollapsibleDiv"
import TV from "./components/TV"

import { toggleClass } from "./utils/css"

type Dictionary<T> = {
  [key: string]: T
}

const MAX_WATCHING_COUNT = 2

const App: FC = () => {
  const [users, setUsers] = useState<Dictionary<User>>({})
  const [selectedDuration, setSelectedDuration] = useState(0)
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [loadingData, setLoadingData] = useState(true)
  const [myEmail, setMyEmail] = useState<null | string>(null)
  const [time, setTime] = useState(Date.now())
  const [customDuration, setCustomDuration] = useState(30)

  const updateWatching = async (userId: string, duration: number) => {
    setEndTime(userId, duration).then(() => setTime(Date.now()))
  }

  const watchingCount = Object.values(users).filter((user) =>
    isWatching(user, time)
  ).length

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setLoadingAuth(false)
      if (user) {
        setMyEmail(user.email)
        database.ref("users").on("value", (snapshot) => {
          setLoadingData(false)
          const users = snapshot.val()
          setUsers(users)
        })
      }
    })
    const interval = setInterval(() => setTime(Date.now()), 1000 * 60)
    return () => {
      clearInterval(interval)
    }
  }, [])

  if (loadingAuth) {
    return (
      <div className="App">
        <h1>Sei seduto al mio posto!</h1>
        <div>Sto controllando se sei autenticato...</div>
      </div>
    )
  }

  if (!myEmail) {
    return (
      <div className="App">
        <h1>Sei seduto al mio posto!</h1>
        <div id="message">
          <button
            onClick={() => {
              auth.signInWithPopup(provider).catch(function (error) {
                // Handle Errors here.
                console.log(error.code)
                console.log(error.message)
                // The email of the user's account used.
                console.log(error.email)
              })
            }}
          >
            Login via Google
          </button>
        </div>
      </div>
    )
  }

  if (loadingData) {
    return (
      <div className="App">
        <h1>Sei seduto al mio posto!</h1>
        <div>Caricamento in corso...</div>
      </div>
    )
  }

  const myId = Object.keys(users).find(
    (id) => users[id].email === myEmail || users[id].emailAlt === myEmail
  )

  if (!myId) {
    return (
      <div className="App">
        <h1>Sei seduto al mio posto!</h1>
        <div>Non sei autorizzato ad accedere.</div>
      </div>
    )
  }

  return (
    <div className="App">
      <h1>Sei seduto al mio posto!</h1>
      <div id="watching-count">
        <p>
          <span
            className={toggleClass("red", watchingCount > MAX_WATCHING_COUNT)}
          >
            {watchingCount}
          </span>{" "}
          / {MAX_WATCHING_COUNT}
        </p>
        <p>in uso</p>
      </div>
      <div id="tvs-container">
        {Object.keys(users).map((userId) => (
          <TV
            key={userId}
            user={users[userId]}
            isMe={userId === myId}
            currentTime={time}
          />
        ))}
      </div>

      {myId && (
        <div>
          {!isWatching(users[myId], time) ? (
            <button
              id="start"
              disabled={selectedDuration === 0}
              onClick={() => updateWatching(myId, selectedDuration)}
            >
              Comincia a guardare
            </button>
          ) : (
            <button id="stop" onClick={() => updateWatching(myId, 0)}>
              Interrompi
            </button>
          )}
          <CollapsibleDiv
            id="start-watching"
            condition={!isWatching(users[myId], time)}
          >
            <p id="greetings">
              Ciao <b>{users[myId].name}</b>, cosa vuoi vedere oggi?
            </p>
            <div id="episodes-container">
              <div
                className={
                  "episode" +
                  toggleClass("episode-selected", selectedDuration === 0)
                }
                onClick={() => setSelectedDuration(0)}
              >
                <div className="title">
                  <span>Personalizzato</span>
                </div>
                <div className="duration">~ {customDuration} minuti</div>
              </div>
              <div className="episode-customizer">
                <input
                  type="range"
                  min="1"
                  max="180"
                  value={customDuration}
                  onChange={(e) => setCustomDuration(parseInt(e.target.value))}
                />
                <input
                  type="number"
                  step="1"
                  min="1"
                  max="180"
                  value={customDuration}
                  onChange={(e) => setCustomDuration(parseInt(e.target.value))}
                />
              </div>
              {[
                { title: "Sitcom", duration: 25 },
                { title: "Puntata standard", duration: 45 },
                { title: "Puntata lunga", duration: 60 },
                { title: "Film standard", duration: 120 },
                { title: "Film lungo", duration: 180 },
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
          </CollapsibleDiv>
        </div>
      )}
    </div>
  )
}

export default App
