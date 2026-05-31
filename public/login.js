const formLogin = document.getElementById("formLogin");
const erroElement = document.getElementById("erro");

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

formLogin.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  await login({ email, senha });
});

async function login(dadosLogin) {
  try {
    const response = await fetch("/menunet/dados/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(dadosLogin),
    });

    const dadosServer = await response.json();

    if (response.ok) {
      localStorage.setItem("token", dadosServer.token);
      alertaDoSistema(
        "* * *",
        dadosServer.mensagem || "Logando com sucesso!",
        "success",
      );

      window.location.href = "/layout/dashboard";
    } else {
      erroElement.classList.remove("hidden");
      erroElement.innerText = dadosServer.erro || "Falha ao executar o login!";
    }
  } catch (error) {
    console.error("falha na requisicao ", error);
    erroElement.classList.remove("hidden");
    erroElement.innerText = "Não possível conectar ao servidor!";
  }
}
