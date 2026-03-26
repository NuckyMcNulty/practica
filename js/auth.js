import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

const form = document.getElementById("authForm");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const status = document.getElementById("authStatus");
const userText = document.getElementById("authUser");

/* Registro */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = form.email.value;
  const password = form.password.value;

  status.innerHTML = "Creando cuenta...";

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    status.innerHTML = "Cuenta creada";
  } catch (err) {
    status.innerHTML = err.message;
  }
});

/* Login */
loginBtn.addEventListener("click", async () => {
  const email = form.email.value;
  const password = form.password.value;

  status.innerHTML = "Iniciando sesión...";

  try {
    await signInWithEmailAndPassword(auth, email, password);
    status.innerHTML = "Sesión iniciada";
  } catch (err) {
    status.innerHTML = err.message;
  }
});

/* Logout */
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
});

/* Estado de sesión */
onAuthStateChanged(auth, (user) => {
  if (user) {
    userText.textContent = "Usuario: " + user.email;
  } else {
    userText.textContent = "No hay sesión activa";
  }
});