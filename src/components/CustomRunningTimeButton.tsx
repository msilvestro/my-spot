import React, { FC, useState } from "react"
import "./RunningTimeButton.css"
import "./CustomRunningTimeButton.css"

import Icon from "./Icon"

import { toggleClass } from "../utils/css"
import { declineTime } from "../utils/time"

type Props = {
  selected: boolean
  setSelected(): void
  defaultRunningTime: number
  updateRunningTime(runningTime: number): void
}

const CustomRunningTimeButton: FC<Props> = ({
  selected,
  setSelected,
  defaultRunningTime,
  updateRunningTime,
}: Props) => {
  const [runningTime, setRunningTime] = useState(defaultRunningTime)
  const [configMode, setConfigMode] = useState(false)
  const [isInputInvalid, setIsInputInvalid] = useState(false)

  const handleRunningTimeChange = (value: string) => {
    setIsInputInvalid(false)
    setRunningTime(parseInt(value))
  }

  return (
    <>
      {!configMode ? (
        <div className={"episode" + toggleClass("episode-selected", selected)}>
          <div className="title" onClick={() => setSelected()}>
            <span>Personalizzato</span>
          </div>
          <div className="runningTime" onClick={() => setConfigMode(true)}>
            ⚙️ {runningTime} {declineTime(runningTime, "minutes")}
          </div>
        </div>
      ) : (
        <div className="episode-customizer">
          <input
            className="time-slider"
            type="range"
            min="1"
            max="180"
            value={runningTime}
            onChange={(e) => handleRunningTimeChange(e.target.value)}
          />
          <div className="bottom-part">
            <input
              className={
                "time-input" + toggleClass("time-input-error", isInputInvalid)
              }
              type="number"
              step="1"
              min="1"
              max="180"
              value={runningTime}
              onChange={(e) => handleRunningTimeChange(e.target.value)}
            />
            <button
              disabled={isInputInvalid}
              onClick={() => {
                if (runningTime >= 1 && runningTime <= 180) {
                  setIsInputInvalid(false)
                  setConfigMode(false)
                  updateRunningTime(runningTime)
                } else {
                  setIsInputInvalid(true)
                }
              }}
            >
              <Icon name="checkmark" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default CustomRunningTimeButton
