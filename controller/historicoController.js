const pratosModel = require("../model/pratosModel");

const pratosNoHistorico = async (req, res) => {
  try {
    const pratos = await pratosModel.mostrarNoHistorico(req.id_restaurante);

    if (!pratos || pratos.length < 0) {
      return res.status(400).json({ erro: "Sem Pratos no histórico." });
    }
    return res.status(200).json({ mensagem: pratos });
  } catch (error) {
    console.error("Falha em trazer prato do histórico: ", error);
    return res
      .status(500)
      .json({ erro: "Falha na conexão. Tente mais tarde!" });
  }
};

const republicarPrato = async (req, res) => {
  const idPrato = req.params.id;

  try {
    const prato = await pratosModel.republicarDoHistorico(idPrato);
    if (prato === 0) {
      return res.status(400).json({ erro: "Falha ao republicar prato." });
    }
    return res.status(200).json({ mensagem: "Republicado!" });
  } catch (error) {
    console.error("Falha para republicar prato: ", error);
    return res
      .status(500)
      .json({ erro: "Falha na conexão. Tente mais tarde!" });
  }
};

const eliminarPrato = async (req, res) => {
  const idPrato = req.params.id;

  try {
    const prato = await pratosModel.deletarDoHistorico(idPrato);

    if (prato === 0) {
      return res.status(400).json({ erro: "Falha ao deletar prato." });
    }
    return res.status(200).json({ mensagem: "Deletado!" });
  } catch (error) {
    console.error("Falha para eliminar prato: ", error);
    return res.status(500).json({ erro: "Erro na conexão. Tente mais tarde!" });
  }
};

module.exports = { pratosNoHistorico, republicarPrato, eliminarPrato };
