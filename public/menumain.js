const pratosContainer = document.getElementById("grouper");

async function generateDishes() {
  const response = await fetch("/", {
    method: "GET",
  });

  if (response.ok) {
    const dadosServer = await response.json();
    const nomePrato = dadosServer.nome;
    const preco = dadosServer.preco;
    const pratoImg = dadosServer.imagem;

    pratosContainer.innerHTML = `
            <div class="card-item animate__animated animate__zoomIn">
          <img src=${pratoImg} alt=${nomePrato} />
          <div class="card-info">
            <h3>${nomePrato}</h3>
            <p class="price">${preco}</p>
          </div>
        </div>
            `;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
    await generateDishes();
});
