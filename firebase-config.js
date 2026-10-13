// Configuración de Firebase vinculada a tu proyecto ofertazo
const firebaseConfig = {
  apiKey: "AIzaSyACYphF5b85od83mFcleRwBHku_K7wqjHo",
  authDomain: "ofertazo-3c06e.firebaseapp.com",
  projectId: "ofertazo-3c06e",
  storageBucket: "ofertazo-3c06e.firebasestorage.app",
  messagingSenderId: "592409855263",
  appId: "1:592409855263:web:aa7414cfd2ba389b5a1c2a"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
