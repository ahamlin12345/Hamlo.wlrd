
const firebaseConfig = {
  apiKey: "AIzaSyBCOIPJlmU77xIUWmsrWnoC6ERicFq5O-0",
  authDomain: "hamlo-wlrd.firebaseapp.com",
  projectId: "hamlo-wlrd",
  storageBucket: "hamlo-wlrd.appspot.com",
  messagingSenderId: "209623934333",
  appId: "1:209623934333:web:0ff5cb131553a904639814"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const file = document.getElementById("audioFile").files[0];
  if (!file) return alert("Select a file.");

  const ref = storage.ref("tracks/" + file.name);
  await ref.put(file);
  const url = await ref.getDownloadURL();
  await db.collection("tracks").add({ title, url, uploaded: new Date() });
  alert("Upload successful!");
});

async function loadTracks() {
  const container = document.getElementById("firebaseTracks");
  const snapshot = await db.collection("tracks").orderBy("uploaded", "desc").get();
  snapshot.forEach(doc => {
    const d = doc.data();
    const el = document.createElement("div");
    el.innerHTML = `<strong>${d.title}</strong><br><audio controls src="${d.url}"></audio><hr>`;
    container.appendChild(el);
  });
}

window.onload = loadTracks;
