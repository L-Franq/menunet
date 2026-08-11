const { urlencoded } = require("express");

const btnVoltar = document.getElementById("voltar");
const pratosContainer = document.getElementById("historyContainer");

const alertaDoSistema = function (title, text, icon) {
  Swal.fire({
    title: `${title}`,
    text: `${text}`,
    icon: `${icon}`,
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,

    //ajustes para o sistema
    background: "#f4f9f9",
    color: "#035373",
    width: "400px",
  });
};

const alertaDoSistemaErro = function (title, text, icon) {
  Swal.fire({
    title: `${title}`,
    text: `${text}`,
    icon: `${icon}`,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,

    //ajustes para o sistema
    background: "#f4f9f9",
    color: "#035373",
    width: "400px",
  });
};

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

      if (listaDePratos.length == 0) {
        pratosContainer.innerHTML = `<div class="history-card">
            <img src="/img/deadfish.jpg" alt="Prato">
            <div class="history-info">
                <h4>Sem Histórico</h4>
                <p>Última vez: Hoje</p>
                <span class="status-tag">Arquivado</span>
            </div>
            <div class="history-actions">
                <button class="btn-action btn-republish">REPUBLICAR&nbsp;<i class="fa-solid fa-rotate"></i></button>
                <button class="btn-action btn-delete">ELIMINAR&nbsp;<i class="fa-regular fa-trash-can"></i></button>
            </div>
        </div>`;
      }
      listaDePratos.forEach((prato) => {
        const pathArray = prato.imagem.split("/");
        const file = pathArray[pathArray.length - 1];
        const imgSrc = "uploads" + `/${file}`;

        const dataFormatada = new Date(prato.created_at).toLocaleDateString(
          "pt",
        );
        pratosContainer.innerHTML += `
            <div class="history-card" id="card-${prato.id_prato}">
            <img src="/${imgSrc}" alt="${prato.nome}">
            <div class="history-info">
                <h4>${prato.nome}</h4>
                <p>Última vez: ${dataFormatada}</p>
                <span class="status-tag">Arquivado</span>
            </div>
            <div class="history-actions">
                <button class="btn-action btn-republish" onclick="accaoRepublicar(${prato.id_prato})">REPUBLICAR&nbsp;<i class="fa-solid fa-rotate"></i></button>
                <button class="btn-action btn-delete" onclick="accaoEliminar(${prato.id_prato})">ELIMINAR&nbsp;<i class="fa-regular fa-trash-can"></i></button>
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

const accaoEliminar = async (id) => {
  const token = localStorage.getItem("token");
  if (!confirm("Tem certeza que deseja apagar DEFINITIVAMENTE este prato?"))
    return;
  try {
    const response = await fetch(`/menunet/dados/eliminar/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const dadosServer = await response.json();
    const mensagem = dadosServer.mensagem;
    const erro = dadosServer.erro;

    if (response.ok) {
      document.getElementById(`card-${id}`).remove();
      alertaDoSistema(mensagem || "Eliminado", "...", "info");
    } else {
      alertaDoSistemaErro(erro || "Falha ao eliminar", "...", "error");
    }
  } catch (error) {
    console.error("Falha na requisicao: ", error);
  }
};

const accaoRepublicar = async (id) => {
  const token = localStorage.getItem("token");
  //if (!confirm("Deseja colocar este prato de volta no menu ativo?")) return;
  try {
    const response = await fetch(`/menunet/dados/republicar/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const dadosServer = await response.json();
    const mensagem = dadosServer.mensagem;
    const erro = dadosServer.erro;

    if (response.ok) {
      document.getElementById(`card-${id}`).remove();
      alertaDoSistema(mensagem || "Republicado", "...", "info");
    } else {
      alertaDoSistemaErro(erro || "Falha ao Republicar", "...", "error");
    }
  } catch (error) {
    console.error("Falha na requisicao: ", error);
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  await noHistorico();
});
