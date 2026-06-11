const router = require("./Route");
const { authMiddleware } = require("../middlewares/authMiddleware");
const controller = require("../controller/restauranteController");
const infoSettings = require("../controller/restauranteSettingsController");
const { uploads } = require("../services/uploads/multerDishPic");
const pratoController = require("../controller/pratoController");

router.get("/dadosrestaurantes", authMiddleware, controller.dadosrestaurantes);
router.post("/registro", controller.register);
router.post("/login", controller.login);
router.put("/upt/dadosrestaurantes", authMiddleware, infoSettings.update);
router.put("/upt/restaurantessenha", authMiddleware, infoSettings.UpdateSenha);

/*Historico routes*/
router.post(
  "/pratoregister",
  authMiddleware,
  uploads.single("imagem"),
  pratoController.registroPrato,
);

module.exports = router;
