import React, { FC, useState } from "react"

import { toggleClass } from "../utils/css"

type Props = {
  selected: boolean
  setSelected(): void
}

const CustomDuration: FC<Props> = ({ selected, setSelected }: Props) => {
  const [customDuration, setCustomDuration] = useState(30)

  return (
    <>
      <div
        className={"episode" + toggleClass("episode-selected", selected)}
        onClick={() => setSelected()}
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
    </>
  )
}

export default CustomDuration
