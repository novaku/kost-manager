<?php

return [
    // Application-specific messages
    'kostan' => [
        'created' => 'Kostan berhasil dibuat!',
        'updated' => 'Kostan berhasil diperbarui!',
        'deleted' => 'Kostan berhasil dihapus!',
        'not_found' => 'Kostan tidak ditemukan.',
        'unauthorized' => 'Anda tidak memiliki akses ke kostan ini.',
    ],

    'room' => [
        'created' => 'Kamar berhasil dibuat!',
        'updated' => 'Kamar berhasil diperbarui!',
        'deleted' => 'Kamar berhasil dihapus!',
        'not_found' => 'Kamar tidak ditemukan.',
        'not_available' => 'Kamar tidak tersedia.',
        'already_rented' => 'Kamar sudah disewa.',
    ],

    'rental' => [
        'created' => 'Penyewaan berhasil dibuat!',
        'updated' => 'Penyewaan berhasil diperbarui!',
        'cancelled' => 'Penyewaan berhasil dibatalkan!',
        'not_found' => 'Penyewaan tidak ditemukan.',
        'already_active' => 'Anda sudah memiliki penyewaan aktif untuk kamar ini.',
        'expired' => 'Penyewaan telah berakhir.',
        'payment_due' => 'Pembayaran Anda sudah jatuh tempo.',
    ],

    'payment' => [
        'success' => 'Pembayaran berhasil!',
        'failed' => 'Pembayaran gagal. Silakan coba lagi.',
        'pending' => 'Pembayaran sedang diproses.',
        'cancelled' => 'Pembayaran dibatalkan.',
        'not_found' => 'Pembayaran tidak ditemukan.',
        'already_paid' => 'Pembayaran sudah dilakukan.',
        'insufficient_funds' => 'Saldo tidak mencukupi.',
    ],

    'notification' => [
        'payment_reminder' => 'Pengingat: Pembayaran sewa bulan ini akan jatuh tempo pada :date.',
        'payment_overdue' => 'Peringatan: Pembayaran sewa Anda sudah terlambat. Silakan segera lakukan pembayaran.',
        'payment_received' => 'Pembayaran sewa bulan :month telah diterima. Terima kasih!',
        'rental_approved' => 'Selamat! Pengajuan sewa Anda telah disetujui.',
        'rental_rejected' => 'Maaf, pengajuan sewa Anda ditolak. Silakan coba kamar lain.',
        'rental_expired' => 'Penyewaan Anda berakhir pada :date. Silakan perpanjang jika ingin melanjutkan.',
        'new_rental_request' => 'Ada pengajuan sewa baru untuk kamar :room di kostan :kostan.',
        'room_available' => 'Kamar favorit Anda sekarang tersedia! Segera ajukan sewa sebelum diambil orang lain.',
    ],

    'errors' => [
        'server_error' => 'Terjadi kesalahan server. Silakan coba lagi nanti.',
        'not_found' => 'Halaman yang Anda cari tidak ditemukan.',
        'unauthorized' => 'Anda tidak memiliki akses untuk melakukan tindakan ini.',
        'forbidden' => 'Akses ditolak.',
        'validation_failed' => 'Data yang Anda masukkan tidak valid.',
        'file_too_large' => 'Ukuran file terlalu besar.',
        'invalid_file_type' => 'Tipe file tidak didukung.',
    ],

    'success' => [
        'data_saved' => 'Data berhasil disimpan!',
        'data_updated' => 'Data berhasil diperbarui!',
        'data_deleted' => 'Data berhasil dihapus!',
        'email_sent' => 'Email berhasil dikirim!',
        'profile_updated' => 'Profil berhasil diperbarui!',
        'password_changed' => 'Kata sandi berhasil diubah!',
    ],

    'general' => [
        'loading' => 'Memuat...',
        'saving' => 'Menyimpan...',
        'please_wait' => 'Mohon tunggu...',
        'try_again' => 'Coba lagi',
        'contact_support' => 'Hubungi dukungan',
        'no_data' => 'Tidak ada data',
        'coming_soon' => 'Segera hadir',
        'maintenance' => 'Sedang dalam pemeliharaan',
    ],
];
