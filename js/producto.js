// js/producto.js
import { db } from "./firebase.js";
import {
  ref,
  get,
  push,
  set,
  onValue,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-database.js";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const status = document.getElementById("status");
const detail = document.getElementById("productDetail");
const reviewForm = document.getElementById("reviewForm");
const reviewStatus = document.getElementById("reviewStatus");
const reviewsList = document.getElementById("reviewsList");

/* Carga un producto individual */
async function loadProduct() {
  if (!id) {
    status.innerHTML = `<div class="alert alert-danger">No se especificó un producto.</div>`;
    return;
  }

  status.innerHTML = `<div class="alert alert-info">Cargando producto…</div>`;

  const snapshot = await get(ref(db, `store/${id}`));

  if (!snapshot.exists()) {
    status.innerHTML = `<div class="alert alert-warning">Producto no encontrado.</div>`;
    return;
  }

  const producto = {
    id,
    ...snapshot.val()
  };

  detail.innerHTML = `
    <div class="row g-4 align-items-start">
      <div class="col-12 col-md-6">
        <img src="${producto.imagen}" alt="${producto.nombre}" class="img-fluid rounded-4">
      </div>

      <div class="col-12 col-md-6">
        <span class="badge text-bg-dark mb-2">${producto.categoria}</span>
        <h2 class="h3 mb-3">${producto.nombre}</h2>
        <p class="fs-5 text-muted">$${producto.precio}</p>
        <p>
          Este producto se está cargando dinámicamente desde Firebase Realtime Database.
        </p>
      </div>
    </div>
  `;

  status.innerHTML = "";
}

/* Escucha reviews en tiempo real */
function listenReviews() {
  onValue(ref(db, `reviews/${id}`), (snapshot) => {
    const data = snapshot.val();

    if (!data) {
      reviewsList.innerHTML = `<p class="text-muted mb-0">Todavía no hay reviews.</p>`;
      return;
    }

    const reviews = Object.entries(data)
      .map(([reviewId, r]) => ({ reviewId, ...r }))
      .reverse();

    reviewsList.innerHTML = reviews.map(r => `
      <div class="border rounded-3 p-3 mb-3">
        <div class="fw-semibold">${r.nombre}</div>
        <div>${r.mensaje}</div>
      </div>
    `).join("");
  });
}

/* Envío de reviews */
reviewForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    nombre: reviewForm.nombre.value.trim(),
    mensaje: reviewForm.mensaje.value.trim(),
    createdAt: serverTimestamp()
  };

  if (!data.nombre || !data.mensaje) {
    reviewStatus.innerHTML = `<div class="alert alert-warning">Completa todos los campos.</div>`;
    return;
  }

  reviewStatus.innerHTML = `<div class="alert alert-info">Enviando review…</div>`;

  try {
    const newRef = push(ref(db, `reviews/${id}`));
    await set(newRef, data);

    reviewStatus.innerHTML = `<div class="alert alert-success">Review enviada.</div>`;
    reviewForm.reset();
  } catch (err) {
    console.error(err);
    reviewStatus.innerHTML = `<div class="alert alert-danger">Error al enviar review.</div>`;
  }
});

loadProduct();
listenReviews();