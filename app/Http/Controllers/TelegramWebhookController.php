<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\TelegramService;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class TelegramWebhookController extends Controller
{
    protected $telegramService;

    public function __construct(TelegramService $telegramService)
    {
        $this->telegramService = $telegramService;
    }

    /**
     * Handle incoming Telegram webhook
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function handle(Request $request)
    {
        try {
            $update = $request->all();
            
            // Log incoming webhook for debugging
            Log::info('Telegram webhook received', $update);

            // Check if it's a message
            if (isset($update['message'])) {
                $message = $update['message'];
                $chatId = $message['chat']['id'];
                $text = $message['text'] ?? '';
                $from = $message['from'];

                // Handle /start command for user registration
                if (str_starts_with($text, '/start')) {
                    $this->handleStartCommand($chatId, $from);
                }
                
                // Handle phone number sharing
                if (isset($message['contact'])) {
                    $this->handleContactShare($chatId, $message['contact'], $from);
                }
            }

            return response()->json(['status' => 'ok']);

        } catch (\Exception $e) {
            Log::error('Telegram webhook error', [
                'error' => $e->getMessage(),
                'request' => $request->all()
            ]);
            
            return response()->json(['status' => 'error'], 500);
        }
    }

    /**
     * Handle /start command
     *
     * @param string $chatId
     * @param array $from
     */
    private function handleStartCommand(string $chatId, array $from)
    {
        $telegramService = new TelegramService();
        
        $welcomeMessage = "🏠 <b>Selamat datang di Kost Manager!</b>\n\n";
        $welcomeMessage .= "Untuk menerima notifikasi melalui Telegram, silakan:\n\n";
        $welcomeMessage .= "1️⃣ Pastikan nomor HP Anda terdaftar di akun Kost Manager\n";
        $welcomeMessage .= "2️⃣ Hubungi admin untuk menghubungkan akun Telegram Anda\n\n";
        $welcomeMessage .= "📱 Chat ID Anda: <code>{$chatId}</code>\n";
        $welcomeMessage .= "👤 Username: @" . ($from['username'] ?? 'Tidak ada') . "\n\n";
        $welcomeMessage .= "Berikan informasi ini kepada admin untuk aktivasi notifikasi.";

        $telegramService->sendTestMessage($chatId, $welcomeMessage);
    }

    /**
     * Handle contact sharing
     *
     * @param string $chatId
     * @param array $contact
     * @param array $from
     */
    private function handleContactShare(string $chatId, array $contact, array $from)
    {
        $phoneNumber = $contact['phone_number'];
        
        // Try to find user by phone number
        $user = User::where('phone', $phoneNumber)->first();
        
        if ($user) {
            // Register user with Telegram
            $userTelegram = $this->telegramService->registerUser($user, $chatId, $from);
            
            if ($userTelegram) {
                $successMessage = "✅ <b>Registrasi Berhasil!</b>\n\n";
                $successMessage .= "Akun Telegram Anda telah terhubung dengan akun Kost Manager.\n\n";
                $successMessage .= "🔔 Anda akan menerima notifikasi untuk:\n";
                $successMessage .= "• Pembayaran diterima\n";
                $successMessage .= "• Pengingat pembayaran\n";
                $successMessage .= "• Persetujuan sewa\n\n";
                $successMessage .= "Terima kasih telah menggunakan layanan kami! 😊";
                
                $this->telegramService->sendTestMessage($chatId, $successMessage);
            } else {
                $errorMessage = "❌ <b>Registrasi Gagal</b>\n\n";
                $errorMessage .= "Terjadi kesalahan saat menghubungkan akun Anda.\n";
                $errorMessage .= "Silakan hubungi admin untuk bantuan.";
                
                $this->telegramService->sendTestMessage($chatId, $errorMessage);
            }
        } else {
            $notFoundMessage = "⚠️ <b>Nomor Tidak Ditemukan</b>\n\n";
            $notFoundMessage .= "Nomor HP {$phoneNumber} tidak terdaftar di sistem Kost Manager.\n\n";
            $notFoundMessage .= "Pastikan Anda sudah mendaftar di aplikasi dengan nomor HP yang sama.";
            
            $this->telegramService->sendTestMessage($chatId, $notFoundMessage);
        }
    }
}
