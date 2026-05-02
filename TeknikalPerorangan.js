import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getDatabase, ref, push, onValue, remove, update } 
from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";

const app = initializeApp({
  apiKey: "AIzaSyBH9fdaDioSIBohv04Nwn5UsB-Wh8Q8AaU",
  authDomain: "latihan2-ba4c5.firebaseapp.com",
  projectId: "latihan2-ba4c5",
  storageBucket: "latihan2-ba4c5.firebasestorage.app",
  messagingSenderId: "515994512533",
  appId: "1:515994512533:web:7bdd166157ac92f398ff9c"
});

const db = getDatabase(app);

// ambil elemen
const inputTanggal = document.getElementById("Tanggal");
const inputNama = document.getElementById("nama");
const inputFrame = document.getElementById("NoFrame");
const simpan = document.getElementById("simpan");
const daftar = document.getElementById("daftar");
const modeText = document.getElementById("mode");

const dataref = ref(db, "TeknikalPerorangan");

// mode edit
let editKey = null;

// tombol simpan
simpan.onclick = () => {

  if (!inputTanggal.value || !inputNama.value || !inputFrame.value) {
    alert("Semua harus diisi!");
    return;
  }

  if (editKey === null) {
    // TAMBAH
    push(dataref, {
      Tanggal: inputTanggal.value,
      Nama: inputNama.value,
      NoFrame: inputFrame.value,
    });
  } else {
    // UPDATE
    update(ref(db, "TeknikalPerorangan/" + editKey), {
      Tanggal: inputTanggal.value,
      Nama: inputNama.value,
      NoFrame: inputFrame.value,
    });

    editKey = null;
    if (modeText) modeText.innerText = "";
    simpan.innerText = "Simpan";
  }

  inputTanggal.value = "";
  inputNama.value = "";
  inputFrame.value = "";
};

// tampil data
onValue(dataref, snap => {
  daftar.innerHTML = "";

  snap.forEach(h => {
    const data = h.val();
    const key = h.key;

    daftar.innerHTML += `
      <li style="margin-bottom:10px;">
        ${data.Tanggal || "-"} | ${data.Nama || "-"} | ${data.NoFrame || "-"}
        <br>
        <button onclick="hapusData('${key}')">Hapus</button>
        <button onclick="editData('${key}',
          '${encodeURIComponent(data.Tanggal || "")}',
          '${encodeURIComponent(data.Nama || "")}',
          '${encodeURIComponent(data.NoFrame || "")}'
        )">Edit</button>
      </li>
    `;
  });
});

// hapus
window.hapusData = function(key) {
  if (confirm("Yakin mau hapus data ini?")) {
    remove(ref(db, "TeknikalPerorangan/" + key));
  }
}

// edit
window.editData = function(key, tanggal, nama, frame) {
  inputTanggal.value = decodeURIComponent(tanggal);
  inputNama.value = decodeURIComponent(nama);
  inputFrame.value = decodeURIComponent(frame);

  editKey = key;

  if (modeText) modeText.innerText = "Mode: Edit";
  simpan.innerText = "Update";
}

// batal edit
window.batalEdit = function() {
  editKey = null;
  inputTanggal.value = "";
  inputNama.value = "";
  inputFrame.value = "";

  if (modeText) modeText.innerText = "";
  simpan.innerText = "Simpan";
}