// js/auth.js
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

/**
 * Traduce e imbuye de solemnidad los errores crudos de Firebase
 */
function traducirError(err) {
  console.error(err);
  switch (err.code) {
    case 'auth/email-already-in-use':
      return "✕ Esta dirección ya se encuentra indexada en nuestros registros.";
    case 'auth/weak-password':
      return "✕ La clave secreta es demasiado frágil. Requiere mayor rigor.";
    case 'auth/invalid-email':
      return "✕ La estructura de la dirección digital es inválida o arcaica.";
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return "✕ Credenciales desconocidas. El acceso ha sido denegado en el umbral.";
    default:
      return `✕ Error sacramental: ${err.message}`;
  }
}

/* Registro (Pacto Inicial) */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = form.email.value;
  const password = form.password.value;

  status.style.color = "var(--muted)";
  status.innerHTML = "Inscribiendo identidad en el libro de registro...";

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    status.style.color = "var(--text)";
    status.innerHTML = "✓ Identidad grabada de forma perpetua.";
  } catch (err) {
    status.style.color = "var(--accent)";
    status.innerHTML = traducirError(err);
  }
});

/* Login (Entrar al Umbral) */
loginBtn.addEventListener("click", async () => {
  const email = form.email.value;
  const password = form.password.value;

  if (!email || !password) {
    status.style.color = "var(--accent)";
    status.innerHTML = "✕ Debes declarar tus credenciales ante el umbral.";
    return;
  }

  status.style.color = "var(--muted)";
  status.innerHTML = "Verificando firmas con la base central...";

  try {
    await signInWithEmailAndPassword(auth, email, password);
    status.style.color = "var(--text)";
    status.innerHTML = "✓ Acceso concedido al archivo central.";
  } catch (err) {
    status.style.color = "var(--accent)";
    status.innerHTML = traducirError(err);
  }
});

/* Logout (Revocar la Firma) */
logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    status.style.color = "var(--muted)";
    status.innerHTML = "// Credenciales revocadas con éxito.";
  } catch (err) {
    status.style.color = "var(--accent)";
    status.innerHTML = "✕ No se pudo disolver la sesión activa.";
  }
});

/* Monitoreo del Estado de la Firma */
onAuthStateChanged(auth, (user) => {
  if (user) {
    userText.style.color = "var(--muted)";
    userText.innerHTML = `Identidad Activa: <span style="color: var(--text); font-weight: 400;">${user.email}</span>`;
  } else {
    userText.style.color = "var(--muted)";
    userText.textContent = "// Ninguna firma activa en esta sesión.";
  }
});