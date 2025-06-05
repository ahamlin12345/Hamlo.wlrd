
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

  if (!file) return alert("Please select a file.");

  const status = document.getElementById("uploadStatus");
  status.innerText = "Uploading...";

  const storageRef = storage.ref("tracks/" + file.name);
  await storageRef.put(file);
  const url = await storageRef.getDownloadURL();

  await db.collection("tracks").add({
    title, artist, genre, releaseDate, url, uploaded: new Date()
  });

  status.innerText = "Upload successful!";
  loadTracks();
});

async function loadTracks() {
  const list = document.getElementById("trackList");
  list.innerHTML = "";
  const snapshot = await db.collection("tracks").orderBy("uploaded", "desc").get();
  snapshot.forEach(doc => {
    const data = doc.data();
    const li = document.createElement("li");
    li.innerHTML = `<strong>${data.title}</strong> by ${data.artist}<br>
      <audio controls src="${data.url}"></audio>`;
    list.appendChild(li);
  });
}

window.onload = () => {
  loadTracks();

  // Alien Beat Game
  let alienScore = 0;
  const alienBtn = document.getElementById("alienBtn");
  const scoreDisplay = document.getElementById("score");
  alienBtn.addEventListener("click", () => {
    alienScore++;
    scoreDisplay.innerText = alienScore;
  });
};
