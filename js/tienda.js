// js/tienda.js
import { ref, onValue } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-database.js";
import { db } from "./firebase.js";

const grid = document.getElementById("gridProductos");
const status = document.getElementById("status");

/* Dibuja los productos en pantalla */
function render(lista) {
  grid.innerHTML = "";

  if (lista.length === 0) {
    grid.innerHTML = `
      <div class="col-12">
        <div class="alert alert-warning">No hay productos para mostrar.</div>
      </div>
    `;
    return;
  }

  for (const p of lista) {
    const col = document.createElement("div");
    col.className = "col-12 col-md-4";

    col.innerHTML = `
      <article class="card h-100 shadow-sm">
        <a href="producto.html?id=${p.id}" class="product-link">
          <img src="${p.imagen}" class="card-img-top" alt="${p.nombre}">
        </a>

        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start gap-2">
            <h3 class="h6 card-title mb-1">${p.nombre}</h3>
            <span class="badge text-bg-dark">${p.categoria}</span>
          </div>
          <p class="text-muted mb-0">$${p.precio}</p>
        </div>
      </article>
    `;

    grid.appendChild(col);
  }
}

status.innerHTML = `<div class="alert alert-info">Cargando productos…</div>`;

/* Lectura en tiempo real desde la ruta store */
onValue(
  ref(db, "store"),
  (snapshot) => {
    const data = snapshot.val();

    if (!data) {
      render([]);
      status.innerHTML = `<div class="alert alert-warning">No hay datos en store.</div>`;
      return;
    }

    const productos = Object.entries(data).map(([id, p]) => ({
      id,
      ...p
    }));

    render(productos);
    status.innerHTML = `<div class="alert alert-success">Productos cargados: ${productos.length}</div>`;
  },
  (err) => {
    console.error(err);
    status.innerHTML = `<div class="alert alert-danger">Error al leer productos.</div>`;
  }
);