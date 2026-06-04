const novoItem1 = document.getElementById("n2");
const main = document.getElementById("pai");
const imgInput = document.getElementById("imgInput");
const preview = document.getElementById("preview");
const perfilSettings = document.getElementById("perfil-settings");
let listaParaPublicar = [];

const alertaDoSistema = function (title, text, icon) {
  Swal.fire({
    title: `${title}`,
    text: `${text}`,
    icon: `${icon}`,
    showConfirmButton: false,
    timer: 1500,
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
    timer: 2000,
    timerProgressBar: true,

    //ajustes para o sistema
    background: "#f4f9f9",
    color: "#035373",
    width: "400px",
  });
};

novoItem1.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "/layout/historico";
});

function renderizarMiniCard(prato, url) {
  const queue = document.getElementById("dishQueue");
  const card = document.createElement("div");
  card.className = "mini-card";
  card.innerHTML = `
        <img src="${url}" alt="Prato">
        <div class="mini-card-info">
            <h4>${prato.nome}</h4>
            <span>${prato.preco} Kz</span>
        </div>
        <button class="btn-remove-mini"><i class="fa-solid fa-trash"></i></button>
    `;

  card.querySelector(".btn-remove-mini").onclick = function () {
    listaParaPublicar = listaParaPublicar.filter((p) => p.id !== prato.id);
    card.remove();
    updateCount();
  };

  queue.appendChild(card);
}

function updateCount() {
  const count = document.querySelectorAll(".mini-card").length;
  document.getElementById("queueCount").innerText = count;
}

async function atualizarDados(dadosAtualizar) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`/menunet/dados/upt/dadosrestaurantes`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dadosAtualizar),
    });

    const dadosServer = await await response.json();

    if (response.ok) {
      alertaDoSistema(
        " * * *",
        dadosServer.mensagem || "Atualizado com sucesso!",
        "info",
      );
      window.location.href = "/layout/dashboard";
    }
  } catch (error) {
    console.error("Falha na requisicao: ", error);
    alertaDoSistema("Falha", "Falha no sistema", "warning");
  }
}

async function atualizarSenha(senha) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`/menunet/dados/upt/restaurantessenha`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(senha),
    });

    const dadosServer = await await response.json();

    if (response.ok) {
      alertaDoSistema(
        " * * *",
        dadosServer.mensagem || "senha atualizada!",
        "sucess",
      );
      window.location.href = "/layout/dashboard";
    }
  } catch (error) {
    console.error("Falha na requisicao: ", error);
    alertaDoSistema("Falha", "Falha no sistema", "warning");
  }
}

async function publicarPratos() {
  const token = localStorage.getItem("token");

  for (const prato of listaParaPublicar) {
    const formData = new FormData();
    formData.append("nome", prato.nome);
    formData.append("descricao", prato.descricao);
    formData.append("preco", prato.preco);
    formData.append("categoria", prato.categoria);
    formData.append("imagem", prato.arquivo);

    try {
      const response = await fetch("/menunet/dados/pratoregister", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const dadosServer = await response.json();

      if (response.ok) {
        alertaDoSistema("* * *", `Sucesso: ${prato.nome}`, "succes");
      } else {
        alertaDoSistemaErro(`${prato.nome}`, `${dadosServer.erro}`, "warning");
      }
    } catch (error) {
      console.error(`Erro ao enviar ${prato.nome}:`, error);
      alertaDoSistemaErro("Falha ao enviar", `${prato.nome}`, "warning");
    }
  }
  alertaDoSistema("Sucesso", "Menu publicado com sucesso!", "success");
  listaParaPublicar = [];
  window.location.reload();
}

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const nome = document.getElementById("manegerName");

  try {
    const response = await fetch("/menunet/dados/dadosrestaurantes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const dadosServer = await await response.json();

    if (response.ok) {
      alertaDoSistema(
        "Oi!",
        dadosServer.mensagem || `Bem-vindo ${dadosServer.restaurante.nome}`,
        "info",
      );

      nome.innerText = "";
      nome.innerText = dadosServer.restaurante.nome;
    }

    const perfil = document.getElementById("perfil1");

    if (perfil) {
      perfil.addEventListener("click", (e) => {
        e.preventDefault();
        perfilSettings.classList.remove("hidden");
        main.classList.add("hidden");

        document.getElementById("slug").value = dadosServer.restaurante.slug;
        document.getElementById("nomeSettings").value =
          dadosServer.restaurante.nome;
        document.getElementById("senhaSettings").value =
          dadosServer.restaurante.senha;
        document.getElementById("emailSettings").value =
          dadosServer.restaurante.email;

        document
          .getElementById("profileForm")
          .addEventListener("submit", async (e) => {
            e.preventDefault();
            const slug = document.getElementById("slug").value;
            const nome = document.getElementById("nomeSettings").value;
            const email = document.getElementById("emailSettings").value;

            await atualizarDados({ nome, email, slug });
          });

        document
          .getElementById("passwordForm")
          .addEventListener("submit", async (e) => {
            e.preventDefault();
            const senha = document.getElementById("novaSenhaSettings").value;
            const senhaConfirm = document.getElementById(
              "confirmSenhaSettings",
            ).value;

            if (senha !== senhaConfirm) {
              alertaDoSistema(
                "* * *",
                "as senhas nao sao identicas",
                "warning",
              );
              return;
            }

            await atualizarSenha({ senha });
          });
      });
    }

    const novoItem = document.getElementById("n1");

    if (novoItem) {
      novoItem.addEventListener("click", (e) => {
        e.preventDefault();
        perfilSettings.classList.add("hidden");
        main.classList.remove("hidden");

        imgInput.addEventListener("change", function () {
          const file = this.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
              preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
          }
        });

        document
          .getElementById("addToQueue")
          .addEventListener("click", function () {
            const imgFile = document.getElementById("imgInput").files[0];
            const name = document.getElementById("dishName").value;
            const price = document.getElementById("dishPrice").value;
            const category = document.getElementById("dishCategory").value;
            const description =
              document.getElementById("dishDescription").value;

            if (!imgFile || !name || !price)
              return alertaDoSistema(
                "* * *",
                "Preencha todos os campos e selecione uma imagem!",
                "info",
              );

            const pratoObjeto = {
              id: Date.now(),
              nome: name,
              descricao: description,
              preco: price,
              categoria: category,
              arquivo: imgFile,
            };

            listaParaPublicar.push(pratoObjeto);

            const previewUrl = URL.createObjectURL(imgFile);
            renderizarMiniCard(pratoObjeto, previewUrl);

            document.getElementById("dishForm").reset();
            document.getElementById("preview").innerHTML = "Preview da imagem";
            updateCount();
          });

        document
          .getElementById("publishAll")
          .addEventListener("click", async (e) => {
            e.stopPropagation();
            e.preventDefault();
            if (listaParaPublicar.length === 0)
              return alertaDoSistema(
                "* * *",
                "Adicione pratos à lista primeiro!",
                "info",
              );
            await publicarPratos();
          });
      });
    }
  } catch (error) {
    console.error("Falha ao requerer os dados: ", error);
    localStorage.removeItem("token");
    window.location.href = "/layout/login";
  }
});

const logoutbtn = document.getElementById("logout");
if (logoutbtn) {
  logoutbtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "/layout/login";
  });
}
