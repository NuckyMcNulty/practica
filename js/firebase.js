// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-database.js";

/* Configuración del proyecto Firebase */
const firebaseConfig = {
  apiKey: "AIzaSyCQQYMUgoUx-efjOGC1yvTZExFsbtMI57s",
  authDomain: "logitechtechg.firebaseapp.com",
  databaseURL: "https://logitechtechg-default-rtdb.firebaseio.com",
  projectId: "logitechtechg",
  storageBucket: "logitechtechg.firebasestorage.app",
  messagingSenderId: "416244789524",
  appId: "1:416244789524:web:0fffd9cee2379a7ee85201"
};

/* Inicialización */
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);