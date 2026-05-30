const novoItem1 = document.getElementById("n2");
const main = document.getElementById("pai");
const imgInput = document.getElementById("imgInput");
const preview = document.getElementById("preview");
const perfilSettings = document.getElementById("perfil-settings");

const alertaDoSistema = function (title, text, icon) {
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

novoItem1.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "/layout/historico";
});

document.getElementById("addToQueue").addEventListener("click", function () {
  const name = document.getElementById("dishName").value;
  const price = document.getElementById("dishPrice").value;
  const queue = document.getElementById("dishQueue");
  const emptyState = document.querySelector(".empty-state");

  if (!name || !price) return alert("Preencha o nome e o preço!");

  if (emptyState) emptyState.remove();

  // Criar o mini-card
  const card = document.createElement("div");
  card.className = "mini-card animate__animated animate__fadeInRight";
  card.innerHTML = `
        <img src="../img/logo.jpg" alt="Prato">
        <div class="mini-card-info">
            <h4>${name}</h4>
            <span>${price} Kz</span>
        </div>
        <button class="btn-remove-mini"><i class="fa-solid fa-trash"></i></button>
    `;

  // Botão de remover da lista
  card.querySelector(".btn-remove-mini").onclick = function () {
    card.remove();
    updateCount();
  };

  queue.appendChild(card);
  updateCount();

  // Limpar campos
  document.getElementById("dishForm").reset();
  document.getElementById("preview").innerHTML = "Preview da imagem";
});

function updateCount() {
  const count = document.querySelectorAll(".mini-card").length;
  document.getElementById("queueCount").innerText = count;
}

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const nome = document.getElementById("manegerName");

  try {
    const response = await fetch("/menunet/dados/dadosrestaurantes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${token}`,
      },
    });

    const dadosServer = await response.json();

    if (response.ok) {
      alertaDoSistema(
        "Oi!",
        dadosServer.mensagem || `Bem-vindo ${dadosServer.restaurante.nome}`,
      "info");

      nome.innerText = "";
      nome.innerText = dadosServer.restaurante.nome;
    }

    const perfil = document.getElementById("perfil1");

    if (perfil) {
      perfil.addEventListener("click", (e) => {
        e.preventDefault();
        perfilSettings.classList.remove("hidden");
        main.classList.add("hidden");

        let slug = document.getElementById("slug").value;
        let nomeSettings = document.getElementById("nomeSettings").value;
        let senhaSettings = document.getElementById("senhaSettings").value;

        slug = "";
        nomeSettings = "";
        senhaSettings = "";
        slug = dadosServer.restaurante.slug;
        nomeSettings = dadosServer.restaurante.nome;
        senhaSettings = dadosServer.restaurante.senha;
      });
    }

    const novoItem = document.getElementById("n1");

    if (novoItem) {
      novoItem.addEventListener("click", (e) => {
        e.preventDefault();
        perfilSettings.classList.add("hidden");
        main.classList.remove("hidden");
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
