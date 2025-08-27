<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Contracts\TelegramNotifiable;
use Carbon\Carbon;

class PaymentReminderNotification extends Notification implements ShouldQueue, TelegramNotifiable
{
    use Queueable;

    protected $dueDate;
    protected $amount;
    protected $kostanName;
    protected $roomNumber;

    /**
     * Create a new notification instance.
     */
    public function __construct($dueDate, $amount, $kostanName, $roomNumber)
    {
        $this->dueDate = $dueDate;
        $this->amount = $amount;
        $this->kostanName = $kostanName;
        $this->roomNumber = $roomNumber;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database', \App\Channels\TelegramChannel::class];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $dueDate = Carbon::parse($this->dueDate)->locale('id')->translatedFormat('d F Y');
        
        return (new MailMessage)
            ->subject(__('messages.notification.payment_reminder', ['date' => $dueDate]))
            ->greeting('Halo ' . $notifiable->name . ',')
            ->line(__('messages.notification.payment_reminder', ['date' => $dueDate]))
            ->line('Detail pembayaran:')
            ->line('- Kostan: ' . $this->kostanName)
            ->line('- Kamar: ' . $this->roomNumber)
            ->line('- Jumlah: Rp ' . number_format($this->amount, 0, ',', '.'))
            ->line('- Jatuh tempo: ' . $dueDate)
            ->action('Bayar Sekarang', url('/payments'))
            ->line('Terima kasih telah menggunakan layanan kami!');
    }

    /**
     * Get the Telegram representation of the notification.
     */
    public function toTelegram(object $notifiable): string
    {
        $dueDate = Carbon::parse($this->dueDate)->locale('id')->translatedFormat('d F Y');

        $message = "⏰ <b>Pengingat Pembayaran</b>\n\n";
        $message .= "Halo {$notifiable->name},\n\n";
        $message .= "Ini adalah pengingat bahwa pembayaran Anda akan jatuh tempo pada tanggal <b>{$dueDate}</b>.\n\n";
        $message .= "📋 <b>Detail Pembayaran:</b>\n";
        $message .= "• Kostan: {$this->kostanName}\n";
        $message .= "• Kamar: {$this->roomNumber}\n";
        $message .= "• Jumlah: Rp " . number_format($this->amount, 0, ',', '.') . "\n";
        $message .= "• Jatuh tempo: {$dueDate}\n\n";
        $message .= "💳 Silakan lakukan pembayaran sebelum tanggal jatuh tempo untuk menghindari denda keterlambatan.\n\n";
        $message .= "💻 Bayar sekarang: " . url('/payments');

        return $message;
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'payment_reminder',
            'due_date' => $this->dueDate,
            'amount' => $this->amount,
            'kostan_name' => $this->kostanName,
            'room_number' => $this->roomNumber,
            'message' => __('messages.notification.payment_reminder', ['date' => Carbon::parse($this->dueDate)->locale('id')->translatedFormat('d F Y')]),
        ];
    }
}
