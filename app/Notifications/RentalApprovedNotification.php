<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Rental;
use App\Contracts\TelegramNotifiable;

class RentalApprovedNotification extends Notification implements ShouldQueue, TelegramNotifiable
{
    use Queueable;

    protected $rental;

    /**
     * Create a new notification instance.
     */
    public function __construct(Rental $rental)
    {
        $this->rental = $rental;
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
        return (new MailMessage)
            ->subject('Selamat! Pengajuan Sewa Anda Disetujui')
            ->greeting('Halo ' . $notifiable->name . ',')
            ->line(__('messages.notification.rental_approved'))
            ->line('Detail sewa:')
            ->line('- Kostan: ' . $this->rental->room->kostan->name)
            ->line('- Kamar: ' . $this->rental->room->name)
            ->line('- Tanggal mulai: ' . \Carbon\Carbon::parse($this->rental->start_date)->locale('id')->translatedFormat('d F Y'))
            ->line('- Harga bulanan: Rp ' . number_format($this->rental->monthly_price, 0, ',', '.'))
            ->action('Lihat Detail', url('/my-rentals'))
            ->line('Selamat datang di keluarga besar kami!');
    }

    /**
     * Get the Telegram representation of the notification.
     */
    public function toTelegram(object $notifiable): string
    {
        $startDate = \Carbon\Carbon::parse($this->rental->start_date)->locale('id')->translatedFormat('d F Y');

        $message = "🎉 <b>Selamat! Pengajuan Sewa Disetujui</b>\n\n";
        $message .= "Halo {$notifiable->name},\n\n";
        $message .= "Pengajuan sewa Anda telah <b>disetujui</b>! 🏠\n\n";
        $message .= "📋 <b>Detail Sewa:</b>\n";
        $message .= "• Kostan: {$this->rental->room->kostan->name}\n";
        $message .= "• Kamar: {$this->rental->room->name}\n";
        $message .= "• Tanggal mulai: {$startDate}\n";
        $message .= "• Harga bulanan: Rp " . number_format($this->rental->monthly_price, 0, ',', '.') . "\n\n";
        $message .= "🎊 Selamat datang di keluarga besar kami!\n\n";
        $message .= "💻 Lihat detail: " . url('/my-rentals');

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
            'type' => 'rental_approved',
            'rental_id' => $this->rental->id,
            'kostan_name' => $this->rental->room->kostan->name,
            'room_name' => $this->rental->room->name,
            'message' => __('messages.notification.rental_approved'),
        ];
    }
}
