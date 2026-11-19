// Mengambil data tersimpan dari localStorage atau mulai dengan array kosong
let daftarItem = JSON.parse(localStorage.getItem("pertemuan5_items")) || [];

// Mengambil elemen utama dari halaman HTML
const formTugas = document.querySelector("#form-tugas");
const inputTugas = document.querySelector("#input-tugas");
const selectKategori = document.querySelector("#select-kategori");
const daftarUl = document.querySelector("#daftar-tugas");
const infoTugas = document.querySelector("#info-tugas");
const btnMuatContoh = document.querySelector("#btn-muat-contoh");

// Menyimpan array tugas ke localStorage browser
function simpanKeStorage() {
    localStorage.setItem("pertemuan5_items", JSON.stringify(daftarItem));
}

// Membersihkan karakter HTML agar aman dirender ke DOM
function bersihkanTeks(teks) {
    const wadah = document.createElement("div");
    wadah.textContent = teks;
    return wadah.innerHTML;
}

// Menampilkan ulang daftar tugas dan jumlah tugas aktif
function tampilkanDaftar() {
    daftarUl.innerHTML = "";

    if (daftarItem.length === 0) {
        daftarUl.innerHTML = "<li><span class='judul'>Belum ada tugas. Tambahkan tugas atau klik Muat Data Contoh.</span></li>";
        infoTugas.textContent = "0 tugas aktif";
        return;
    }

    daftarItem.forEach((item) => {
        const li = document.createElement("li");
        if (item.selesai) {
            li.classList.add("selesai");
        }

        li.innerHTML = `
            <input type="checkbox" ${item.selesai ? "checked" : ""} data-id="${item.id}">
            <span class="judul">${bersihkanTeks(item.judul)}</span>
            <span class="badge">${bersihkanTeks(item.kategori)}</span>
            <button type="button" class="hapus" data-id="${item.id}">Hapus</button>
        `;
        daftarUl.appendChild(li);
    });

    const sisaAktif = daftarItem.filter((item) => !item.selesai).length;
    infoTugas.textContent = `${sisaAktif} tugas aktif`;
}

// Menambah item tugas baru ke daftar
function tambahItem(judul, kategori) {
    daftarItem.push({
        id: Date.now(),
        judul: judul.trim(),
        kategori: kategori,
        selesai: false
    });
    simpanKeStorage();
    tampilkanDaftar();
}

// Mengubah status selesai/belum selesai berdasarkan ID
function ubahStatus(id) {
    const target = daftarItem.find((item) => item.id === id);
    if (target) {
        target.selesai = !target.selesai;
        simpanKeStorage();
        tampilkanDaftar();
    }
}

// Menghapus item berdasarkan ID
function hapusItem(id) {
    daftarItem = daftarItem.filter((item) => item.id !== id);
    simpanKeStorage();
    tampilkanDaftar();
}

// Memuat data contoh awal (bisa juga diganti dengan fetch() ke file JSON/API)
function muatDataContoh() {
    const contoh = [
        { id: 101, judul: "Cek push repository PBP di GitHub", kategori: "Web", selesai: false },
        { id: 102, judul: "Uji tampilan responsif halaman profil", kategori: "Mobile", selesai: false },
        { id: 103, judul: "Dokumentasi hasil praktikum", kategori: "Desktop", selesai: true }
    ];
    daftarItem = contoh;
    simpanKeStorage();
    tampilkanDaftar();
}

// Event submit form untuk menambah tugas
formTugas.addEventListener("submit", (event) => {
    event.preventDefault();
    if (inputTugas.value.trim()) {
        tambahItem(inputTugas.value, selectKategori.value);
        inputTugas.value = "";
        inputTugas.focus();
    }
});

// Event klik tombol Muat Data Contoh
btnMuatContoh.addEventListener("click", muatDataContoh);

// Event perubahan checkbox untuk toggle status selesai
daftarUl.addEventListener("change", (event) => {
    if (event.target.type === "checkbox") {
        ubahStatus(Number(event.target.dataset.id));
    }
});

// Event klik tombol Hapus
daftarUl.addEventListener("click", (event) => {
    if (event.target.classList.contains("hapus")) {
        hapusItem(Number(event.target.dataset.id));
    }
});

// Render awal saat halaman dibuka
tampilkanDaftar();
