# Dokumentasi Terjemahan KostManager

## Ringkasan Implementasi

Sistem terjemahan lengkap telah diimplementasikan untuk aplikasi KostManager dengan dukungan Bahasa Indonesia sebagai bahasa utama dan English sebagai fallback.

## Struktur Terjemahan

### Backend (Laravel)

#### File Bahasa Indonesia (`resources/lang/id/`)
- `auth.php` - Pesan autentikasi (login, register, reset password)
- `validation.php` - Pesan validasi form dengan atribut dalam bahasa Indonesia
- `messages.php` - Pesan aplikasi spesifik (kostan, kamar, sewa, pembayaran, notifikasi)
- `passwords.php` - Pesan reset kata sandi
- `pagination.php` - Navigasi halaman

#### Konfigurasi Laravel
- Default locale diubah ke `'id'` (Indonesia)
- Fallback locale tetap `'en'` (English)
- Faker locale diset ke `'id_ID'`

#### Notifikasi Laravel
Dibuat notifikasi dalam bahasa Indonesia:
- `PaymentReminderNotification` - Pengingat pembayaran
- `RentalApprovedNotification` - Persetujuan sewa
- `PaymentReceivedNotification` - Konfirmasi pembayaran diterima

### Frontend (React)

#### Struktur Terjemahan React
- `resources/js/locales/id.ts` - Terjemahan Bahasa Indonesia lengkap
- `resources/js/locales/en.ts` - Terjemahan English sebagai fallback
- `resources/js/contexts/TranslationContext.tsx` - Context untuk manajemen bahasa
- `resources/js/contexts/NotificationContext.tsx` - Context untuk notifikasi dengan terjemahan

#### Komponen UI
- `LanguageSwitcher.tsx` - Tombol ganti bahasa
- `Toast.tsx` - Notifikasi popup dengan dukungan terjemahan
- `ToastContainer.tsx` - Container untuk menampilkan toast

## Kategori Terjemahan

### 1. Navigasi (`nav`)
- Menu utama (Beranda, Kostan, Dashboard, dll.)
- Menu pengguna (Profil, Keluar, dll.)

### 2. Autentikasi (`auth`)
- Form login dan register
- Pesan konfirmasi dan error
- Label field (email, password, nama, dll.)

### 3. Tombol (`button`)
- Aksi umum (Simpan, Batal, Hapus, dll.)
- Navigasi (Mulai, Jelajahi, Dashboard)
- Status (Memuat, Menyimpan)

### 4. Halaman Utama (`home`)
- Hero section
- Fitur unggulan
- Statistik
- Testimonial
- Call-to-action

### 5. Dashboard (`dashboard`)
- Widget untuk pemilik kostan
- Widget untuk penyewa
- Aktivitas terkini
- Statistik

### 6. Kostan & Kamar (`kostan`)
- Tipe kamar
- Fasilitas umum
- Detail properti
- Status ketersediaan

### 7. Sewa (`rental`)
- Status sewa
- Proses aplikasi
- Durasi dan biaya

### 8. Pembayaran (`payment`)
- Metode pembayaran
- Status transaksi
- Riwayat pembayaran

### 9. Notifikasi (`notification`)
- Tipe notifikasi
- Pesan umum
- Aksi notifikasi

### 10. Form (`form`)
- Validasi
- Placeholder
- Upload file

### 11. UI Umum (`ui`)
- Loading states
- Data kosong
- Navigasi
- Aksi umum

### 12. Pesan Error (`error`)
- Error jaringan
- Error server
- Error validasi
- Error spesifik aplikasi

### 13. Pesan Sukses (`success`)
- Konfirmasi umum
- Aksi berhasil
- Update data

### 14. Tanggal & Waktu (`date`)
- Nama bulan dalam bahasa Indonesia
- Nama hari
- Periode waktu

### 15. Unit & Satuan (`units`)
- Mata uang (Rupiah)
- Ukuran (m², km)
- Waktu (hari, bulan, tahun)

