import React, { useState } from "react"
import "./App.css"

const App: React.FC = () => {
  const name = "Matteo"
  const [selectedDuration, setSelectedDuration] = useState(0)

  const getSelectedClass = (baseClassName: string, condition: boolean) => {
    return condition
      ? `${baseClassName} ${baseClassName}-selected`
      : baseClassName
  }

  return (
    <div className="App">
      <h1>Sei seduto al mio posto!</h1>
      <p>Ciao {name}, cosa vuoi vedere oggi?</p>
      <div id="episodes-container">
        {[
          { title: "Sitcom", duration: 20 },
          { title: "Puntata standard", duration: 40 },
          { title: "Puntata lunga", duration: 60 },
          { title: "Film", duration: 120 },
        ].map((episode) => {
          const selected = episode.duration === selectedDuration

          return (
            <div
              key={episode.title}
              className={getSelectedClass("episode", selected)}
              onClick={() => setSelectedDuration(episode.duration)}
            >
              <div className={getSelectedClass("title", selected)}>
                <span>{episode.title}</span>
              </div>
              <div className="duration">~ {episode.duration} minuti</div>
            </div>
          )
        })}
      </div>
      <button id="start" disabled={selectedDuration === 0}>
        Comincia a guardare
      </button>
    </div>
  )
}

export default App
