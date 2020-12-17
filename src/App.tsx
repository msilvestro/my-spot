import React from "react"
import "./App.css"

const App: React.FC = () => {
  const name = "Matteo"

  return (
    <div className="App">
      <h1>Sei seduto al mio posto</h1>
      <p>Ciao {name}, cosa vuoi vedere oggi?</p>
      <div id="episodeButtonsContainer">
        {[
          { title: "Sitcom", duration: "20 minuti" },
          { title: "Puntata standard", duration: "40 minuti" },
          { title: "Puntata lunga", duration: "60 minuti" },
          { title: "Film", duration: "2 ore" },
        ].map((episode) => (
          <div
            key={episode.title}
            className="episodeButton"
            onClick={() => console.log("episode")}
          >
            <div className="episodeTitle">
              <span>{episode.title}</span>
            </div>
            <div className="episodeDuration">{episode.duration}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
