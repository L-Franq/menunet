const novoItem = document.getElementById("n1");
const novoItem1 = document.getElementById("n2");
const main = document.getElementById("pai");
const imgInput = document.getElementById("imgInput");
const preview = document.getElementById("preview");

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

novoItem.addEventListener("click", (e) => {
  e.preventDefault();
  main.classList.remove("hidden");
});

novoItem1.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "/layout/historico";
});
