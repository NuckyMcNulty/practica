/*
  Manejo del carrito por usuario
  IMPORTANTE: usa onAuthStateChanged para evitar errores de sesión
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

/* Agregar producto */
export async function addToUserCart(product) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Debes iniciar sesión");
  }

  const newRef = push(ref(db, `carts/${user.uid}`));
  await set(newRef, product);
}

/* Escuchar carrito */
export function listenUserCart(callback) {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      callback([]);
      return;
    }

    onValue(ref(db, `carts/${user.uid}`), (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        callback([]);
        return;
      }

      const items = Object.values(data);
      callback(items);
    });
  });
}