const pratosContainer = document.getElementById("grouper");
const data = new Date();
const copyRight = document.getElementById("cpright");
const ano = data.getFullYear();
/*const tipoFiltro = document.getElementById("filtroTipo");
const precoFiltro = document.getElementById("filtroPreco");
const filtrosContainer = document.getElementById("filtros");*/

async function generateDishes() {
  const caminhos = window.location.pathname.split("/");
  const slug = caminhos[caminhos.length - 1];

  try {
    const response = await fetch(`/menunet/dados/${slug}`, {
      method: "GET",
    });

    const dadosServer = await response.json();
    
    if (response.ok) {
      const listaDePratos = Array.isArray(dadosServer)
        ? dadosServer
        : dadosServer.mensagem;

      pratosContainer.innerHTML = "";

      listaDePratos.forEach((prato) => {
        // 1. Normaliza as barras (muda '\' para '/')
        let caminhoImagem = prato.imagem ? prato.imagem.replace(/\\/g, "/") : "";

        // 2. Extrai apenas a parte relativa se for um caminho absoluto do servidor (ex: Render)
        if (caminhoImagem.includes("uploads/")) {
          caminhoImagem = "uploads/" + caminhoImagem.split("uploads/")[1];
        }

        // 3. Garante que começa sem barra dupla
        caminhoImagem = caminhoImagem.startsWith("/") ? caminhoImagem : `/${caminhoImagem}`;

        pratosContainer.innerHTML += `
          <div title="${prato.descricao}" class="card-item animate__animated animate__zoomIn">
            <img src="${caminhoImagem}" alt="Um prato de ${prato.nome}" />
            <div class="card-info">
              <h3 class="nome">${prato.nome}</h3>
              <p class="price">${prato.preco} KZ</p>
            </div>
          </div>
        `;
      });
    } else {
      const erro = dadosServer.erro;
      const preco = "0.00";

      pratosContainer.innerHTML = `
        <div class="card-item animate__animated animate__zoomIn">
          <div class="card-info">
            <h3>${erro}</h3>
            <p class="price">${preco} Kz</p>
          </div>
        </div>
      `;
    }
  } catch (error) {
    console.error("Falha na requisição: ", error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  copyRight.innerHTML = `&copy; Copyright ${ano} Todos os direitos reservados | <strong>Lopo Franqueira</strong>`;

  pratosContainer.innerHTML = `<div class="card-item animate__animated animate__zoomIn">
          <div class="card-info">
            <h3>Carregando menu...</h3>
            <p class="price">0.00</p>
          </div>
        </div>`;

  await generateDishes();
});