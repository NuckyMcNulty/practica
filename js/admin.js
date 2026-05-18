// js/admin.js
import { db, auth } from "./firebase.js";
import {
  ref,
  get,
  onValue
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-database.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

const status       = document.getElementById("status");
const panelAdmin   = document.getElementById("panel-admin");
const navUsuario   = document.getElementById("nav-usuario");
const btnLogout    = document.getElementById("btn-logout");

// =====================================================
// VERIFICAR SI EL USUARIO ES ADMIN
//
// Cuando el usuario inicia sesión, revisamos si su UID
// existe en el nodo "admins" de Firebase.
// Si existe → mostramos el panel.
// Si no → mostramos error y lo mandamos al inicio.
// =====================================================

onAuthStateChanged(auth, async (usuario) => {

  if (!usuario) {
    // No hay sesión — mandamos al login
    status.innerHTML = `
      <div class="alert alert-warning">
        Debes iniciar sesión para acceder a esta página.
        <a href="auth.html" class="alert-link ms-2">Iniciar sesión</a>
      </div>`;
    return;
  }

  // Hay sesión — verificamos si es admin
  navUsuario.textContent = usuario.email;
  btnLogout.style.display = "block";

  status.innerHTML = `<div class="alert alert-info">Verificando permisos…</div>`;

  // Leemos el nodo admins/{uid} en Firebase
  const adminSnap = await get(ref(db, `admins/${usuario.uid}`));

  if (!adminSnap.exists()) {
    // No es admin — bloqueamos el acceso
    status.innerHTML = `
      <div class="alert alert-danger">
        ⛔ No tienes permisos para acceder a esta página.
        <a href="index.html" class="alert-link ms-2">Volver al inicio</a>
      </div>`;
    return;
  }

  // ✅ Es admin — mostramos el panel
  status.innerHTML = "";
  panelAdmin.style.display = "block";

  cargarContactos();
  cargarOrdenes();
});


// =====================================================
// LOGOUT
// =====================================================

btnLogout.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});


// =====================================================
// CARGAR CONTACTOS
// onValue escucha en tiempo real — si llega un mensaje
// nuevo, la lista se actualiza sola
// =====================================================

function cargarContactos() {
  const lista = document.getElementById("lista-contactos");

  onValue(ref(db, "contactos"), (snapshot) => {
    const data = snapshot.val();

    if (!data) {
      lista.innerHTML = `<p class="text-muted">No hay mensajes todavía.</p>`;
      return;
    }

    const mensajes = Object.entries(data).reverse();

    lista.innerHTML = mensajes.map(([id, m]) => `
      <div class="border rounded-3 p-3 mb-3">
        <div class="d-flex justify-content-between align-items-start mb-1">
          <strong>${m.nombre}</strong>
          <span class="text-muted small">${m.email}</span>
        </div>
        <p class="mb-1">${m.mensaje}</p>
        ${m.diaPreferido ? `<span class="badge text-bg-light border">📅 ${m.diaPreferido}</span>` : ""}
      </div>
    `).join("");
  });
}


// =====================================================
// CARGAR ÓRDENES DE TODOS LOS USUARIOS
// Leemos el nodo "ordenes" completo — esto solo funciona
// si las Firebase Rules permiten leerlo al admin
// =====================================================

function cargarOrdenes() {
  const lista = document.getElementById("lista-ordenes");

  onValue(ref(db, "ordenes"), (snapshot) => {
    const data = snapshot.val();

    if (!data) {
      lista.innerHTML = `<p class="text-muted">No hay órdenes todavía.</p>`;
      return;
    }

    // data tiene forma: { uid1: { ordenId: {...} }, uid2: {...} }
    const filas = [];

    for (const [uid, ordenes] of Object.entries(data)) {
      for (const [ordenId, orden] of Object.entries(ordenes)) {
        filas.push({ uid, ordenId, ...orden });
      }
    }

    // Más recientes primero
    filas.reverse();

    lista.innerHTML = filas.map(o => `
      <div class="border rounded-3 p-3 mb-3">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <span class="badge text-bg-dark">${o.ordenId}</span>
          <span class="text-muted small">UID: ${o.uid.slice(0, 10)}…</span>
        </div>
        <ul class="mb-2 ps-3">
          ${(o.items || []).map(i => `<li>${i.nombre} × ${i.cantidad} — $${i.precio}</li>`).join("")}
        </ul>
        <strong>Total: $${o.total || "—"}</strong>
      </div>
    `).join("");
  });
}


// =====================================================
// TABS — alternar entre Contactos y Órdenes
// =====================================================

window.mostrarTab = (tab) => {
  document.getElementById("tab-contactos").style.display = tab === "contactos" ? "block" : "none";
  document.getElementById("tab-ordenes").style.display   = tab === "ordenes"   ? "block" : "none";

  document.querySelectorAll("#adminTabs .nav-link").forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");
};

