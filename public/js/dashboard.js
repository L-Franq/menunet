const btnIrHistorico = document.getElementById("n2");
const main = document.getElementById("pai");
const imgInput = document.getElementById("imgInput");
const preview = document.getElementById("preview");
const perfilSettings = document.getElementById("perfil-settings");
const QrContainer = document.getElementById("Qr-container");

/*Array para armazenar temporáriamente no frontend 
informações dos pratos a ser publicados*/
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

btnIrHistorico.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "/layout/historico";
});

function renderizarMiniCard(prato, url) {
  const queue = document.getElementById("dishQueue");
  const card = document.createElement("div");
  card.className = "mini-card";
  card.innerHTML = `
        <img src="${url}" alt="${prato.nome}">
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
      nome.innerText = "";
      nome.innerText = dadosServer.restaurante.nome;
    }

    const btnEditarPerfil = document.getElementById("perfil1");

    if (btnEditarPerfil) {
      btnEditarPerfil.addEventListener("click", (e) => {
        e.preventDefault();
        QrContainer.classList.add("hidden");
        perfilSettings.classList.remove("hidden");
        main.classList.add("hidden");

        document.getElementById("slug").value =
          `${dadosServer.restaurante.slug}`;
        document.getElementById("nomeSettings").value =
          `${dadosServer.restaurante.nome}`;
        document.getElementById("senhaSettings").value =
          `${dadosServer.restaurante.senha}`;
        document.getElementById("emailSettings").value =
          `${dadosServer.restaurante.email}`;

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

    const btnAdicionarPratos = document.getElementById("n1");

    if (btnAdicionarPratos) {
      btnAdicionarPratos.addEventListener("click", (e) => {
        e.preventDefault();
        QrContainer.classList.add("hidden");
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

            const priceRegex = price.match(/\d+(\.\d+)?/);
            if (priceRegex === null)
              return alertaDoSistema(
                "* * *",
                "Preço inválido! Evite vírgula(0,00). Para cêntavos use ponto(0.00).",
                "info",
              );

            const priceConvert = parseFloat(price);

            const pratoObjeto = {
              id: Date.now(),
              nome: name,
              descricao: description,
              preco: priceConvert.toFixed(2),
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

    const qrCode = document.getElementById("qrCode");

    if (qrCode) {
      const slug = dadosServer.restaurante.slug;
      qrCode.addEventListener("click", (e) => {
        e.preventDefault();

        perfilSettings.classList.add("hidden");
        main.classList.add("hidden");
        QrContainer.classList.remove("hidden");

        const container = document.getElementById("canvas-qrcode");
        container.innerHTML = "";

        const urlDoMenu = `https://menunet.onrender.com/layout/menunet/${slug}`;

        const qrCode = new QRCode(container, {
          text: urlDoMenu,
          width: 256,
          height: 240,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H,
        });

        const btncopy = document.getElementById("btncopy");
        const urlInput = document.getElementById("campo");
        const feedback = document.getElementById("feedback");
        campo.setAttribute(
          "value",
          `https://menunet.onrender.com/layout/menunet/${slug}`,
        );

        btncopy.addEventListener("click", async () => {
          try {
            await navigator.clipboard.writeText(urlInput.value);
            feedback.textContent = "Link compiado!";
            setTimeout(() => {
              feedback.textContent = "";
            }, 2000);
          } catch (error) {
            feedback.textContent = "Falha ao copiar!";
            console.error(error);
          }
        });

        document
          .getElementById("btn-baixar-qr")
          .addEventListener("click", () => {
            const imgQrCode = container.querySelector("img");

            if (imgQrCode && imgQrCode.src) {
              // Detecta se é telemóvel/tablet
              const isMobile =
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                  navigator.userAgent,
                );

              if (isMobile) {
                const novaAba = window.open();
                if (novaAba) {
                  novaAba.document.write(`
            <html>
              <head><title>Guardar QR Code</title></head>
              <body style="margin:0; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; background:#f0f0f0; font-family:sans-serif;">
                <p style="margin-bottom: 20px; color: #333; font-size: 16px; text-align: center;">Mantenha o dedo premido na imagem abaixo e escolha <b>"Descarregar imagem"</b>:</p>
                <img src="${imgQrCode.src}" style="max-width:80%; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);" />
              </body>
            </html>
          `);
                } else {
                  // Fallback caso o navegador bloqueie pop-ups
                  window.location.href = imgQrCode.src;
                }
              } else {
                // No PC: O download direto por link funciona perfeitamente
                const linkBaixar = document.createElement("a");
                linkBaixar.href = imgQrCode.src;
                linkBaixar.download = `qrcode-${slug}.png`;

                document.body.appendChild(linkBaixar);
                linkBaixar.click();
                document.body.removeChild(linkBaixar);
              }
            }
          });
      });
    }

    const verMenu = document.getElementById("verMenu");

    if (verMenu) {
      verMenu.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "/layout/gerirpratos";
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
