const router = require("./Route");
const { authMiddleware } = require("../middlewares/authMiddleware");
const accessRestauranteController = require("../controller/restauranteController");
const restauranteConfigController = require("../controller/restauranteConfigController");
const { uploads } = require("../services/multerService");
const pratoController = require("../controller/pratoController");
const historicoController = require("../controller/historicoController");
const gerirPratoController = require("../controller/gestaoPratoController");
const { recoveryEmailVerif } = require("../controller/recoverEmailController");

router.get("/dadosrestaurantes", authMiddleware, accessRestauranteController.MostarDadosrestaurantes);
router.post("/registro", accessRestauranteController.register);
router.post("/login", accessRestauranteController.login);
router.put("/upt/dadosrestaurantes", authMiddleware, restauranteConfigController.atualizarInfoRestaurante);
router.put("/upt/restaurantessenha", authMiddleware, restauranteConfigController.atualizarSenhaRestaurante);
router.post("/esqueci-senha", recoveryEmailVerif);
router.put("/rec/password", restauranteConfigController.atualizarSenhaEmRecuperacao);

/*Pratos routes*/
router.post(
  "/pratoregister",
  authMiddleware,
  uploads.single("imagem"),
  pratoController.registroPrato,
);

router.get(
  "/nohistorico",
  authMiddleware,
  historicoController.pratosNoHistorico,
);

router.get("/nagestao", authMiddleware, gerirPratoController.pratosNaGestao);

router.put(
  "/upt/prato",
  authMiddleware,
  uploads.single("imagem"),
  gerirPratoController.pratoAtualizar,
);

router.put(
  "/republicar/:id",
  authMiddleware,
  historicoController.republicarPrato,
);

router.delete(
  "/eliminar/:id",
  authMiddleware,
  historicoController.eliminarPrato,
);

router.get("/edicaoinfo/:id", authMiddleware, gerirPratoController.dadosPrato);

router.get("/:slug", pratoController.mostarMenu);

module.exports = router;
