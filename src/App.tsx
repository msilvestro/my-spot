import React, { useState } from "react"
import "./App.css"

const App: React.FC = () => {
  const name = "Matteo"
  const [selectedEpisode, setSelectedEpisode] = useState(0)

  const setActive = (baseClassName: string, condition: boolean) => {
    return condition
      ? `${baseClassName} ${baseClassName}-active`
      : baseClassName
  }

  return (
    <div className="App">
      <h1>Sei seduto al mio posto</h1>
      <p>Ciao {name}, cosa vuoi vedere oggi?</p>
      <div id="episodeButtonsContainer">
        {[
          { title: "Sitcom", duration: 20 },
          { title: "Puntata standard", duration: 40 },
          { title: "Puntata lunga", duration: 60 },
          { title: "Film", duration: 120 },
        ].map((episode) => {
          const selected = episode.duration === selectedEpisode

          return (
            <div
              key={episode.title}
              className={setActive("episodeButton", selected)}
              onClick={() => setSelectedEpisode(episode.duration)}
            >
              <div className={setActive("episodeTitle", selected)}>
                <span>{episode.title}</span>
              </div>
              <div className="episodeDuration">~ {episode.duration} minuti</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default App
