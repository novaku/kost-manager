<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Payment;
use App\Contracts\TelegramNotifiable;
use Carbon\Carbon;

class PaymentReceivedNotification extends Notification implements ShouldQueue, TelegramNotifiable
{
    use Queueable;

    /**
     * The payment instance
     */
    protected Payment $payment;

    /**
     * Create a new notification instance.
     */
    public function __construct(Payment $payment)
    {
        $this->payment = $payment;
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
        $month = Carbon::parse($this->payment->period_month)->locale('id')->translatedFormat('F Y');
        $amount = $this->payment->amount ? (float) $this->payment->amount : 0;
        $paidAt = $this->payment->paid_at ? 
            Carbon::parse($this->payment->paid_at)->locale('id')->translatedFormat('d F Y H:i') : 
            'Tidak tersedia';
        
        return (new MailMessage)
            ->subject('Pembayaran Diterima - ' . $month)
            ->greeting('Halo ' . $notifiable->name . ',')
            ->line(__('messages.notification.payment_received', ['month' => $month]))
            ->line('Detail pembayaran:')
            ->line('- Periode: ' . $month)
            ->line('- Jumlah: Rp ' . number_format($amount, 0, ',', '.'))
            ->line('- Tanggal bayar: ' . $paidAt)
            ->line('- ID Transaksi: ' . ($this->payment->transaction_id ?? 'Tidak tersedia'))
            ->action('Lihat Kwitansi', url('/payments/' . $this->payment->id))
            ->line('Terima kasih atas pembayaran tepat waktu!');
    }

    /**
     * Get the Telegram representation of the notification.
     */
    public function toTelegram(object $notifiable): string
    {
        $month = Carbon::parse($this->payment->period_month)->locale('id')->translatedFormat('F Y');
        $amount = $this->payment->amount ? (float) $this->payment->amount : 0;
        $paidAt = $this->payment->paid_at ? 
            Carbon::parse($this->payment->paid_at)->locale('id')->translatedFormat('d F Y H:i') : 
            'Tidak tersedia';

        $message = "🎉 <b>Pembayaran Diterima</b>\n\n";
        $message .= "Halo {$notifiable->name},\n\n";
        $message .= "Pembayaran Anda untuk periode <b>{$month}</b> telah diterima!\n\n";
        $message .= "📋 <b>Detail Pembayaran:</b>\n";
        $message .= "• Periode: {$month}\n";
        $message .= "• Jumlah: Rp " . number_format($amount, 0, ',', '.') . "\n";
        $message .= "• Tanggal bayar: {$paidAt}\n";
        $message .= "• ID Transaksi: " . ($this->payment->transaction_id ?? 'Tidak tersedia') . "\n\n";
        $message .= "✅ Terima kasih atas pembayaran tepat waktu!\n\n";
        $message .= "💻 Lihat kwitansi: " . url('/payments/' . $this->payment->id);

        return $message;
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $month = Carbon::parse($this->payment->period_month)->locale('id')->translatedFormat('F Y');
        
        return [
            'type' => 'payment_received',
            'payment_id' => $this->payment->id,
            'amount' => $this->payment->amount ? (float) $this->payment->amount : 0,
            'period_month' => $month,
            'message' => __('messages.notification.payment_received', ['month' => $month]),
        ];
    }
}
