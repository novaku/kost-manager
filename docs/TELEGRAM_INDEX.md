# Telegram Documentation Index

Dokumentasi lengkap untuk integrasi dan testing Telegram di Kost Manager.

## 📄 Daftar Dokumentasi

### 1. [TELEGRAM_INTEGRATION.md](TELEGRAM_INTEGRATION.md)
**Tujuan**: Panduan lengkap integrasi Telegram  
**Isi**: Setup bot, konfigurasi, implementasi notifikasi  
**Untuk**: Backend developers, system administrators

### 2. [TELEGRAM_CHAT_ID_GUIDE.md](TELEGRAM_CHAT_ID_GUIDE.md) ⭐
**Tujuan**: Cara mendapatkan dan mengelola Chat ID  
**Isi**: 5 metode mendapatkan Chat ID, registrasi user, troubleshooting  
**Untuk**: Developers, support team, system administrators

### 3. [TELEGRAM_TESTING.md](TELEGRAM_TESTING.md)
**Tujuan**: Testing notifikasi Telegram  
**Isi**: Command testing, unit tests, API endpoints  
**Untuk**: QA engineers, developers

## 🚀 Quick Start

### Mendapatkan Chat ID (Paling Sering Dibutuhkan)

1. **Kirim `/start` ke `@kostmanager_bot`**
2. **Jalankan command:**
   ```bash
   php artisan telegram:get-updates
   ```
3. **Chat ID akan ditampilkan**

### Testing Cepat

```bash
# Test pesan sederhana
php artisan telegram:test --chat-id=YOUR_CHAT_ID

# Test notifikasi
php artisan telegram:test-notifications --chat-id=YOUR_CHAT_ID --type=payment-reminder
```

## 🔧 Commands yang Tersedia

| Command | Deskripsi |
|---------|-----------|
| `php artisan telegram:setup` | Setup dan info bot |
| `php artisan telegram:get-updates` | **Mendapatkan Chat ID** |
| `php artisan telegram:manage-chats` | Manajemen Chat ID lengkap |
| `php artisan telegram:test` | Test pesan sederhana |
| `php artisan telegram:test-notifications` | Test notifikasi |

## 📱 Informasi Bot

- **Username**: `@kostmanager_bot`
- **Environment**: `TELEGRAM_BOT_TOKEN`
- **Service**: `App\Services\TelegramService`
- **Channel**: `App\Channels\TelegramChannel`

## ❓ FAQ

**Q: Bagaimana cara mendapatkan Chat ID?**  
A: Lihat [TELEGRAM_CHAT_ID_GUIDE.md](TELEGRAM_CHAT_ID_GUIDE.md) untuk 5 metode berbeda.

**Q: Kenapa pesan tidak terkirim?**  
A: Periksa Chat ID, token bot, dan apakah user sudah memblokir bot.

**Q: Bagaimana cara mendaftar user baru?**  
A: Gunakan `php artisan telegram:manage-chats --register=+6281234567890`

**Q: Bagaimana cara testing notifikasi?**  
A: Lihat [TELEGRAM_TESTING.md](TELEGRAM_TESTING.md) untuk berbagai metode testing.

---

**Terakhir diperbarui**: 27 Agustus 2025  
**Bot Username**: @kostmanager_bot
