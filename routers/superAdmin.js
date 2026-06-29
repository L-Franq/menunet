const router = require("./Route");
const path = require("path");

router.get("/l-franq/cadastro", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "views", "cadastro.html"));
});

module.exports = router;
