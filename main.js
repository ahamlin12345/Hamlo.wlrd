
const firebaseConfig = {
  apiKey: "AIzaSyBCOIPJlmU77xIUWmsrWnoC6ERicFq5O-0",
  authDomain: "hamlo-wrld.firebaseapp.com",
  projectId: "hamlo-wrld",
  storageBucket: "hamlo-wrld.appspot.com",
  messagingSenderId: "209623934333",
  appId: "1:209623934333:web:0ff5cb131553a904639814",
  measurementId: "G-5BZCGPD6PW"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const artist = document.getElementById("artist").value;
  const genre = document.getElementById("genre").value;
  const releaseDate = document.getElementById("releaseDate").value;
  const file = document.getElementById("audioFile").files[0];
  const status = document.getElementById("uploadStatus");
  if (!file) return alert("Select a file.");
  status.innerText = "Uploading...";

  const storageRef = storage.ref("tracks/" + file.name);
  await storageRef.put(file);
  const url = await storageRef.getDownloadURL();
  await db.collection("tracks").add({ title, artist, genre, releaseDate, url, uploaded: new Date() });
  status.innerText = "Upload successful!";
  loadTracks();
});

async function loadTracks() {
  const container = document.getElementById("firebaseTracks");
  container.innerHTML = "";
  const snapshot = await db.collection("tracks").orderBy("uploaded", "desc").get();
  snapshot.forEach(doc => {
    const d = doc.data();
    const div = document.createElement("div");
    div.innerHTML = `<strong>${d.title}</strong> by ${d.artist}<br><audio controls src="${d.url}"></audio><hr>`;
    container.appendChild(div);
  });
}

const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");
let stars = [];
function initStars() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stars = Array.from({length: 300}, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    z: Math.random() * canvas.width
  }));
}
function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  stars.forEach(star => {
    const k = 128.0 / star.z;
    const px = star.x * k + canvas.width / 2;
    const py = star.y * k + canvas.height / 2;
    const size = (1 - star.z / canvas.width) * 2;
    ctx.beginPath();
    ctx.arc(px, py, size, 0, Math.PI * 2);
    ctx.fill();
    star.z -= 2;
    if (star.z <= 0) star.z = canvas.width;
  });
  requestAnimationFrame(drawStars);
}
window.addEventListener("resize", initStars);

// Games
let score = 0;
document.getElementById("alienBtn").addEventListener("click", () => {
  score++;
  document.getElementById("score").innerText = score;
});
document.getElementById("startBeatTapper").addEventListener("click", () => {
  document.getElementById("beatScore").innerText = Math.floor(Math.random() * 100);
});
let ship = { x: 290, y: 360, w: 20, h: 20 };
let meteors = [];
let dodgerScore = 0;
const dodgerCanvas = document.getElementById("dodgerCanvas");
const dCtx = dodgerCanvas.getContext("2d");
function spawnMeteor() {
  meteors.push({ x: Math.random() * 580, y: 0 });
}
function drawDodger() {
  dCtx.clearRect(0, 0, dodgerCanvas.width, dodgerCanvas.height);
  dCtx.fillStyle = "cyan";
  dCtx.fillRect(ship.x, ship.y, ship.w, ship.h);
  dCtx.fillStyle = "red";
  meteors.forEach(m => {
    dCtx.beginPath();
    dCtx.arc(m.x, m.y, 10, 0, Math.PI * 2);
    dCtx.fill();
  });
}
function updateDodger() {
  meteors.forEach((m, i) => {
    m.y += 3;
    if (m.x < ship.x + ship.w && m.x + 10 > ship.x && m.y < ship.y + ship.h && m.y + 10 > ship.y) {
      alert("Game Over! Final Score: " + dodgerScore);
      meteors = []; dodgerScore = 0;
    }
    if (m.y > 400) {
      meteors.splice(i, 1);
      dodgerScore++;
      document.getElementById("dodgerScore").innerText = dodgerScore;
    }
  });
  drawDodger();
  requestAnimationFrame(updateDodger);
}
document.getElementById("startDodger").addEventListener("click", () => {
  ship.x = 290; ship.y = 360; meteors = [];
  setInterval(spawnMeteor, 1000);
  updateDodger();
});
window.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" && ship.x > 0) ship.x -= 20;
  if (e.key === "ArrowRight" && ship.x + ship.w < dodgerCanvas.width) ship.x += 20;
});

initStars();
drawStars();
loadTracks();
