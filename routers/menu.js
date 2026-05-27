const router = require("./Route")
const path = require("path")

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "views", "menumain.html"))
});

module.exports = router;
