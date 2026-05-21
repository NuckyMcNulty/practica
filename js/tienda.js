// js/tienda.js
import { ref, onValue } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-database.js";
import { db } from "./firebase.js";

const grid = document.getElementById("gridProductos");
const status = document.getElementById("status");

/* Dibuja los productos en pantalla con estética de archivo histórico */
function render(lista) {
  grid.innerHTML = "";

  if (lista.length === 0) {
    grid.innerHTML = `
      <div class="col-12 text-center py-5" style="border: 1px dashed var(--border); border-radius: var(--radius);">
        <p class="mb-0" style="font-family: 'Cinzel', serif; color: var(--muted); letter-spacing: 0.1em;">
          EL ARCHIVO ESTÁ VACÍO. NO HAY CRÓNICAS DISPONIBLES.
        </p>
      </div>
    `;
    return;
  }

  for (const p of lista) {
    const col = document.createElement("div");
    col.className = "col-12 col-md-4";

    // Estilizado usando las variables de tu styles.css y eliminando bordes redondeados excesivos
    col.innerHTML = `
      <article class="card h-100" style="background-color: var(--card); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; transition: border-color 0.3s ease;">
        <a href="producto.html?id=${p.id}" class="product-link" style="display: block; overflow: hidden; background: #000;">
          <img src="${p.imagen}" class="card-img-top" alt="${p.nombre}" style="opacity: 0.85; transition: opacity 0.3s ease; object-fit: cover; aspect-ratio: 2/3;">
        </a>

        <div class="card-body d-flex flex-column justify-content-between p-4">
          <div>
            <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
              <h3 class="card-title m-0" style="font-family: 'Cinzel', serif; font-size: 1rem; color: var(--text); letter-spacing: 0.05em; line-height: 1.4;">
                ${p.nombre}
              </h3>
            </div>
            <p class="mb-3" style="font-size: 0.85rem; color: var(--muted); font-family: 'Cinzel', serif; letter-spacing: 0.1em; text-transform: uppercase;">
              [ ${p.categoria} ]
            </p>
          </div>
          <p class="m-0" style="font-family: 'Inter', sans-serif; font-size: 1.1rem; font-weight: 600; color: var(--text); letter-spacing: 0.05em;">
            $${p.precio}
          </p>
        </div>
      </article>
    `;

    // Efecto sutil al pasar el cursor (opcional pero eleva el diseño)
    const cardElement = col.querySelector('.card');
    const imgElement = col.querySelector('img');
    cardElement.addEventListener('mouseenter', () => {
      cardElement.style.borderColor = 'var(--text)';
      imgElement.style.opacity = '1';
    });
    cardElement.addEventListener('mouseleave', () => {
      cardElement.style.borderColor = 'var(--border)';
      imgElement.style.opacity = '0.85';
    });

    grid.appendChild(col);
  }
}

// Mensaje inicial de carga adaptado al tono solemne
status.innerHTML = `<p style="font-family: 'Cinzel', serif; letter-spacing: 0.15em; color: var(--muted);">Invocando registros desde el archivo...</p>`;

/* Lectura en tiempo real desde la ruta store en Firebase */
onValue(
  ref(db, "store"),
  (snapshot) => {
    const data = snapshot.val();

    if (!data) {
      render([]);
      status.innerHTML = `<p style="font-family: 'Cinzel', serif; letter-spacing: 0.1em; color: var(--accent);">Advertencia: No se encontraron registros en la ruta 'store'.</p>`;
      return;
    }

    const productos = Object.entries(data).map(([id, p]) => ({
      id,
      ...p
    }));

    render(productos);
    
    // Un mensaje discreto en lugar de una alerta verde gigante de Bootstrap
    status.innerHTML = `
      <span style="font-family: 'Cinzel', serif; font-size: 0.8rem; letter-spacing: 0.1em; color: var(--muted); border-top: 1px solid var(--border); display: block; padding-top: 1rem;">
        Registros vinculados con éxito: ${productos.length} copias de archivo encontradas.
      </span>
    `;
  },
  (err) => {
    console.error(err);
    status.innerHTML = `<p style="font-family: 'Cinzel', serif; letter-spacing: 0.1em; color: var(--accent);">Error sacramental: No se pudo establecer