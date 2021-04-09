import React, { FC, useState } from "react"
import "./RunningTimeButton.css"
import "./CustomRunningTimeButton.css"

import { toggleClass } from "../utils/css"

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

  return (
    <>
      {!configMode ? (
        <div className={"episode" + toggleClass("episode-selected", selected)}>
          <div className="title" onClick={() => setSelected()}>
            <span>Personalizzato</span>
          </div>
          <div className="runningTime" onClick={() => setConfigMode(true)}>
            ⚙️ {runningTime} minuti
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
            onChange={(e) => setRunningTime(parseInt(e.target.value))}
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
              onChange={(e) => setRunningTime(parseInt(e.target.value))}
            />
            <button
              onClick={() => {
                if (runningTime > 1 && runningTime <= 180) {
                  setIsInputInvalid(false)
                  setConfigMode(false)
                  updateRunningTime(runningTime)
                } else {
                  setIsInputInvalid(true)
                }
              }}
            >
              ✔️
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default CustomRunningTimeButton