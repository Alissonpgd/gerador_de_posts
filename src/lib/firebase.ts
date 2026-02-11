// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBcFjtJFjdidvEP-7rxUih1o2UWCV6qV94",
    authDomain: "geradordeposts.firebaseapp.com",
    projectId: "geradordeposts",
    storageBucket: "geradordeposts.firebasestorage.app",
    messagingSenderId: "147078966469",
    appId: "1:147078966469:web:9a2e26c205d06c4f4ed4ac"
};

// Initialize Firebase
// Essa lógica evita que o Firebase inicialize duas vezes (causando erro no Next.js)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// O Firestore é onde salvaremos os TEXTOS (vagas, requisitos, e-mail)
export const db = getFirestore(app);

// O Storage é onde salvaremos as IMAGENS (logos e fotos de fundo)
export const storage = getStorage(app);