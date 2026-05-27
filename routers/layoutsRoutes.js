const router = require("./Route")
const path = require("path")

router.get("/cadastro", (req, res)=>{
    res.sendFile(path.join(__dirname, "..", "public", "views", "cadastro.html"));
});

router.get("/login", (req, res)=>{
    res.sendFile(path.join(__dirname, "..", "public", "views", "login.html"));
});

router.get("/dashboard", (req, res)=>{
    res.sendFile(path.join(__dirname, "..", "public", "views", "dashboard.html"));
});

router.get("/historico", (req, res)=>{
    res.sendFile(path.join(__dirname, "..", "public", "views", "historico.html"))
});

module.exports = router;