## Fitur Sistem Terjemahan

### React Translation System
- **Auto-detection**: Bahasa tersimpan di localStorage
- **Fallback**: Jika terjemahan tidak ditemukan, gunakan English
- **Parameter replacement**: Dukungan variabel dalam teks (`:date`, `:amount`, dll.)
- **Type safety**: TypeScript definitions untuk kunci terjemahan

### Notifikasi Terintegrasi
- **Context-aware**: Notifikasi menggunakan bahasa yang dipilih pengguna
- **Toast system**: Popup notifikasi dengan animasi
- **Multiple types**: Success, error, warning, info
- **Auto-dismiss**: Notifikasi hilang otomatis

### Language Switcher
- **Responsive**: Tampilan berbeda untuk desktop dan mobile
- **Visual indicators**: Bendera dan nama bahasa
- **Persistent**: Pilihan bahasa tersimpan
- **Smooth transition**: Perpindahan bahasa instant

## Cara Penggunaan

### Untuk Developer

#### Menggunakan terjemahan di React:
```tsx
import { useTranslation } from '@/contexts/TranslationContext';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('home.title')}</h1>
      <p>{t('notification.messages.paymentReminder', { date: '30 Desember 2025' })}</p>
    </div>
  );
};
```

#### Menggunakan terjemahan di Laravel:
```php
// Dalam controller atau service
$message = __('messages.kostan.created');

// Dengan parameter
$message = __('messages.notification.payment_reminder', ['date' => $dueDate]);

// Dalam notifikasi
->line(__('messages.notification.rental_approved'))
```

#### Mengirim notifikasi dengan terjemahan:
```tsx
import { useNotification } from '@/contexts/NotificationContext';

const MyComponent = () => {
  const { showToast } = useNotification();
  
  const handleSuccess = () => {
    showToast('success', t('success.loginSuccess'));
  };
};
```

### Untuk Pengguna
1. Klik tombol bahasa di pojok kanan atas
2. Pilih bahasa yang diinginkan
3. Aplikasi akan otomatis beralih ke bahasa yang dipilih
4. Pilihan bahasa tersimpan untuk kunjungan berikutnya

## Ekspansi Bahasa

Untuk menambah bahasa baru:

1. **Laravel**: Buat folder baru di `resources/lang/[kode_bahasa]/`
2. **React**: Buat file baru di `resources/js/locales/[kode_bahasa].ts`
3. **Update** array `availableLocales` di TranslationContext
4. **Tambah** flag dan nama bahasa di LanguageSwitcher

## Maintenance

### Menambah Terjemahan Baru
1. Tambahkan key di file `id.ts` dan `en.ts`
2. Gunakan struktur nested yang konsisten
3. Test fallback ke English jika terjemahan Indonesia belum ada

### Best Practices
- Gunakan key yang deskriptif (`button.save` bukan `btn1`)
- Kelompokkan terjemahan berdasarkan konten (`nav`, `auth`, `error`)
- Sediakan fallback untuk semua terjemahan
- Test dengan kedua bahasa
- Gunakan parameter untuk konten dinamis

## Status Implementasi

✅ **Selesai:**
- Konfigurasi Laravel locale
- File bahasa Indonesia lengkap
- Sistem terjemahan React
- Context dan provider
- Language switcher
- Toast notifications
- Notifikasi Laravel
- Integrasi AuthContext
- Update komponen utama

📋 **Untuk Pengembangan Selanjutnya:**
- Terjemahan halaman lainnya (Dashboard, Profile, dll.)
- Notifikasi real-time
- Email templates dalam bahasa Indonesia
- Validasi form dengan pesan Indonesia
- Error pages dengan terjemahan
- Admin panel untuk manajemen terjemahan

Dengan implementasi ini, aplikasi KostManager sekarang sepenuhnya mendukung Bahasa Indonesia sebagai bahasa utama dengan sistem terjemahan yang komprehensif dan mudah dipelihara.
