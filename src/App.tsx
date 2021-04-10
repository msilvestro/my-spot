import React, { useState, useEffect, FC } from "react"
import "./App.css"

import { provider, auth, database } from "./firebase"
import {
  User,
  isWatching,
  updateEndTime,
  updateCustomRunningTime,
  updateinfiniteReservation,
} from "./firebase/users"

import CollapsibleDiv from "./components/CollapsibleDiv"
import TV from "./components/TV"
import RunningTimeButton from "./components/RunningTimeButton"
import CustomRunningTimeButton from "./components/CustomRunningTimeButton"
import CustomSwitch from "./components/CustomSwitch"

import { toggleClass } from "./utils/css"

type Dictionary<T> = {
  [key: string]: T
}

enum EpisodeTitle {
  Customized = "Personalizzato",
  Sitcom = "Sitcom",
  StandardEpisode = "Puntata standard",
  LongEpisode = "Puntata lunga",
  StandardMovie = "Film standard",
  LongMovie = "Film lungo",
}

const MAX_WATCHING_COUNT = 2
const DEFAULT_CUSTOMIZED_RUNNING_TIME = 30

const App: FC = () => {
  const [users, setUsers] = useState<Dictionary<User>>({})
  const [selectedEpisode, setSelectedEpisode] = useState(
    EpisodeTitle.Customized
  )
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [loadingData, setLoadingData] = useState(true)
  const [myEmail, setMyEmail] = useState<null | string>(null)
  const [time, setTime] = useState(Date.now())

  const addMinutes = async (
    userId: string,
    minutesToAdd: number | null,
    startTime?: number
  ) => {
    const startTimeComplete = startTime || Math.floor(Date.now() / 1000)
    const newEndTime = minutesToAdd
      ? startTimeComplete + minutesToAdd * 60
      : null
    console.log(newEndTime)
    updateEndTime(userId, newEndTime).then(() => setTime(Date.now()))
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

  const getRunningTime = (episodeTitle: EpisodeTitle) => {
    switch (episodeTitle) {
      case EpisodeTitle.Sitcom:
        return 25
      case EpisodeTitle.StandardEpisode:
        return 45
      case EpisodeTitle.LongEpisode:
        return 60
      case EpisodeTitle.StandardMovie:
        return 120
      case EpisodeTitle.LongMovie:
        return 180
      case EpisodeTitle.Customized:
        return users[myId].customRunningTime || DEFAULT_CUSTOMIZED_RUNNING_TIME
    }
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
      <div
        style={{ marginTop: "20px", marginBottom: "20px" }}
        className="grid-container"
      >
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
              onClick={() => addMinutes(myId, getRunningTime(selectedEpisode))}
            >
              Comincia a guardare
            </button>
          ) : (
            <button id="stop" onClick={() => addMinutes(myId, null)}>
              Interrompi
            </button>
          )}
          <CollapsibleDiv
            id="start-watching"
            condition={isWatching(users[myId], time)}
          >
            <div style={{ marginBottom: "10px" }} className="grid-container">
              {[5, 10, 25, 45].map((minutes) => (
                <button
                  key={minutes}
                  onClick={() => {
                    const endTime = users[myId].endTime
                    if (endTime) {
                      addMinutes(myId, minutes, endTime)
                    }
                  }}
                >
                  +{minutes} minuti
                </button>
              ))}
            </div>
          </CollapsibleDiv>
          <CollapsibleDiv
            id="start-watching"
            condition={!isWatching(users[myId], time)}
          >
            <p id="greetings">
              Ciao <b>{users[myId].name}</b>, cosa vuoi vedere oggi?
            </p>
            <div className="grid-container">
              <CustomRunningTimeButton
                selected={selectedEpisode === EpisodeTitle.Customized}
                setSelected={() => setSelectedEpisode(EpisodeTitle.Customized)}
                defaultRunningTime={getRunningTime(EpisodeTitle.Customized)}
                updateRunningTime={(runningTime) =>
                  updateCustomRunningTime(myId, runningTime)
                }
              />
              {[
                EpisodeTitle.Sitcom,
                EpisodeTitle.StandardEpisode,
                EpisodeTitle.LongEpisode,
                EpisodeTitle.StandardMovie,
                EpisodeTitle.LongMovie,
              ].map((episodeTitle) => (
                <RunningTimeButton
                  key={episodeTitle}
                  title={episodeTitle}
                  runningTime={getRunningTime(episodeTitle)}
                  selected={episodeTitle === selectedEpisode}
                  setSelected={() => setSelectedEpisode(episodeTitle)}
                />
              ))}
            </div>
          </CollapsibleDiv>
        </div>
      )}
      <div id="bottom-settings">
        <CustomSwitch
          checked={users[myId].infiniteReservation === true}
          onChange={(checked) => {
            if (!isWatching(users[myId], time) && users[myId].endTime) {
              addMinutes(myId, null)
            }
            updateinfiniteReservation(myId, checked)
          }}
          title="Prenotazione illimitata"
          description="Continua la prenotazione finché non decidi di interromperla"
        />
      </div>
    </div>
  )
}

export default App
