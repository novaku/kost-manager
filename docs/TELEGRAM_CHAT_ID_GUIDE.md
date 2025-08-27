# Panduan Mendapatkan Telegram Chat ID

## Pengantar

Chat ID adalah identifier unik yang digunakan untuk mengirim pesan ke pengguna tertentu melalui Telegram Bot. Dalam aplikasi Kost Manager, Chat ID diperlukan untuk mengirim notifikasi pembayaran, pengingat sewa, dan pemberitahuan lainnya kepada pengguna.

## Metode Mendapatkan Chat ID

### 🥇 Metode 1: Menggunakan Command Artisan (Direkomendasikan)

#### Langkah 1: Kirim Pesan ke Bot
1. Buka aplikasi Telegram
2. Cari bot dengan username: `@kostmanager_bot`
3. Klik "START" atau kirim pesan `/start`

#### Langkah 2: Jalankan Command
```bash
php artisan telegram:get-updates
```

#### Hasil Output:
```
Recent chat interactions:

+------------+---------------------+
| Property   | Value               |
+------------+---------------------+
| Chat ID    | 417041168           |
| Chat Type  | private             |
| First Name | Nova                |
| Last Name  | Kusumah             |
| Username   | @novaherdi          |
| Message    | /start              |
| Date       | 2025-08-26 14:05:52 |
+------------+---------------------+

💡 Use one of the Chat IDs above to test sending messages:
php artisan telegram:setup --test-chat-id=CHAT_ID
```

**Chat ID Anda adalah nilai dalam kolom "Chat ID"** (contoh: `417041168`)

### 🥈 Metode 2: Manajemen Chat ID Komprehensif

#### Command Interaktif
```bash
php artisan telegram:manage-chats
```

Menu yang akan muncul:
```
🤖 Telegram Chat ID Management

What would you like to do?
  [show-updates] Show recent updates and get Chat IDs
  [list-users] List registered users with Chat IDs
  [register-user] Register a Chat ID to a user
  [test-message] Send test message to a Chat ID
```

#### Command Spesifik

**Lihat Update Terbaru dengan Opsi Registrasi:**
```bash
php artisan telegram:manage-chats --updates
```

**Lihat Semua User yang Sudah Terdaftar:**
```bash
php artisan telegram:manage-chats --list
```

**Daftarkan Chat ID ke User Berdasarkan Nomor HP:**
```bash
php artisan telegram:manage-chats --register=+6281234567890
```

### 🥉 Metode 3: Manual API Call

Buka URL berikut di browser:
```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
```

Ganti `<YOUR_BOT_TOKEN>` dengan token bot Anda dari file `.env`.

#### Contoh Response:
```json
{
  "ok": true,
  "result": [
    {
      "update_id": 123456789,
      "message": {
        "message_id": 1,
        "from": {
          "id": 417041168,
          "is_bot": false,
          "first_name": "Nova",
          "last_name": "Kusumah",
          "username": "novaherdi"
        },
        "chat": {
          "id": 417041168,
          "first_name": "Nova",
          "last_name": "Kusumah",
          "username": "novaherdi",
          "type": "private"
        },
        "text": "/start"
      }
    }
  ]
}
```

**Chat ID adalah nilai `chat.id`** (contoh: `417041168`)

### 🔧 Metode 4: Menggunakan @userinfobot

1. Forward pesan dari user ke bot `@userinfobot`
2. Bot akan membalas dengan informasi user termasuk Chat ID

### 🖥️ Metode 5: Menggunakan Web Route (Development)

Tambahkan route berikut ke `routes/web.php`:
```php
Route::get('/telegram/get-chat-id', function () {
    $telegramService = new App\Services\TelegramService();
    $botToken = config('services.telegram.bot_token');
    
    if (!$botToken) {
        return response()->json(['error' => 'Bot token not configured']);
    }

    try {
        $botApi = new TelegramBot\Api\BotApi($botToken);
        $updates = $botApi->getUpdates();
        
        $chatIds = [];
        foreach ($updates as $update) {
            if ($update->getMessage()) {
                $message = $update->getMessage();
                $chat = $message->getChat();
                $from = $message->getFrom();
                
                $chatIds[] = [
                    'chat_id' => $chat->getId(),
                    'name' => $from->getFirstName() . ' ' . $from->getLastName(),
                    'username' => $from->getUsername(),
                    'message' => $message->getText(),
                    'date' => date('Y-m-d H:i:s', $message->getDate())
                ];
            }
        }
        
        return response()->json([
            'success' => true,
            'chat_ids' => $chatIds
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Failed to get updates: ' . $e->getMessage()
        ]);
    }
});
```

Akses: `http://localhost:8000/telegram/get-chat-id`

## Registrasi User dengan Chat ID

### Manual Registration

```bash
# Daftarkan user berdasarkan nomor HP
php artisan telegram:manage-chats --register=+6281234567890

# Sistem akan meminta Chat ID
Enter Chat ID for this user:
> 417041168

✅ Successfully registered Chat ID 417041168 to Nova Kusumah
```

