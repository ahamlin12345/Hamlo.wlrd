// Starfield Animation
const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");
let stars = [];

function initStarfield() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stars = [];
  for (let i = 0; i < 300; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      z: Math.random() * canvas.width
    });
  }
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  for (let star of stars) {
    let k = 128.0 / star.z;
    let px = star.x * k + canvas.width / 2;
    let py = star.y * k + canvas.height / 2;
    if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
      let size = (1 - star.z / canvas.width) * 2;
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
    }
    star.z -= 2;
    if (star.z <= 0) star.z = canvas.width;
  }
}

function animateStarfield() {
  drawStars();
  requestAnimationFrame(animateStarfield);
}

window.addEventListener("resize", initStarfield);
initStarfield();
animateStarfield();

// Upload Form Functionality
const uploadForm = document.getElementById("uploadForm");
uploadForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const trackData = {
    title: document.getElementById("title").value,
    artist: document.getElementById("artist").value,
    genre: document.getElementById("genre").value,
    releaseDate: document.getElementById("releaseDate").value
  };
  console.log("Track Uploaded:", trackData);
  alert("Track submitted! Check console for details.");
});

// MP3 Upload and Playback
document.getElementById("audioUpload").addEventListener("change", (e) => {
  const file = e.target.files[0];
  const player = document.getElementById("localPlayer");
  if (file) {
    const url = URL.createObjectURL(file);
    player.src = url;
    player.play();
  }
});

// Alien Beat Battle
let alienBtn = document.getElementById("alienBtn");
let score = 0;
alienBtn.addEventListener("click", () => {
  score++;
  document.getElementById("score").innerText = score;
});

// Cosmic Beat Tapper
document.getElementById("startBeatTapper").addEventListener("click", () => {
  document.getElementById("beatScore").innerText = Math.floor(Math.random() * 100);
});

// Starfield Dodger Game
let dodgerCanvas = document.getElementById("dodgerCanvas");
let dCtx = dodgerCanvas.getContext("2d");
let ship = { x: 290, y: 360, w: 20, h: 20 };
let meteors = [];
let dodgerScore = 0;
let dodgerInterval;

function spawnMeteor() {
  meteors.push({ x: Math.random() * 580, y: 0 });
}

function drawDodger() {
  dCtx.clearRect(0, 0, dodgerCanvas.width, dodgerCanvas.height);
  dCtx.fillStyle = "cyan";
  dCtx.fillRect(ship.x, ship.y, ship.w, ship.h);
  dCtx.fillStyle = "red";
  meteors.forEach((m) => {
    dCtx.beginPath();
    dCtx.arc(m.x, m.y, 10, 0, Math.PI * 2);
    dCtx.fill();
  });
}

function updateDodger() {
  meteors.forEach((m, index) => {
    m.y += 3;
    if (
      m.x < ship.x + ship.w &&
      m.x + 10 > ship.x &&
      m.y < ship.y + ship.h &&
      m.y + 10 > ship.y
    ) {
      alert("Game Over! Final Score: " + dodgerScore);
      meteors = [];
      dodgerScore = 0;
      clearInterval(dodgerInterval);
    }
    if (m.y > 400) {
      meteors.splice(index, 1);
      dodgerScore++;
      document.getElementById("dodgerScore").innerText = dodgerScore;
    }
  });
  drawDodger();
}

function loopDodger() {
  updateDodger();
  requestAnimationFrame(loopDodger);
}

document.getElementById("startDodger").addEventListener("click", () => {
  ship.x = 290;
  ship.y = 360;
  meteors = [];
  dodgerScore = 0;
  document.getElementById("dodgerScore").innerText = dodgerScore;
  clearInterval(dodgerInterval);
  dodgerInterval = setInterval(spawnMeteor, 1000);
  loopDodger();
});

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && ship.x > 0) ship.x -= 20;
  if (e.key === "ArrowRight" && ship.x + ship.w < dodgerCanvas.width) ship.x += 20;
});
