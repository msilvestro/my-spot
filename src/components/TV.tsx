import React, { FC } from "react"
import "./TV.css"

import { User, isWatching } from "../firebase/users"

import { toggleClass } from "../utils/css"
import { declineTime } from "../utils/time"

const formatTime = (amount: number, type: "minutes" | "hours") => {
  return (
    <>
      <b>{amount}</b> {declineTime(amount, type)}
    </>
  )
}

const beaufityTimeDiff = (user: User, currentTime: number) => {
  if (!user.endTime) {
    return { sign: 0, hoursDiff: 0, minutesDiff: 0 }
  }
  const sign = Math.sign(user.endTime - Math.floor(currentTime / 1000))
  const secondsDiff = Math.abs(user.endTime - Math.floor(currentTime / 1000))
  const totalMinutesDiff =
    sign > 0 ? Math.ceil(secondsDiff / 60) : Math.floor(secondsDiff / 60)
  const hoursDiff = Math.floor(totalMinutesDiff / 60)
  const minutesDiff = totalMinutesDiff - hoursDiff * 60
  return { sign, hoursDiff, minutesDiff }
}

type Props = {
  user: User
  isMe: boolean
  currentTime: number
}

const TV: FC<Props> = ({ user, isMe, currentTime }: Props) => {
  const watchingSentence = isMe ? "stai guardando" : "sta guardando"
  const watching = isWatching(user, currentTime)
  const { sign, hoursDiff, minutesDiff } = beaufityTimeDiff(user, currentTime)

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
            {sign <= 0 && "finito "}
            {hoursDiff > 0 ? formatTime(hoursDiff, "hours") : null}
            {minutesDiff > 0 && hoursDiff > 0 ? " e " : null}
            {minutesDiff >= 0 ? formatTime(minutesDiff, "minutes") : null}{" "}
            {sign > 0
              ? `mancant${hoursDiff + minutesDiff === 1 ? "e" : "i"}`
              : "fa"}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export default TV
