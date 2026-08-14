const formRecovery = document.getElementById("formRecovery");
const erro = document.getElementById("erro");

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

const recuperarSenha = async () => {
  const tokenUrl = window.location.pathname.split("/").pop();
  if (!tokenUrl) {
    alertaDoSistemaErro(
      "Falha",
      "Token de recuperação não encontrado na URL!",
      "error",
    );
    return;
  }

  const senha = document.getElementById("senha").value;
  const confirmSenha = document.getElementById("confirmSenha");

  confirmSenha.addEventListener("input", (e) => {
    if (senha !== e.target.value) {
      erro.classList.remove("hidden");
      erro.innerText = "As senhas sao diferentes!";
    }
  });
  confirmSenha.addEventListener("change", () => {
    erro.innerText = "";
    erro.classList.add("hidden");
  });

  //Dados para recuperação de password
  const dadosParaEnviar = {
    token: tokenUrl,
    senha: senha,
  };

  try {
    const response = await fetch("/menunet/dados/rec/password", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(dadosParaEnviar),
    });

    const dadosServer = await response.json();

    if (response.ok) {
      const mensagem = dadosServer.mensagem;
      alertaDoSistema(
        "Recuperado!",
        mensagem || "Password atualizada!",
        "success",
      );

      setTimeout(() => (window.location.href = "/layout/login"), 2000);
    } else {
      const errorMessage = dadosServer.erro;
      erro.classList.remove("hidden");
      erro.innerText = errorMessage;
    }
  } catch (error) {
    console.error("Falha na requisicao: ", error);
  }
};

formRecovery.addEventListener("submit", async (e) => {
  e.preventDefault();
  await recuperarSenha();
});