### Programmatik Registration

```php
use App\Services\TelegramService;
use App\Models\User;

$telegramService = new TelegramService();
$user = User::where('phone', '+6281234567890')->first();
$chatId = '417041168';

$result = $telegramService->registerUser($user, $chatId, [
    'username' => 'novaherdi',
    'first_name' => 'Nova',
    'last_name' => 'Kusumah'
]);

if ($result) {
    echo "User berhasil didaftarkan!";
}
```

## Testing Chat ID

### Test Pesan Sederhana
```bash
# Test dengan Chat ID langsung
php artisan telegram:test --chat-id=417041168

# Test dengan User ID (jika sudah terdaftar)
php artisan telegram:test --user-id=1

# Test dengan nomor HP
php artisan telegram:test --phone=+6281234567890

# Test dengan pesan custom
php artisan telegram:test --chat-id=417041168 --message="Halo dari Kost Manager!"
```

### Test Notifikasi
```bash
# Test notifikasi pengingat pembayaran
php artisan telegram:test-notifications --chat-id=417041168 --type=payment-reminder

# Test notifikasi pembayaran diterima
php artisan telegram:test-notifications --chat-id=417041168 --type=payment-received

# Test notifikasi persetujuan sewa
php artisan telegram:test-notifications --chat-id=417041168 --type=rental-approved
```

## Troubleshooting

### Masalah Umum

#### 1. Bot Token Tidak Dikonfigurasi
```bash
# Error: Telegram bot token is not configured!
# Solusi: Tambahkan ke file .env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
```

#### 2. Chat ID Tidak Ditemukan
- Pastikan user sudah mengirim `/start` ke bot
- Jalankan `php artisan telegram:get-updates` untuk mendapatkan Chat ID terbaru
- Periksa apakah user sudah memblokir bot

#### 3. Gagal Mengirim Pesan
- Verifikasi token bot masih valid
- Pastikan Chat ID benar
- Cek apakah user sudah memblokir bot
- Periksa log error di `storage/logs/laravel.log`

#### 4. User Belum Terdaftar
```bash
# Error: User does not have active Telegram registration
# Solusi: Daftarkan user terlebih dahulu
php artisan telegram:manage-chats --register=+6281234567890
```

### Debug Commands

```bash
# Cek info bot
php artisan telegram:setup

# Lihat semua user terdaftar
php artisan telegram:manage-chats --list

# Lihat user di database
php artisan users:list
```

## Keamanan dan Best Practices

### 1. Penyimpanan Chat ID
- Chat ID disimpan dalam tabel `user_telegrams`
- Menggunakan enkripsi untuk data sensitif
- Implementasi soft delete untuk privasi user

### 2. Validasi dan Error Handling
```php
// Contoh implementasi yang aman
try {
    $result = $telegramService->sendTestMessage($chatId, $message);
    if (!$result) {
        Log::warning('Failed to send Telegram message', [
            'chat_id' => $chatId,
            'user_id' => $user->id
        ]);
    }
} catch (\Exception $e) {
    Log::error('Telegram service error', [
        'error' => $e->getMessage(),
        'chat_id' => $chatId
    ]);
}
```

### 3. Rate Limiting
- Implementasi rate limiting untuk mencegah spam
- Batasi jumlah pesan per user per menit
- Monitor penggunaan API Telegram

### 4. Privacy Controls
- User dapat menonaktifkan notifikasi Telegram
- Opsi untuk menghapus Chat ID dari sistem
- Consent management untuk data pribadi

## Referensi API

### TelegramService Methods

```php
// Mendapatkan info bot
$botInfo = $telegramService->getBotInfo();

// Mengirim test message
$result = $telegramService->sendTestMessage($chatId, $message);

// Mendaftarkan user
$userTelegram = $telegramService->registerUser($user, $chatId, $telegramData);

// Mencari user berdasarkan Chat ID
$user = $telegramService->findUserByChatId($chatId);

// Menonaktifkan user
$result = $telegramService->deactivateUser($user);
```

### Database Schema

```sql
-- Tabel user_telegrams
CREATE TABLE user_telegrams (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    phone VARCHAR(20),
    chat_id VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    registered_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Informasi Bot

- **Bot Username**: `@kostmanager_bot`
- **Bot Name**: `kost-manager`
- **Environment Variable**: `TELEGRAM_BOT_TOKEN`
- **Service Class**: `App\Services\TelegramService`
- **Channel Class**: `App\Channels\TelegramChannel`

## Contoh Chat ID

Berdasarkan testing saat ini:
- **Chat ID**: `417041168`
- **User**: Nova Kusumah
- **Phone**: `+62811101024`
- **Email**: `nova@kostmanager.com`
- **Username**: `@novaherdi`

---

**Catatan**: Dokumentasi ini diperbarui pada 27 Agustus 2025. Pastikan untuk selalu menggunakan Chat ID terbaru dan mengikuti best practices keamanan.
