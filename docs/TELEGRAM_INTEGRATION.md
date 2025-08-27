# Telegram Notification Integration

Semua notifikasi sistem sekarang mendukung pengiriman melalui Telegram menggunakan nomor handphone dari tabel user.

## 📋 Dokumentasi Terkait

- **[Panduan Mendapatkan Chat ID](TELEGRAM_CHAT_ID_GUIDE.md)** - Panduan lengkap cara mendapatkan dan mengelola Telegram Chat ID
- **[Panduan Testing Telegram](TELEGRAM_TESTING.md)** - Berbagai metode untuk testing notifikasi Telegram

## Fitur

- **PaymentReceivedNotification**: Notifikasi pembayaran diterima
- **PaymentReminderNotification**: Pengingat pembayaran
- **RentalApprovedNotification**: Persetujuan sewa

## Setup

### 1. Buat Telegram Bot

1. Buka Telegram dan cari @BotFather
2. Kirim `/newbot` command
3. Ikuti instruksi untuk membuat bot Anda
4. Salin token yang diberikan oleh BotFather

### 2. Konfigurasi Environment

Tambahkan ke file `.env`:

```env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
```

### 3. Jalankan Migration

```bash
php artisan migrate
```

### 4. Test Bot Setup

```bash
php artisan telegram:setup
```

### 5. Dapatkan Chat ID

**Cara cepat:**
```bash
# User kirim /start ke @kostmanager_bot, lalu jalankan:
php artisan telegram:get-updates
```

**Cara lengkap:** Lihat [Panduan Chat ID](TELEGRAM_CHAT_ID_GUIDE.md)

### 6. Daftarkan User

```bash
php artisan telegram:manage-chats --register=+6281234567890
```

## Cara Kerja

### 1. Database Structure

Tabel `user_telegrams` menyimpan mapping antara user dan Telegram chat ID:

- `user_id`: Foreign key ke tabel users
- `phone`: Nomor handphone user
- `chat_id`: Telegram chat ID
- `username`: Username Telegram (opsional)
- `first_name`: Nama depan dari Telegram
- `last_name`: Nama belakang dari Telegram
- `is_active`: Status aktif
- `registered_at`: Waktu registrasi

### 2. Custom Telegram Channel

File `app/Channels/TelegramChannel.php` menangani pengiriman notifikasi ke Telegram:

- Mengambil bot token dari konfigurasi
- Mencari chat ID berdasarkan nomor handphone user
- Mengirim pesan dengan format HTML

### 3. Notification Classes

Setiap notification class telah ditambahkan:

- Method `via()` untuk menambahkan TelegramChannel
- Method `toTelegram()` untuk format pesan Telegram

## Registrasi User

### Metode 1: Manual Registration

Gunakan `TelegramService` untuk register user:

```php
use App\Services\TelegramService;

$telegramService = new TelegramService();
$user = User::find(1);
$chatId = '123456789';

$telegramService->registerUser($user, $chatId, [
    'username' => 'username',
    'first_name' => 'First Name',
    'last_name' => 'Last Name'
]);
```

### Metode 2: Webhook Integration

Telegram webhook tersedia di `/api/telegram/webhook` untuk:

- Handle `/start` command
- Auto-register user saat mereka share kontak
- Memberikan instruksi kepada user

## Format Pesan

### Payment Received
```
🎉 Pembayaran Diterima

Halo [Nama User],

Pembayaran Anda untuk periode [Bulan] telah diterima!

📋 Detail Pembayaran:
• Periode: [Bulan]
• Jumlah: Rp [Jumlah]
• Tanggal bayar: [Tanggal]
• ID Transaksi: [ID]

✅ Terima kasih atas pembayaran tepat waktu!

💻 Lihat kwitansi: [URL]
```

### Payment Reminder
```
⏰ Pengingat Pembayaran

Halo [Nama User],

Ini adalah pengingat bahwa pembayaran Anda akan jatuh tempo pada tanggal [Tanggal].

📋 Detail Pembayaran:
• Kostan: [Nama Kostan]
• Kamar: [Nomor Kamar]
• Jumlah: Rp [Jumlah]
• Jatuh tempo: [Tanggal]

💳 Silakan lakukan pembayaran sebelum tanggal jatuh tempo untuk menghindari denda keterlambatan.

💻 Bayar sekarang: [URL]
```

### Rental Approved
```
🎉 Selamat! Pengajuan Sewa Disetujui

Halo [Nama User],

Pengajuan sewa Anda telah disetujui! 🏠

📋 Detail Sewa:
• Kostan: [Nama Kostan]
• Kamar: [Nama Kamar]
• Tanggal mulai: [Tanggal]
• Harga bulanan: Rp [Harga]

🎊 Selamat datang di keluarga besar kami!

💻 Lihat detail: [URL]
```

## Troubleshooting

### Bot Token Error
- Pastikan TELEGRAM_BOT_TOKEN di .env sudah benar
- Test dengan `php artisan telegram:setup`

### User Tidak Menerima Notifikasi
- Pastikan user sudah terdaftar di tabel `user_telegrams`
- Periksa apakah `is_active = true`
- Pastikan chat_id valid

### Log Errors
Periksa log Laravel untuk error detail:
```bash
tail -f storage/logs/laravel.log | grep Telegram
```

## Production Setup

### 1. Set Webhook URL

Untuk production, set webhook URL ke Telegram:

```bash
curl -X POST \
  https://api.telegram.org/bot<BOT_TOKEN>/setWebhook \
  -H 'Content-Type: application/json' \
  -d '{
    "url": "https://yourdomain.com/api/telegram/webhook"
  }'
```

### 2. Security

- Gunakan HTTPS untuk webhook
- Validasi webhook requests dari Telegram
- Rate limiting pada webhook endpoint

### 3. Queue

Untuk performa yang lebih baik, gunakan queue untuk notifications:

```php
// Notifications sudah implement ShouldQueue
// Pastikan queue worker berjalan:
php artisan queue:work
```
