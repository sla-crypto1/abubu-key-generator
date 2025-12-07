function generateKey() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let part1 = "", part2 = "", part3 = "";

    for (let i = 0; i < 4; i++) {
        part1 += chars[Math.floor(Math.random() * chars.length)];
        part2 += chars[Math.floor(Math.random() * chars.length)];
        part3 += chars[Math.floor(Math.random() * chars.length)];
    }

    return `ABUBU-${part1}-${part2}-${part3}`;
}

function saveKey(key) {
    const expiration = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem("abubu_key", key);
    localStorage.setItem("abubu_exp", expiration);
}

function loadKey() {
    const savedKey = localStorage.getItem("abubu_key");
    const exp = localStorage.getItem("abubu_exp");

    if (!savedKey || !exp) return null;

    if (Date.now() > Number(exp)) {
        localStorage.removeItem("abubu_key");
        localStorage.removeItem("abubu_exp");
        return null;
    }

    return savedKey;
}

function updateTimer() {
    const exp = localStorage.getItem("abubu_exp");
    if (!exp) return;

    const now = Date.now();
    const timeLeft = Number(exp) - now;

    if (timeLeft <= 0) {
        document.getElementById("timer").innerText = "Expirada";
        return;
    }

    const hours = Math.floor(timeLeft / 3600000);
    const minutes = Math.floor((timeLeft % 3600000) / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);

    document.getElementById("timer").innerText =
        `Expira em: ${hours}h ${minutes}m ${seconds}s`;
}

document.getElementById("generateBtn").onclick = function () {
    let key = loadKey();

    if (!key) {
        key = generateKey();
        saveKey(key);
    }

    document.getElementById("generatedKey").innerText = key;
    document.getElementById("keyBox").classList.remove("hide");

    updateTimer();
    setInterval(updateTimer, 1000);
};

document.getElementById("copyBtn").onclick = function () {
    const key = document.getElementById("generatedKey").innerText;
    navigator.clipboard.writeText(key);
    alert("Key copiada!");
};
