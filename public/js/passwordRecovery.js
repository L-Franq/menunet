const formverify = document.getElementById("formVerifyEmail");
const erroElement = document.getElementById("erro");
const btnVerify = document.getElementById("verificar");

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

formverify.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;

  await emailCheck({ email });
});

async function emailCheck(dadosLogin) {
  try {
    const response = await fetch("/menunet/dados/esqueci-senha", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(dadosLogin),
    });

    const dadosServer = await response.json();

    if (response.ok) {
      alertaDoSistema(
        "* * *",
        dadosServer.mensagem ||
          "Email de recuperacao enviado, verifique a caixa de entrada.",
        "success",
      );
    } else {
      erroElement.classList.remove("hidden");
      erroElement.innerText = dadosServer.erro || "Email nao encontrado!";
    }
  } catch (error) {
    console.error("falha na requisicao ", error);
    erroElement.classList.remove("hidden");
    erroElement.innerText = "Falha na conexao. Tente mais tarde!";
  }
}
