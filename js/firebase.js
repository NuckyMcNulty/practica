// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-database.js";

/* Configuración del proyecto Firebase */
const firebaseConfig = {
  apiKey: "AIzaSyDkr8gizZfUfKjiG1ti3xrOx-kKmSBUM3M",
  authDomain: "test-44163.firebaseapp.com",
  databaseURL: "https://test-44163-default-rtdb.firebaseio.com",
  projectId: "test-44163",
  storageBucket: "test-44163.firebasestorage.app",
  messagingSenderId: "1061076437761",
  appId: "1:1061076437761:web:8061314c3a23068ff2a900"
};

/* Inicialización */
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);