const btnVoltar = document.getElementById("voltar");
const pratosContainer = document.getElementById("historyContainer");
const imagemPreview = document.getElementById("img-preview");
const nome = document.getElementById("dishName");
const preco = document.getElementById("dishPrice");
const descricao = document.getElementById("dishDesc");
const categoria = document.getElementById("dishCateg");
const imgInput = document.getElementById("dishImg");
const modalEdit = document.getElementById("modal-editar");

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

document
  .getElementById("form-atualizar")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = parseInt(localStorage.getItem("id_prato"));
    await atualizarPrato(id);
  });

async function dadosPrato(id) {
  modalEdit.classList.remove("hidden");
  localStorage.setItem("id_prato", id);
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`/menunet/dados/edicaoinfo/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const dadosServer = await response.json();
    const erro = dadosServer.erro;
    const dadosPrato = dadosServer.mensagem;

    if (response.ok) {
      imagemPreview.setAttribute("src", `/${dadosPrato.imagem}`);
      nome.value = `${dadosPrato.nome}`;
      preco.value = `${dadosPrato.preco}`;
      descricao.value = `${dadosPrato.descricao}`;
      imgInput.files[0] = `/${dadosPrato.imagem}`;
      const categ = `${dadosPrato.categoria}`;
      if (categ === "Comida") {
        categoria.innerHTML = "";
        categoria.innerHTML = `<option selected value="${categ}">Comida</option>
         <option value="bebida">Bebida</option>`;
      } else {
        categoria.innerHTML = "";
        categoria.innerHTML = `<option value="comida">Comida</option>
         <option selected value="${categ}">Bebida</option>`;
      }

      imgInput.addEventListener("change", function () {
        const file = this.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
            imagemPreview.removeAttribute("src");
            imagemPreview.setAttribute("src", `${e.target.result}`);
          };
          reader.readAsDataURL(file);
        }
      });
    } else {
      alertaDoSistemaErro(erro || "Falha ao buscar.", "...", "error");
    }
  } catch (error) {
    console.error("Falha na requisicao: ", error);
  }
}

const naEdicao = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("/menunet/dados/nagestao", {
      method: "GET",
      headers: {
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
            <img src="/img/deadfish.jpg" alt="sem pratos a apresentar">
            <div class="history-info">
                <h4>Sem Menu</h4>
                <p>Última vez: Hoje</p>
                <span class="status-tag">Publicado</span>
            </div>
            <div class="history-actions">
                <button class="btn-action btn-edit">EDITAR&nbsp;<i class="fa-solid fa-pen-to-square"></i></button>
                <button class="btn-action btn-delete">ELIMINAR&nbsp;<i class="fa-regular fa-trash-can"></i></button>
            </div>
        </div>`;
      }
      listaDePratos.forEach((prato) => {
        const dataFormatada = new Date(prato.created_at).toLocaleDateString(
          "pt",
        );
        pratosContainer.innerHTML += `
            <div class="history-card" id="card-${prato.id_prato}">
            <img src="/${prato.imagem}" alt="${prato.nome}">
            <div class="history-info">
                <h4>${prato.nome}</h4>
                <p>Última vez: ${dataFormatada}</p>
                <span class="status-tag">No Menu</span>
            </div>
            <div class="history-actions">
                <button class="btn-action btn-edit" onclick="dadosPrato(${prato.id_prato})">EDITAR&nbsp;<i class="fa-solid fa-pen-to-square"></i></button>
                <button class="btn-action btn-delete" onclick="accaoEliminar(${prato.id_prato})">ELIMINAR&nbsp;<i class="fa-regular fa-trash-can"></i></button>
            </div>
        </div>
            `;
      });
    } else {
      const erro = dadosServer.erro;

      pratosContainer.innerHTML = `
      <div class="history-card">
            <img src="/img/deadfish.jpg" alt="${erro}">
            <div class="history-info">
                <h4>${erro}</h4>
                <p>Última vez: Hoje</p>
                <span class="status-tag">Publicado</span>
            </div>
            <div class="history-actions">
                <button class="btn-action btn-edit">EDITAR&nbsp;<i class="fa-solid fa-pen"></i></button>
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

const atualizarPrato = async (id) => {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("id_prato", id);
  formData.append("nome", nome.value);
  formData.append("preco", preco.value);
  formData.append("descricao", descricao.value);
  formData.append("categoria", categoria.value);

  if (imgInput.files && imgInput.files[0]) {
    formData.append("imagem", imgInput.files[0]);
  } else {
    const imgActual = imagemPreview.getAttribute("src");
    formData.append("imagemAntiga", imgActual);
  }

  //if (!confirm("Deseja colocar este prato de volta no menu ativo?")) return;
  try {
    const response = await fetch(`/menunet/dados/upt/prato`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const dadosServer = await response.json();
    const mensagem = dadosServer.mensagem;
    const erro = dadosServer.erro;

    if (response.ok) {
      window.location.reload();
      alertaDoSistema(mensagem || "Atualizado", "...", "info");
    } else {
      alertaDoSistemaErro(erro || "Falha ao Atualizar", "...", "error");
    }
  } catch (error) {
    console.error("Falha na requisicao: ", error);
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  await naEdicao();
});
