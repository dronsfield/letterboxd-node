import { config } from "dotenv"
import express from "express"
import {
  getUnwatchedWatchlistsUnion,
  getWatchlistsIntersection
} from "./watchlists"
config()

const app = express()

const PORT = 6464

app.get("/", (req, res) => {
  res.send(`
  <ul>
    <li><a href="/intersect">Intersect</a></li>
    <li><a href="/unwatched-union">Unwatched union</a></li>
  </ul>
  `)
})

function renderTable(rows: any[]) {
  const headers = Object.keys(rows[0] || {})
  return `<table style="width: 100%;border: 1px solid black;text-align: left;">
    <tr>
      ${headers.map((header) => `<th>${header}</th>`).join("")}
    </tr>
    ${rows
      .map((row) => {
        return `
    <tr>
    ${headers.map((header) => `<td>${row[header]}</td>`).join("")}
    </tr>
      `
      })
      .join("")}
  </table>`
}

app.get("/intersect", async (req, res) => {
  const data = await getWatchlistsIntersection()
  res.send(renderTable(data))
})

app.get("/unwatched-union", async (req, res) => {
  const data = await getUnwatchedWatchlistsUnion()
  res.send(renderTable(data))
})

app.listen(PORT, () => {
  const url = `http://localhost:${PORT}`
  console.log(`server listening at ${url}`)
})
