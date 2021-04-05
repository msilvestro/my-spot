import React, { useState, useEffect, FC } from "react"
import "./App.css"

import { provider, auth, database } from "./firebase"

import CollapsibleDiv from "./components/CollapsibleDiv"

type Dictionary<T> = {
  [key: string]: T
}

type User = {
  name: string
  end_time: number
  email: string
  emailAlt?: string
}

const App: FC = () => {
  const [users, setUsers] = useState<Dictionary<User>>({})
  const [selectedDuration, setSelectedDuration] = useState(0)
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [loadingData, setLoadingData] = useState(true)
  const [myEmail, setMyEmail] = useState<null | string>(null)
  const [time, setTime] = useState(Date.now())

  const updateWatching = async (duration: number) => {
    database
      .ref(`users/${myId}/end_time`)
      .set(Math.floor(Date.now() / 1000) + duration * 60)
    setTime(Date.now())
  }

  const getRemainingSeconds = (user: User) => {
    const remainingSeconds = user.end_time - Math.floor(time / 1000)
    return remainingSeconds
  }

  const isWatching = (user: User) => {
    return getRemainingSeconds(user) > 0
  }

  const formatTime = (amount: number, type: "minutes" | "hours") => {
    const timeTranslation = {
      minutes: ["minuto", "minuti"],
      hours: ["ora", "ore"],
    }
    const [singular, plural] = timeTranslation[type]
    return (
      <>
        <b>{amount}</b> {amount === 1 ? singular : plural}
      </>
    )
  }

  const getRemainingParagraph = (remainingSeconds: number) => {
    const totalRemainingMinutes = Math.ceil(remainingSeconds / 60)
    const remainingHours = Math.floor(totalRemainingMinutes / 60)
    const remainingMinutes = totalRemainingMinutes - remainingHours * 60
    return (
      <p>
        {remainingHours > 0 ? formatTime(remainingHours, "hours") : null}
        {remainingMinutes > 0 && remainingHours > 0 ? " e " : null}
        {remainingMinutes > 0
          ? formatTime(remainingMinutes, "minutes")
          : null}{" "}
        mancant{remainingHours + remainingMinutes === 1 ? "e" : "i"}
      </p>
    )
  }

  const toggleClass = (className = "selected", condition: boolean) => {
    return condition ? ` ${className}` : ""
  }

  const watchingCount = Object.values(users).filter((user) => isWatching(user))
    .length
  const maxWatchingCount = 2

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
            className={toggleClass("red", watchingCount > maxWatchingCount)}
          >
            {watchingCount}
          </span>{" "}
          / {maxWatchingCount}
        </p>
        <p>in uso</p>
      </div>
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

                {watching
                  ? getRemainingParagraph(getRemainingSeconds(user))
                  : null}
              </div>
            </div>
          )
        })}
      </div>

      {myId && (
        <div>
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
          <CollapsibleDiv
            id="start-watching"
            condition={!isWatching(users[myId])}
          >
            <p id="greetings">
              Ciao <b>{users[myId].name}</b>, cosa vuoi vedere oggi?
            </p>
            <div id="episodes-container">
              {[
                { title: "Sitcom", duration: 25 },
                { title: "Puntata standard", duration: 45 },
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
          </CollapsibleDiv>
        </div>
      )}
    </div>
  )
}

export default App
