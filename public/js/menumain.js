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
      pratosContainer.innerHTML = "";
      const imgPath = prato.imagem.replace(/"\/var\/data"/, "/uploads/");

      const listaDePratos = Array.isArray(dadosServer)
        ? dadosServer
        : dadosServer.mensagem;
      listaDePratos.forEach((prato) => {
        pratosContainer.innerHTML += `
            <div class="card-item animate__animated animate__zoomIn">
          <img src="/${imgPath}" alt="um prato de ${prato.nome}" />
          <div class="card-info">
            <h3 class="nome">${prato.nome}</h3>
            <p class="price">${prato.preco}KZ</p>
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
    console.error("Falha na requisicao: ", error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  copyRight.innerHTML = `&copy; ${ano} Todos os direitos reservados | Criado por
        <strong>Lopo Franqueira</strong>`;

  pratosContainer.innerHTML = `<div class="card-item animate__animated animate__zoomIn">
          <div class="card-info">
            <h3>Carregando menu...</h3>
            <p class="price">0.00</p>
          </div>
        </div>`;

  await generateDishes();
});
