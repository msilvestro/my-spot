import React, { FC } from "react"
import "./TV.css"

import { User, isWatching } from "../firebase/users"

import { toggleClass } from "../utils/css"

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

const beaufityTimeLeft = (user: User, currentTime: number) => {
  const secondsLeft = user.endTime - Math.floor(currentTime / 1000)
  const totalMinutesLeft = Math.ceil(secondsLeft / 60)
  const hoursLeft = Math.floor(totalMinutesLeft / 60)
  const minutesLeft = totalMinutesLeft - hoursLeft * 60
  return { hoursLeft, minutesLeft }
}

type Props = {
  user: User
  isMe: boolean
  currentTime: number
}

const TV: FC<Props> = ({ user, isMe, currentTime }: Props) => {
  const watchingSentence = isMe ? "stai guardando" : "sta guardando"
  const watching = isWatching(user, currentTime)
  const { hoursLeft, minutesLeft } = beaufityTimeLeft(user, currentTime)

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
            {hoursLeft > 0 ? formatTime(hoursLeft, "hours") : null}
            {minutesLeft > 0 && hoursLeft > 0 ? " e " : null}
            {minutesLeft > 0 ? formatTime(minutesLeft, "minutes") : null}{" "}
            mancant{hoursLeft + minutesLeft === 1 ? "e" : "i"}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export default TV
