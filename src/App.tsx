import React, { useState } from "react"
import "./App.css"

const App: React.FC = () => {
  const name = "Matteo"
  const [selectedDuration, setSelectedDuration] = useState(0)

  const toggleClass = (className = "selected", condition: boolean) => {
    return condition ? ` ${className}` : ""
  }

  return (
    <div className="App">
      <h1>Sei seduto al mio posto!</h1>
      <div id="screens-container">
        {[
          { name: "Chiara", watching: true },
          { name: "Monica", watching: false },
          { name: "Matteo", watching: false },
          { name: "Mamma e papà", watching: true },
        ].map((screen) => (
          <div
            key={screen.name}
            className={
              "screen" +
              toggleClass("screen-selected", screen.watching) +
              toggleClass("screen-mine", name === screen.name)
            }
          >
            <div className="name">
              <p>{screen.name}</p>
            </div>
            <div className="watching">
              {screen.watching ? "sta guardando" : "non sta guardando"}
            </div>
          </div>
        ))}
      </div>
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
              className={"episode" + toggleClass("episode-selected", selected)}
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
      <button id="start" disabled={selectedDuration === 0}>
        Comincia a guardare
      </button>
    </div>
  )
}

export default App
