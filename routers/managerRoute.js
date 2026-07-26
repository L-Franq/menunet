const router = require("./Route");
const { authMiddleware } = require("../middlewares/authMiddleware");
const controller = require("../controller/restauranteController");
const infoSettings = require("../controller/restauranteSettingsController");
const { uploads } = require("../services/uploads/multerDishPic");
const pratoController = require("../controller/pratoController");
const historicoController = require("../controller/historicoController");
const { recoveryEmailVerif } = require("../controller/recoverEmailController");

router.get("/dadosrestaurantes", authMiddleware, controller.dadosrestaurantes);
router.post("/registro", controller.register);
router.post("/login", controller.login);
router.put("/upt/dadosrestaurantes", authMiddleware, infoSettings.update);
router.put("/upt/restaurantessenha", authMiddleware, infoSettings.UpdateSenha);
router.post("/esqueci-senha", recoveryEmailVerif);
router.put("/rec/password", infoSettings.UpdateSenha)

/*Pratos routes*/
router.post(
  "/pratoregister",
  authMiddleware,
  uploads.single("imagem"),
  pratoController.registroPrato,
);

router.get("/nohistorico", authMiddleware, historicoController.pratosNoHistorico);
router.put("/republicar/:id", authMiddleware, historicoController.republicarPrato);
router.delete("/eliminar/:id", authMiddleware, historicoController.eliminarPrato);

router.get("/:slug", pratoController.mostarMenu);

module.exports = router;
