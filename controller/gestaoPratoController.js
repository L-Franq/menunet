const pratosModel = require("../model/pratosModel");

const dadosPrato = async (req, res) => {
  const id_prato = req.params.id;
  try {
    if (id_prato === undefined || id_prato === null) {
      return res.status(400).json({ erro: "Prato sem identificador." });
    }

    const pratoInfo = await pratosModel.buscarPratoInfo(id_prato);

    if (!pratoInfo) {
      return res.status(404).json({ erro: "Informações do prato em falta." });
    }

    return res.status(200).json({ mensagem: pratoInfo });
  } catch (error) {
    console.error("Falha ao buscar dados de prato: ", error);
    return res
      .status(500)
      .json({ erro: "Problemas com a conexão. Tente mais tarde!" });
  }
};

const pratosNaGestao = async (req, res) => {
  try {
    const pratos = await pratosModel.mostrarNaGestao(req.id_restaurante);

    if (!pratos || pratos.length < 0) {
      return res.status(400).json({ erro: "Sem Pratos no no menu." });
    }
    return res.status(200).json({ mensagem: pratos });
  } catch (error) {
    console.error("Falha em trazer pratos na gestão: ", error);
    return res
      .status(500)
      .json({ erro: "Falhas com conexão. Tente dentro de instantes!" });
  }
};

const pratoAtualizar = async (req, res) => {
  const { id_prato, nome, preco, descricao, categoria, imagemAntiga } = req.body;
  try {
    
    let imgPath = req.file ? req.file.path : imagemAntiga;

    if(!imgPath){
      return res.status(400).json({erro: "Caminho da imagem em falta."});
    }
  
    imgPath = imgPath.replace(/\\/g, "/");

    // 2. Remove a barra inicial '/' se ela existir (para evitar guardar //uploads/...)
    if (imgPath.startsWith("/")) {
      imgPath = imgPath.substring(1);
    }

    const prato_updated = await pratosModel.atualizarPratoInfo(
      id_prato,
      imgPath,
      nome,
      preco,
      descricao,
      categoria,
    );

    if(!prato_updated || prato_updated === 0){
      return res.status(400).json({erro: "Falha ao Atualizar."});
    }

    return res.status(200).json({mensagem: "Atualizado."});
  } catch (error) {
    console.error("Falha em atualizar prato: ", error);
    return res.status(500).json({erro: "Problemas com a conexão. tente dentro de instantes!"});
  }
};

module.exports = { dadosPrato, pratosNaGestao, pratoAtualizar };
