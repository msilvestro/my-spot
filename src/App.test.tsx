import React from "react"
import { render, screen } from "@testing-library/react"
import App from "./App"

test("renders learn react link", () => {
  render(<App />)
  const titleElement = screen.getByText(/Sei seduto al mio posto\!/i)
  expect(titleElement).toBeInTheDocument()
})
