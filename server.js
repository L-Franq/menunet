require("dotenv").config()

const express = require("express")
const app = express()
const cors = require("cors")
const PORT = process.env.PORT || 9000

app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

const mainRoute = require("./routers/menu")
const layouts = require("./routers/layoutsRoutes");

app.use(mainRoute)
app.use("/layout", layouts)

app.listen(PORT, (erro) => {
  if (erro) return console.error("Falha ao iniciar o servidor: ", erro)
  console.log(`App runnin on http://localhost:${PORT}`)
})
