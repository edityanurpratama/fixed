# Nuraga: Integrated Safety Intelligence System

[![Version](https://img.shields.io/badge/version-1.0.0-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()
[![Status](https://img.shields.io/badge/status-Production-success)]()

> **Sistem kecerdasan keselamatan terintegrasi untuk memprediksi, mencegah, dan mengelola risiko kecelakaan kerja.**

---

## Tentang Nuraga

**Nuraga** adalah platform berbasis kecerdasan buatan yang membantu perusahaan dalam menciptakan lingkungan kerja yang lebih aman dan sehat. Nama "Nuraga" mencerminkan filosofi bahwa setiap pekerja adalah manusia berharga, bukan sekadar angka dalam statistik kecelakaan.

Dengan menggabungkan prediksi kelelahan, klasifikasi bahaya otomatis, dan manajemen sertifikasi K3, Nuraga memungkinkan perusahaan beralih dari pendekatan **reaktif** menjadi **prediktif** dalam menjaga keselamatan pekerja.

---

## Fitur Utama

### 🔮 WellGuard - Prediksi Kelelahan
Memprediksi tingkat kelelahan pekerja berdasarkan jam kerja, shift, dan jenis pekerjaan. Hasil prediksi dapat digunakan untuk mengoptimalkan jadwal kerja dan mencegah kecelakaan akibat kelelahan.

### ⚠️ Hazard-NLP - Klasifikasi Laporan Bahaya
Pekerja dapat melaporkan potensi bahaya melalui teks alami. Sistem secara otomatis mengklasifikasikan laporan ke dalam kategori risiko (listrik, mekanik, kimia, ergonomi, dll.) dan menentukan tingkat prioritas penanganan.

### 📋 Safety Certification Management
Manajemen sertifikasi pekerja (P3K, penanggulangan kebakaran, dll.) dengan fitur:
- Pencatatan dan pelacakan masa berlaku sertifikat
- Notifikasi otomatis menjelang kadaluarsa
- Laporan kompetensi tim per departemen

### 📊 K3 Metrics Dashboard
Dashboard interaktif yang menampilkan metrik keselamatan kerja secara real-time:
- *Accident Frequency Rate* (AFR)
- *Severity Rate* (SR)
- Tren kecelakaan per periode
- Heatmap lokasi rawan kecelakaan

---

## Cara Kerja Nuraga

| Langkah | Proses | Keterangan |
|:---:|:---|:---|
| **1** | 👷 **Input dari Pekerja** | Laporan bahaya, data jam kerja/shift, data sertifikasi |
| **2** | ⚠️ **Hazard NLP** | Mengklasifikasikan laporan bahaya ke dalam kategori risiko |
| **3** | 😴 **WellGuard** | Memprediksi tingkat kelelahan pekerja |
| **4** | 📜 **Manajemen Sertifikasi** | Mengelola data kompetensi & masa berlaku sertifikat |
| **5** | 🧠 **AI Engine (TensorFlow)** | Memproses seluruh data dengan model custom |
| **6** | 📊 **Dashboard & Notifikasi** | Menampilkan metrik K3 dan mengirim notifikasi |
| **7** | 👔 **Manajer K3** | Melihat data, menganalisis, dan mengambil tindakan |

## Manfaat untuk Perusahaan

| Manfaat | Deskripsi |
|:---|:---|
| **Penurunan kecelakaan kerja** | Prediksi dini mencegah insiden sebelum terjadi |
| **Efisiensi pelaporan** | Klasifikasi otomatis mempercepat tindak lanjut laporan bahaya |
| **Kepatuhan regulasi** | Manajemen sertifikasi terpusat memudahkan audit K3 |
| **Pengambilan keputusan berbasis data** | Dashboard metrik membantu evaluasi kebijakan keselamatan |

---

## Teknologi yang Digunakan

| Komponen | Teknologi |
|:---|:---|
| **Model AI** | TensorFlow (Custom Architecture) |
| **AI Service** | FastAPI (Python) |
| **Backend API** | Node.js, Express.js |
| **Dashboard** | Streamlit |
| **Database** | PostgreSQL |
| **Deployment** | Docker, Hercules |

---

## Mulai Menggunakan

### Untuk Pengguna (Pekerja & Manajer K3)

1. **Akses Dashboard Nuraga** melalui browser di `https://nuraga.yourcompany.com`
2. **Login** menggunakan kredensial yang diberikan oleh tim K3
3. **Laporkan bahaya** melalui form laporan teks biasa
4. **Pantau metrik keselamatan** tim Anda secara real-time

### Untuk Admin Teknis

```bash
# Pull docker image
docker pull nuraga/platform:latest

# Run with docker-compose
docker-compose up -d
```

---

## Studi Kasus

> *Setelah mengimplementasikan Nuraga selama 6 bulan, PT. Industri Maju mencatat penurunan 42% insiden kecelakaan kerja dan peningkatan 35% kecepatan respons terhadap laporan bahaya.*

---

## Roadmap Pengembangan

| Fitur | Status |
|:---|:---|
| WellGuard (Prediksi Kelelahan) | ✅ Rilis v1.0 |
| Hazard-NLP (Klasifikasi Bahaya) | ✅ Rilis v1.0 |
| Manajemen Sertifikasi | ✅ Rilis v1.0 |
| Dashboard Metrik K3 | ✅ Rilis v1.0 |
| Mobile App (Android/iOS) | 🚧 Dalam Pengembangan |
| Real-time Alert System | 🚧 Dalam Pengembangan |
| Integrasi IoT (Wearables) | 📋 Terencana |

---

## Kontak & Dukungan

- **Email**: support@nuraga.com
- **Dokumentasi Lengkap**: [docs.nuraga.com](https://docs.nuraga.com)
- **API Reference**: [api.nuraga.com/docs](https://api.nuraga.com/docs)

---

## Lisensi

Hak Cipta © 2026 Tim Capstone CC26-PRU428

Dilisensikan di bawah [MIT License](LICENSE).

---

<div align="center">
  <b>Nuraga</b><br>
  <i>"Manusia yang dilindungi, bukan sekadar angka yang tercatat."</i>
</div>
