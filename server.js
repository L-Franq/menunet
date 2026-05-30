require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 9000;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

require("./databases/db");
require("./databases/init");

const mainRoute = require("./routers/menu");
const layouts = require("./routers/layoutsRoutes");
const superAdmin = require("./routers/superAdmin");
const dadosrestaurantes = require("./routers/managerRoute");

app.use("/menunet/dados", dadosrestaurantes);
app.use(mainRoute);
app.use(superAdmin);
app.use("/layout", layouts);

app.listen(PORT, (erro) => {
  if (erro) return console.error("Falha ao iniciar o servidor: ", erro);
  console.log(`App runnin on http://localhost:${PORT}`);
});
