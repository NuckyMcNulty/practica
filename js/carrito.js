/*
  ======================================================
  // ARCHIVO DE CONTROL: LA COSECHA (CARRITO)
  Manejo de recolección y ofrendas por usuario indexado.
  ======================================================
*/

import { db, auth } from "./firebase.js";
import {
  ref,
  push,
  set,
  onValue
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-database.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

/**
 * Añade una copia de archivo al altar de recolección del usuario
 * @param {Object} product - La pieza o crónica cinematográfica a reclamar
 */
export async function addToUserCart(product) {
  const user = auth.currentUser;

  if (!user) {
    // Error imbuido de la atmósfera del pacto de autenticación
    throw new Error("Acceso denegado. Debes declarar tu firma e iniciar sesión ante el umbral.");
  }

  // Indexación en la ruta de cosechas del usuario único (UID)
  const newRef = push(ref(db, `carts/${user.uid}`));
  await set(newRef, product);
}

/**
 * Escucha en tiempo real las piezas reclamadas por el usuario activo
 * @param {Function} callback - Transmite el arreglo de crónicas al render visual
 */
export function listenUserCart(callback) {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      // Si no hay firma activa, el altar se reporta vacío
      callback([]);
      return;
    }

    // Monitoreo en tiempo real de la ruta 'carts' vinculada al UID
    onValue(ref(db, `carts/${user.uid}`), (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        callback([]);
        return;
      }

      // Conversión de los nodos del archivo en un arreglo procesable
      const items = Object.values(data);
      callback(items);
    });
  });
}

// Lógica requerida en producto.html al dar clic en comprar
btnComprar.addEventListener("click", async () => {
  try {
    await addToUserCart(productoActual);
  } catch (error) {
    // Si el error es por falta de sesión, mandarlo al login sacramental
    window.location.href = "auth.html";
  }
});