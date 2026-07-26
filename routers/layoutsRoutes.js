const router = require("./Route");
const path = require("path");

router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "views", "login.html"));
});

router.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "views", "dashboard.html"));
});

router.get("/historico", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "views", "historico.html"));
});

router.get("/menunet/:slug", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "views", "menumain.html"));
});

router.get("/passwordrecovery", (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "public", "views", "passwordRecovery.html"),
  );
});

router.get("/newpassword/:token", (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "public", "views", "newpassword.html"),
  );
});

module.exports = router;
