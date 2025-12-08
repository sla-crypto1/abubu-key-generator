// CONFIG DO SEU FIREBASE (USE ESTA)
const firebaseConfig = {
    apiKey: "AIzaSyBtsqzcmV1KTgc9NKPC2rjqMI822b7Gkhs",
    authDomain: "keysystem-ec950.firebaseapp.com",
    databaseURL: "https://keysystem-ec950-default-rtdb.firebaseio.com",
    projectId: "keysystem-ec950",
    storageBucket: "keysystem-ec950.firebasestorage.app",
    messagingSenderId: "299233253616",
    appId: "1:299233253616:web:3a485b307624e18f558a35",
    measurementId: "G-EGGKW3XVHV"
};

// Inicializar Firebase
const app = window.initializeApp(firebaseConfig);
const db = window.getDatabase(app);
const keysRef = window.ref(db, "keys");

// =========================
// GERA UMA KEY
// =========================
function generateKey() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let p1 = "", p2 = "", p3 = "";
    for (let i = 0; i < 4; i++) {
        p1 += chars[Math.floor(Math.random() * chars.length)];
        p2 += chars[Math.floor(Math.random() * chars.length)];
        p3 += chars[Math.floor(Math.random() * chars.length)];
    }
    return `ABUBU-${p1}-${p2}-${p3}`;
}

// =========================
// SALVAR NO FIREBASE
// =========================
async function saveKeyToFirebase(key, exp) {
    await window.push(keysRef, {
        key: key,
        expiration: exp
    });

    localStorage.setItem("abubu_key", key);
    localStorage.setItem("abubu_exp", exp);

    displayGeneratedKey(key);
}

// =========================
// CARREGAR DO LOCALSTORAGE
// =========================
function loadKeyFromLocalStorage() {
    const key = localStorage.getItem("abubu_key");
    const exp = localStorage.getItem("abubu_exp");

    if (!key || !exp) return null;
    if (Date.now() > Number(exp)) {
        localStorage.clear();
        return null;
    }
    return key;
}

// =========================
// TIMER
// =========================
let timerInterval;

function displayGeneratedKey(key) {
    document.getElementById("generatedKey").innerText = key;
    document.getElementById("keyBox").classList.remove("hide");
    updateTimer();

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const exp = localStorage.getItem("abubu_exp");
    const timer = document.getElementById("timer");

    if (!exp) {
        timer.innerText = "Expirada";
        return;
    }

    const left = Number(exp) - Date.now();

    if (left <= 0) {
        timer.innerText = "Expirada";
        localStorage.clear();
        return;
    }

    const h = Math.floor(left / 3600000);
    const m = Math.floor((left % 3600000) / 60000);
    const s = Math.floor((left % 60000) / 1000);

    timer.innerText = `Expira em: ${h}h ${m}m ${s}s`;
}

// =========================
// BOTÕES
// =========================
document.getElementById("generateBtn").onclick = () => {
    let key = loadKeyFromLocalStorage();
    if (!key) {
        key = generateKey();
        const exp = Date.now() + 24 * 60 * 60 * 1000;
        saveKeyToFirebase(key, exp);
    } else {
        displayGeneratedKey(key);
    }
};

document.getElementById("copyBtn").onclick = () => {
    const key = document.getElementById("generatedKey").innerText;
    navigator.clipboard.writeText(key);
    alert("Key copiada!");
};

// =========================
// AO ABRIR O SITE
// =========================
window.onload = () => {
    const key = loadKeyFromLocalStorage();
    if (key) displayGeneratedKey(key);
    updateTimer();
};
