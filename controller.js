// controller.js
import { fetchQuote } from "./model.js";
import {
  disableButton,
  enableButton,
  clearView,
  renderQuote,
  renderError,
  fadeOut,
  showInvalidDateMessage,
  clearInvalidDateMessage
} from "./view.js";

const input = document.getElementById("birthdate");
const button = document.getElementById("get-quote");

let timeoutId;

input.addEventListener("input", () => {
  let val = input.value.replace(/\D/g, ""); // Solo dígitos
  if (val.length >= 8) {
    val = `${val.slice(0, 2)}-${val.slice(2, 4)}-${val.slice(4, 8)}`;
    input.value = val;
  }

  const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
  const match = input.value.match(dateRegex);

  if (match) {
    const [_, day, month, year] = match.map(Number);
    const testDate = new Date(`${year}-${month}-${day}`);
    const isValidDate =
      testDate &&
      testDate.getDate() === day &&
      testDate.getMonth() + 1 === month &&
      testDate.getFullYear() === year;

    if (isValidDate) {
      clearInvalidDateMessage();
      enableButton();
    } else {
      showInvalidDateMessage();
      disableButton();
    }
  } else {
    showInvalidDateMessage();
    disableButton();
  }
});

function getZodiacEmoji(day, month) {
  const zodiac = [
    { sign: "Capricornio", emoji: "♑️", start: "22-12", end: "19-01" },
    { sign: "Acuario", emoji: "♒️", start: "20-01", end: "18-02" },
    { sign: "Piscis", emoji: "♓️", start: "19-02", end: "20-03" },
    { sign: "Aries", emoji: "♈️", start: "21-03", end: "19-04" },
    { sign: "Tauro", emoji: "♉️", start: "20-04", end: "20-05" },
    { sign: "Géminis", emoji: "♊️", start: "21-05", end: "20-06" },
    { sign: "Cáncer", emoji: "♋️", start: "21-06", end: "22-07" },
    { sign: "Leo", emoji: "♌️", start: "23-07", end: "22-08" },
    { sign: "Virgo", emoji: "♍️", start: "23-08", end: "22-09" },
    { sign: "Libra", emoji: "♎️", start: "23-09", end: "22-10" },
    { sign: "Escorpio", emoji: "♏️", start: "23-10", end: "21-11" },
    { sign: "Sagitario", emoji: "♐️", start: "22-11", end: "21-12" },
  ];

  const inputDate = new Date(2000, month - 1, day);
  for (const z of zodiac) {
    const [startDay, startMonth] = z.start.split("-").map(Number);
    const [endDay, endMonth] = z.end.split("-").map(Number);
    const start = new Date(2000, startMonth - 1, startDay);
    const end = new Date(2000, endMonth - 1, endDay);

    if (
      (startMonth === 12 && month === 1 && day <= endDay) ||
      (inputDate >= start && inputDate <= end)
    ) {
      return z;
    }
  }
  return { sign: "Desconocido", emoji: "❓" };
}

async function onConsultarClick() {
  disableButton();
  clearView();
  clearTimeout(timeoutId);

  const [day, month] = input.value.split("-").map(Number);
  const { sign, emoji } = getZodiacEmoji(day, month);

  const data = await fetchQuote();
  if (!data) {
    renderError();
    timeoutId = setTimeout(() => {
      clearView();
      enableButton();
    }, 5000);
    return;
  }

  renderQuote({ ...data, sign, emoji });

  timeoutId = setTimeout(() => {
    fadeOut();
    setTimeout(() => {
      input.value = "";
      clearView();
      enableButton();
    }, 1000);
  }, 15000);
}

button.addEventListener("click", onConsultarClick);
