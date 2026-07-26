const formCadastro = document.getElementById("formCadastro");
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

const senha = document.getElementById("senha");
const senhaConfirm = document.getElementById("senhaConfirm");

senha.addEventListener("input", (e) => {
  if (e.target.value.length < 8) {
    erroElement.classList.remove("hidden");
    erroElement.innerText = "Senha muito curta. Mínimo 8 caracteres!";
  }
  erroElement.classList.add("hidden");
});

senhaConfirm.addEventListener("input", (e) => {
  if (e.target.value !== senha) {
    erroElement.classList.remove("hidden");
    erroElement.innerText = "As senhas não são identicas.";
    return;
  }
  erroElement.classList.add("hidden");
});

formCadastro.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const slug = document.getElementById("slug").value;
  const senha = document.getElementById("senha").value;

  const sluArray = slug.split(" ");
  const lastSlug = sluArray.join("-");

  await cadastro({ nome, email, senha, lastSlug });
});

async function cadastro(dadosCadastro) {
  try {
    const response = await fetch("/menunet/dados/registro", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(dadosCadastro),
    });

    const dadosServer = await response.json();

    if (response.ok) {
      alertaDoSistema(
        "* * *",
        dadosServer.mensagem || "Cadastro bem sucedido!",
        "success",
      );
      window.location.href = "/layout/login";
    } else {
      erroElement.classList.remove("hidden");
      erroElement.innerText = dadosServer.erro || "Falha ao cadastrar!";
    }
  } catch (error) {
    console.error("Falha na requisicao: ", error);
    erroElement.classList.remove("hidden");
    erroElement.innerText = "Não foi possível conectar ao servidor!";
  }
}
