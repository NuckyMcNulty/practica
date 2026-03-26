import { ref, onValue } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-database.js";
import { db } from "./firebase.js";
import { addToUserCart } from "./carrito.js";

const grid = document.getElementById("gridProductos");
const status = document.getElementById("status");

function render(lista) {
  grid.innerHTML = "";

  for (const p of lista) {
    const div = document.createElement("div");
    div.className = "col-4";

    div.innerHTML = `
      <div class="card p-2 mb-3">
        <img src="${p.imagen}" class="img-fluid">
        <h5>${p.nombre}</h5>
        <p>$${p.precio}</p>
        <button class="btn btn-success btn-add" data-id="${p.id}">
          Agregar
        </button>
      </div>
    `;

    grid.appendChild(div);
  }

  grid.querySelectorAll(".btn-add").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const product = lista.find(p => p.id === btn.dataset.id);

      try {
        await addToUserCart(product);
        status.innerHTML = "Producto agregado";
      } catch (err) {
        status.innerHTML = err.message;
      }
    });
  });
}

onValue(ref(db, "store"), (snapshot) => {
  const data = snapshot.val();

  if (!data) return;

  const productos = Object.entries(data).map(([id, p]) => ({
    id,
    ...p
  }));

  render(productos);
});