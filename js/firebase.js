/*
  ======================================================
  // REGISTRO DE ORIGEN: NÚCLEO DE CONEXIÓN DE RED (FIREBASE)
  Establece el canal perpetuo con el servidor central.
  ======================================================
*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

/* Manifiesto de Configuración e Identidad del Servidor */
const firebaseConfig = {
  apiKey: "AIzaSyCQQYMUgoUx-efjOGC1yvTZExFsbtMI57s",
  authDomain: "logitechtechg.firebaseapp.com",
  databaseURL: "https://logitechtechg-default-rtdb.firebaseio.com",
  projectId: "logitechtechg",
  storageBucket: "logitechtechg.firebasestorage.app",
  messagingSenderId: "416244789524",
  appId: "1:416244789524:web:0fffd9cee2379a7ee85201"
};

/* Inicialización del Vínculo Maestro */
const app = initializeApp(firebaseConfig);

/* Exportación de Instancias para las Crónicas Visuales */
export const db = getDatabase(app); // Base de Datos Central (Registros en Tiempo Real)
export const auth = getAuth(app);   // Control del Altar de Firmas (Autenticación)