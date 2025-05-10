// view.js
const container = document.getElementById("quote-container");
const button = document.getElementById("get-quote");

export function disableButton() {
  button.disabled = true;
}

export function enableButton() {
  button.disabled = false;
}

export function clearView() {
  container.innerHTML = "";
  container.classList.remove("visible", "fade-out");
  clearInvalidDateMessage();
}

export function renderQuote({ quote, author, sign, emoji }) {
  container.innerHTML = `
    <p>"${quote}"</p>
    <p><em>- ${author}</em></p>
    <p>${emoji} ${sign}</p>
  `;
  container.classList.remove("fade-out");
  container.classList.add("visible");
}

export function renderError() {
  container.textContent =
    "Error al obtener el horóscopo. Mira la consola para más detalles.";
  container.classList.add("visible");
}

export function fadeOut() {
  container.classList.add("fade-out");
}

export function showInvalidDateMessage() {
  let error = document.getElementById("date-error");
  if (!error) {
    error = document.createElement("p");
    error.id = "date-error";
    error.style.color = "red";
    error.style.marginTop = "0.5rem";
    error.textContent = "Fecha inválida. Usa el formato DD-MM-AAAA.";
    document.body.insertBefore(error, container);
  }
}

export function clearInvalidDateMessage() {
  const error = document.getElementById("date-error");
  if (error) {
    error.remove();
  }
}