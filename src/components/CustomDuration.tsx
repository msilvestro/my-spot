import React, { FC, useState } from "react"

import { toggleClass } from "../utils/css"

type Props = {
  selected: boolean
  setSelected(): void
}

const CustomDuration: FC<Props> = ({ selected, setSelected }: Props) => {
  const [customDuration, setCustomDuration] = useState(30)
  const [configMode, setConfigMode] = useState(false)

  return (
    <>
      {!configMode ? (
        <div className={"episode" + toggleClass("episode-selected", selected)}>
          <div className="title" onClick={() => setSelected()}>
            <span>Personalizzato</span>
          </div>
          <div className="duration" onClick={() => setConfigMode(true)}>
            ~ {customDuration} minuti
          </div>
        </div>
      ) : (
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
          <button onClick={() => setConfigMode(false)}>Conferma</button>
        </div>
      )}
    </>
  )
}

export default CustomDuration
