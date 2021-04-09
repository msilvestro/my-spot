import React, { FC } from "react"
import "./RunningTimeButton.css"

import { toggleClass } from "../utils/css"
import { declineTime } from "../utils/time"

type Props = {
  title: string
  runningTime: number
  selected: boolean
  setSelected(): void
}

const RunningTimeButton: FC<Props> = ({
  title,
  runningTime,
  selected,
  setSelected,
}: Props) => {
  return (
    <div
      className={"episode" + toggleClass("episode-selected", selected)}
      onClick={() => setSelected()}
    >
      <div className="title">
        <span>{title}</span>
      </div>
      <div className="runningTime">
        ~ {runningTime} {declineTime(runningTime, "minutes")}
      </div>
    </div>
  )
}

export default RunningTimeButton
