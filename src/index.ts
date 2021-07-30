// import express from "express"
import { config } from "dotenv"
import { watchlists } from "./watchlists"
config()

watchlists()

// const app = express()

// const PORT = 3000

// app.get("/", (req, res) => {
//   res.send("hello there")
// })

// app.listen(PORT, () => {
//   console.log(`server listening at http://localhost:${PORT}`)
// })

// auth("dronzxds", process.env.PASSWORD as string)
