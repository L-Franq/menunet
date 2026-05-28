const router = require("./Route");
const path = require("path");

router.get("/cadastro", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "views", "cadastro.html"));
});

module.exports = router;
