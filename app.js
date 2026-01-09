import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getFirestore, collection, addDoc, onSnapshot,
  query, orderBy, serverTimestamp, deleteDoc, doc
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBd3lgdCs8-1s5THahq7VacpiM6B4jaFYc",
  authDomain: "cloud-guestbook-2eb7f.firebaseapp.com",
  projectId: "cloud-guestbook-2eb7f",
  storageBucket: "cloud-guestbook-2eb7f.firebasestorage.app",
  messagingSenderId: "849782713594",
  appId: "1:849782713594:web:9129147fb1e171233c2d43"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const messagesEl = document.getElementById("messages");
const nameInput = document.getElementById("nameInput");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");

// collection اسمها guestbook
const col = collection(db, "guestbook");
const q = query(col, orderBy("createdAt", "desc"));

sendBtn.addEventListener("click", async () => {
  const name = nameInput.value.trim() || "زائر";
  const message = msgInput.value.trim();
  if (!message) return;

  await addDoc(col, { name, message, createdAt: serverTimestamp() });
  msgInput.value = "";
});

onSnapshot(q, (snapshot) => {
  messagesEl.innerHTML = "";
  snapshot.forEach((d) => {
    const data = d.data();
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="meta">
        <strong>${escapeHtml(data.name || "زائر")}</strong>
        <span>${escapeHtml(data.message || "")}</span>
      </div>
      <button data-id="${d.id}">حذف</button>
    `;
    li.querySelector("button").onclick = async (e) => {
      const id = e.target.getAttribute("data-id");
      await deleteDoc(doc(db, "guestbook", id));
    };
    messagesEl.appendChild(li);
  });
});

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}
