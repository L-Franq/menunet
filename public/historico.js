const btnVoltar = document.getElementById("voltar");
const pratosContainer = document.getElementById("historyContainer");

btnVoltar.addEventListener("click", () => {
  window.location.href = "/layout/dashboard";
});

const noHistorico = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("/menunet/dados/nohistorico", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const dadosServer = await response.json();

    if (response.ok) {
      pratosContainer.innerHTML = "";

      const listaDePratos = Array.isArray(dadosServer)
        ? dadosServer
        : dadosServer.mensagem;
      listaDePratos.forEach((prato) => {
        pratosContainer.innerHTML += `
            <div class="history-card">
            <img src="/${prato.imagem}" alt="${prato.nome}">
            <div class="history-info">
                <h4>${prato.nome}</h4>
                <p>Última vez: ${prato.created_at}</p>
                <span class="status-tag">Arquivado</span>
            </div>
            <div class="history-actions">
                <button class="btn-action btn-republish">REPUBLICAR&nbsp;<i class="fa-solid fa-rotate"></i></button>
                <button class="btn-action btn-delete">ELIMINAR&nbsp;<i class="fa-regular fa-trash-can"></i></button>
            </div>
        </div>
            `;
      });
    } else {
      const erro = dadosServer.erro;

      pratosContainer.innerHTML = `
      <div class="history-card">
            <img src="../img/deadfish.jpg" alt="${erro}">
            <div class="history-info">
                <h4>${erro}</h4>
                <p>Última vez: Hoje</p>
                <span class="status-tag">Arquivado</span>
            </div>
            <div class="history-actions">
                <button class="btn-action btn-republish">REPUBLICAR&nbsp;<i class="fa-solid fa-rotate"></i></button>
                <button class="btn-action btn-delete">ELIMINAR&nbsp;<i class="fa-regular fa-trash-can"></i></button>
            </div>
        </div>
            `;
    }
  } catch (error) {
    console.error("Falha na requisicao: ", error);
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  await noHistorico();
});
