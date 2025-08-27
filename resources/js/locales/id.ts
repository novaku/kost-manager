export default {
  // Navigation
  nav: {
    home: 'Beranda',
    kostans: 'Kostan',
    dashboard: 'Dashboard',
    profile: 'Profil',
    myKostans: 'Kostan Saya',
    myRentals: 'Sewa Saya',
    payments: 'Pembayaran',
    login: 'Masuk',
    register: 'Daftar',
    logout: 'Keluar',
  },

  // Authentication
  auth: {
    signIn: 'Masuk ke akun Anda',
    signUp: 'Buat akun Anda',
    createAccount: 'Buat Akun',
    alreadyHaveAccount: 'Sudah punya akun?',
    signInHere: 'masuk ke akun yang sudah ada',
    emailAddress: 'Alamat email',
    password: 'Kata sandi',
    confirmPassword: 'Konfirmasi Kata Sandi',
    name: 'Nama Lengkap',
    phone: 'Nomor Telepon',
    phoneOptional: 'Nomor Telepon (Opsional)',
    role: 'Jenis Akun',
    owner: 'Pemilik (Mengelola kostan)',
    tenant: 'Penyewa (Mencari kamar)',
    enterEmail: 'Masukkan email Anda',
    enterPassword: 'Masukkan kata sandi Anda',
    enterName: 'Masukkan nama lengkap Anda',
    enterPhone: 'Masukkan nomor telepon Anda',
    confirmPasswordPlaceholder: 'Konfirmasi kata sandi Anda',
    selectRole: 'Pilih peran Anda',
  selectKostanLabel: 'Pilih Kostan',
  selectKostanPlaceholder: '-- Pilih Kostan --',
  noKostans: 'Tidak ada kostan yang tersedia saat ini',
    forgotPassword: 'Lupa kata sandi?',
    rememberMe: 'Ingat saya',
    or: 'Atau',
  unauthorized: 'Anda tidak memiliki akses.',
  },

  // Buttons
  button: {
    save: 'Simpan',
    cancel: 'Batal',
    delete: 'Hapus',
    edit: 'Edit',
    view: 'Lihat',
    submit: 'Kirim',
    back: 'Kembali',
    next: 'Selanjutnya',
    previous: 'Sebelumnya',
    search: 'Cari',
    filter: 'Filter',
    reset: 'Reset',
    close: 'Tutup',
    confirm: 'Konfirmasi',
    loading: 'Memuat...',
    getStarted: 'Mulai',
    browseKostans: 'Jelajahi Kostan',
    goToDashboard: 'Ke Dashboard',
    signIn: 'Masuk',
    register: 'Daftar',
    viewDetails: 'Lihat Detail',
    bookNow: 'Pesan Sekarang',
    applyNow: 'Ajukan Sekarang',
    pay: 'Bayar',
    download: 'Unduh',
    upload: 'Unggah',
  },

  // Home Page
  home: {
    title: 'Manajemen Kostan Menjadi Mudah',
    subtitle: 'Solusi lengkap untuk mengelola kostan dengan sistem pembayaran terintegrasi, manajemen penyewa, dan desain mobile-first.',
    whyChoose: 'Mengapa Memilih KostManager?',
    whyChooseSubtitle: 'Dirancang khusus untuk manajemen kostan Indonesia dengan fitur modern dan pendekatan mobile-first.',
    features: {
      easyManagement: {
        title: 'Manajemen Mudah',
        description: 'Kelola berbagai kostan, kamar, dan penyewa dari satu dashboard.',
      },
      securePayments: {
        title: 'Pembayaran Aman',
        description: 'Sistem pembayaran terintegrasi dengan berbagai metode pembayaran.',
      },
      tenantPortal: {
        title: 'Portal Penyewa',
        description: 'Penyewa dapat dengan mudah menjelajah, mengajukan, dan melakukan pembayaran online.',
      },
      reliableSecure: {
        title: 'Terpercaya & Aman',
        description: 'Dibangun dengan keamanan dan keandalan sebagai prioritas utama.',
      },
    },
    statistics: {
      title: 'Dipercaya oleh Ribuan Pengguna',
      kostans: 'Kostan Terdaftar',
      owners: 'Pemilik Kostan',
      tenants: 'Penyewa Aktif',
      transactions: 'Transaksi Berhasil',
    },
    testimonials: {
      title: 'Apa Kata Mereka',
      subtitle: 'Dengar langsung dari para pengguna yang sudah merasakan manfaat KostManager.',
    },
    cta: {
      title: 'Siap Memulai?',
      subtitle: 'Bergabunglah dengan ribuan pemilik kostan dan penyewa yang menggunakan KostManager.',
      ownerCta: 'Daftar sebagai Pemilik',
      tenantCta: 'Daftar sebagai Penyewa',
    },
  },

  // Dashboard
  dashboard: {
    welcome: 'Selamat datang',
    welcomeBack: 'Selamat datang kembali',
    overview: 'Ringkasan',
    recentActivity: 'Aktivitas Terkini',
    quickActions: 'Aksi Cepat',
    statistics: 'Statistik',
    notifications: 'Notifikasi',
    noNotifications: 'Tidak ada notifikasi',
    viewAll: 'Lihat Semua',
    comingSoon: 'Implementasi akan segera hadir...',
    quickOverview: 'Ringkasan Cepat',
    
    // Owner dashboard
    owner: {
      welcomeText: 'Kelola kostan dan penyewa Anda dari dashboard ini.',
      totalKostans: 'Total Kostan',
      totalRooms: 'Total Kamar',
      occupiedRooms: 'Kamar Terisi',
      monthlyRevenue: 'Pendapatan Bulan Ini',
      pendingPayments: 'Pembayaran Tertunda',
      newApplications: 'Aplikasi Baru',
      addNewKostan: 'Tambah Kostan Baru',
      manageRooms: 'Kelola Kamar',
      viewReports: 'Lihat Laporan',
      myKostans: 'Kostan Saya',
      myKostansDesc: 'Kelola kostan Anda',
      rentalApplications: 'Aplikasi Sewa',
      rentalApplicationsDesc: 'Tinjau aplikasi penyewa',
    },
    
    // Tenant dashboard
    tenant: {
      welcomeText: 'Cari dan kelola sewa Anda dari dashboard ini.',
      currentRental: 'Sewa Saat Ini',
      nextPayment: 'Pembayaran Berikutnya',
      paymentHistory: 'Riwayat Pembayaran',
      findRoom: 'Cari Kamar',
      payRent: 'Bayar Sewa',
      contactOwner: 'Hubungi Pemilik',
      browseKostans: 'Jelajahi Kostan',
      browseKostansDesc: 'Temukan kamar impian Anda',
      myRentals: 'Sewa Saya',
      myRentalsDesc: 'Lihat sewa Anda saat ini',
      payments: 'Pembayaran',
    },
  },

  // Kostan/Room related
  kostan: {
    kostan: 'Kostan',
    kostans: 'Kostan',
    room: 'Kamar',
    rooms: 'Kamar',
    available: 'Tersedia',
    occupied: 'Terisi',
    maintenance: 'Maintenance',
    price: 'Harga',
    priceFrom: 'Mulai dari',
    perMonth: '/bulan',
    facilities: 'Fasilitas',
    description: 'Deskripsi',
    location: 'Lokasi',
    address: 'Alamat',
    contact: 'Kontak',
    owner: 'Pemilik',
    type: 'Tipe',
    size: 'Ukuran',
    floor: 'Lantai',
    availability: 'Ketersediaan',
    images: 'Gambar',
    details: 'Detail',
    specifications: 'Spesifikasi',
    nearbyPlaces: 'Tempat Terdekat',
    reviews: 'Ulasan',
    rules: 'Peraturan',
    
    // Room types
    roomTypes: {
      single: 'Kamar Tidur Tunggal',
      shared: 'Kamar Bersama',
      private: 'Kamar Pribadi',
      suite: 'Suite',
    },
    
    // Facilities
    commonFacilities: {
      wifi: 'WiFi',
      ac: 'AC',
      parking: 'Parkir',
      kitchen: 'Dapur',
      laundry: 'Laundry',
      security: 'Keamanan 24 Jam',
      cctv: 'CCTV',
      garden: 'Taman',
      gym: 'Gym',
      pool: 'Kolam Renang',
    },
  },

  // Rental/Booking
  rental: {
    rental: 'Sewa',
    rentals: 'Sewa',
    booking: 'Pemesanan',
    application: 'Aplikasi',
    status: 'Status',
    startDate: 'Tanggal Mulai',
    endDate: 'Tanggal Berakhir',
    duration: 'Durasi',
    totalCost: 'Total Biaya',
    deposit: 'Deposit',
    monthlyRent: 'Sewa Bulanan',
    dueDate: 'Jatuh Tempo',
    
    // Rental status
    statuses: {
      pending: 'Menunggu',
      approved: 'Disetujui',
      rejected: 'Ditolak',
      active: 'Aktif',
      expired: 'Berakhir',
      cancelled: 'Dibatalkan',
    },
    
    messages: {
      applicationSubmitted: 'Aplikasi sewa telah dikirim',
      applicationApproved: 'Aplikasi sewa disetujui',
      applicationRejected: 'Aplikasi sewa ditolak',
      rentalExpiring: 'Sewa akan berakhir dalam :days hari',
      renewalNeeded: 'Perpanjangan diperlukan',
    },
  },

  // Payment
  payment: {
    payment: 'Pembayaran',
    payments: 'Pembayaran',
    paymentHistory: 'Riwayat Pembayaran',
    paymentMethod: 'Metode Pembayaran',
    amount: 'Jumlah',
    date: 'Tanggal',
    time: 'Waktu',
    transactionId: 'ID Transaksi',
    reference: 'Referensi',
    receipt: 'Kwitansi',
    invoice: 'Faktur',
    
    // Payment status
    statuses: {
      pending: 'Menunggu',
      processing: 'Diproses',
      completed: 'Selesai',
      failed: 'Gagal',
      cancelled: 'Dibatalkan',
      refunded: 'Dikembalikan',
    },
    
    // Payment methods
    methods: {
      bankTransfer: 'Transfer Bank',
      creditCard: 'Kartu Kredit',
      debitCard: 'Kartu Debit',
      eWallet: 'E-Wallet',
      qris: 'QRIS',
      cash: 'Tunai',
    },
    
    messages: {
      paymentSuccessful: 'Pembayaran berhasil',
      paymentFailed: 'Pembayaran gagal',
      paymentPending: 'Pembayaran sedang diproses',
      paymentOverdue: 'Pembayaran terlambat',
      reminderSent: 'Pengingat pembayaran dikirim',
    },
    // Backwards-compatible simple keys used across components
    status: {
      pending: 'Menunggu',
      processing: 'Diproses',
      completed: 'Selesai',
      failed: 'Gagal',
      cancelled: 'Dibatalkan',
      refunded: 'Dikembalikan',
    },
    type: {
      monthlyRent: 'Sewa Bulanan',
      deposit: 'Deposit',
      lateFee: 'Denda',
      utility: 'Utilitas',
      other: 'Lainnya',
    },
    filterByStatus: 'Filter berdasarkan status',
    filterByType: 'Filter berdasarkan tipe',
    empty: {
      title: 'Tidak ada pembayaran',
      description: 'Anda belum memiliki pembayaran.',
    },
    lateFee: 'Denda keterlambatan',
    for: 'untuk',
    downloadReceipt: 'Unduh kwitansi',
    dueDate: 'Tanggal jatuh tempo',
    createdAt: 'Dibuat pada',
    paidAt: 'Dibayar pada',
    daysOverdue: 'hari terlambat',
    overdue: 'Pembayaran terlambat',
    overdueDesc: 'Pembayaran Anda terlambat. Silakan lakukan pembayaran segera.',
    failed: 'Pembayaran gagal',
    failedDesc: 'Upaya pembayaran gagal. Silakan coba lagi atau hubungi dukungan.',
    processing: 'Sedang diproses',
    processingDesc: 'Pembayaran Anda sedang diproses. Mohon tunggu beberapa menit.',
    backToList: 'Kembali ke daftar pembayaran',
  statusLabel: 'Status',
  myPayments: 'Pembayaran Saya',
  myPaymentsDesc: 'Kelola dan lihat riwayat pembayaran serta kwitansi Anda',
  },

  // Generic labels
  notes: 'Catatan',

  // Notifications
  notification: {
    notifications: 'Notifikasi',
    noNotifications: 'Tidak ada notifikasi',
    markAllRead: 'Tandai Semua Dibaca',
    markAsRead: 'Tandai Dibaca',
    delete: 'Hapus',
    deleteAll: 'Hapus Semua',
    
    types: {
      payment: 'Pembayaran',
      rental: 'Sewa',
      system: 'Sistem',
      promotion: 'Promosi',
      reminder: 'Pengingat',
    },
    
    // Common notification messages
    messages: {
      welcomeMessage: 'Selamat datang di KostManager!',
      profileIncomplete: 'Lengkapi profil Anda untuk pengalaman yang lebih baik',
      paymentReminder: 'Pengingat: Pembayaran sewa jatuh tempo pada :date',
      paymentOverdue: 'Pembayaran sewa Anda terlambat. Silakan segera lakukan pembayaran',
      paymentReceived: 'Pembayaran sewa bulan :month telah diterima',
      rentalApproved: 'Aplikasi sewa Anda telah disetujui',
      rentalRejected: 'Aplikasi sewa Anda ditolak',
      rentalExpiring: 'Sewa Anda akan berakhir dalam :days hari',
      newRentalRequest: 'Aplikasi sewa baru untuk kamar :room',
      roomAvailable: 'Kamar favorit Anda sekarang tersedia',
      maintenanceScheduled: 'Maintenance dijadwalkan untuk :date',
      systemUpdate: 'Sistem akan diperbarui pada :date',
    },
  },

  // Common forms
  form: {
    required: 'Wajib diisi',
    optional: 'Opsional',
    pleaseSelect: 'Silakan pilih',
    chooseFile: 'Pilih file',
    dragDropFile: 'Seret dan lepas file di sini',
    maxFileSize: 'Ukuran maksimal :size',
    allowedFileTypes: 'Tipe file yang diizinkan: :types',
    
    // Validation messages
    validation: {
      emailInvalid: 'Alamat email tidak valid',
      passwordTooShort: 'Kata sandi minimal 8 karakter',
      passwordMismatch: 'Konfirmasi kata sandi tidak cocok',
      phoneInvalid: 'Nomor telepon tidak valid',
      fileTooLarge: 'File terlalu besar',
      fileTypeNotSupported: 'Tipe file tidak didukung',
    },
  },

  // Common UI elements
  ui: {
    loading: 'Memuat...',
    saving: 'Menyimpan...',
    noData: 'Tidak ada data',
    noResults: 'Tidak ada hasil',
    searchPlaceholder: 'Cari...',
    filterBy: 'Filter berdasarkan',
    sortBy: 'Urutkan berdasarkan',
    showMore: 'Tampilkan lebih banyak',
    showLess: 'Tampilkan lebih sedikit',
    readMore: 'Baca selengkapnya',
    readLess: 'Baca lebih sedikit',
    expand: 'Perluas',
    collapse: 'Tutup',
    fullscreen: 'Layar penuh',
    exitFullscreen: 'Keluar dari layar penuh',
    refresh: 'Refresh',
    print: 'Cetak',
    share: 'Bagikan',
    export: 'Ekspor',
    import: 'Impor',
    comingSoon: 'Implementasi akan segera hadir...',
  },

  // Short common labels
  language: 'Bahasa',


  // Pages
  pages: {
    myKostans: 'Kostan Saya',
    myRentals: 'Sewa Saya',
    payments: 'Pembayaran',
    profile: 'Profil',
    browseKostans: 'Jelajahi Kostan',
    kostanListing: 'Halaman daftar kostan akan segera hadir...',
  },

  // List / Browse specific translations (components use `kostans.*` keys)
  kostans: {
    browse: {
      title: 'Jelajahi Kostan',
    },
    search: {
      placeholder: 'Cari kostan, lokasi, atau fasilitas...',
    },
    filter: {
      allCities: 'Semua Kota',
    },
    empty: {
      title: 'Tidak ada kostan ditemukan',
      description: 'Tidak ditemukan kostan yang sesuai dengan pencarian Anda.',
      ownerDescription: 'Anda belum menambahkan kostan. Buat kostan pertama Anda sekarang.',
    },
    rooms: 'kamar',
    viewDetails: 'Lihat Detail',
    myKostans: 'Kostan Saya',
    myKostansDesc: 'Kelola kostan Anda',
    create: 'Buat Kostan',
    delete: {
      confirm: 'Apakah Anda yakin ingin menghapus kostan ini? Tindakan ini tidak dapat dibatalkan.'
    },
    owner: 'Pemilik',
    facilities: 'Fasilitas',
    rules: 'Peraturan',
    availableRooms: 'Kamar Tersedia',
    reviews: 'Ulasan',
  },

  // Pagination
  pagination: {
    previous: 'Sebelumnya',
    next: 'Berikutnya',
  },

  // Short common strings used in list cards
  more: 'lebih',

  // Error messages
  error: {
    general: 'Terjadi kesalahan. Silakan coba lagi.',
    network: 'Kesalahan jaringan. Periksa koneksi internet Anda.',
    server: 'Kesalahan server. Silakan coba lagi nanti.',
    unauthorized: 'Anda tidak memiliki akses.',
    forbidden: 'Akses ditolak.',
    notFound: 'Halaman tidak ditemukan.',
    validation: 'Data yang dimasukkan tidak valid.',
    timeout: 'Permintaan timeout. Silakan coba lagi.',
    fileUpload: 'Gagal mengunggah file.',
    
    // Specific error messages
    loginFailed: 'Login gagal. Periksa email dan kata sandi Anda.',
    registrationFailed: 'Pendaftaran gagal. Silakan coba lagi.',
    paymentFailed: 'Pembayaran gagal. Silakan coba metode lain.',
    bookingFailed: 'Pemesanan gagal. Kamar mungkin sudah tidak tersedia.',
    
    // 404 page
    pageNotFound: 'Halaman tidak ditemukan',
    goHome: 'Kembali ke Beranda',
  },

  // Success messages
  success: {
    general: 'Berhasil!',
    saved: 'Data berhasil disimpan',
    updated: 'Data berhasil diperbarui',
    deleted: 'Data berhasil dihapus',
    sent: 'Berhasil dikirim',
    uploaded: 'File berhasil diunggah',
    
    // Specific success messages
    loginSuccess: 'Login berhasil',
    registrationSuccess: 'Pendaftaran berhasil',
    paymentSuccess: 'Pembayaran berhasil',
    bookingSuccess: 'Pemesanan berhasil',
    profileUpdated: 'Profil berhasil diperbarui',
    passwordChanged: 'Kata sandi berhasil diubah',
  },

  // Date and time
  date: {
    today: 'Hari ini',
    yesterday: 'Kemarin',
    tomorrow: 'Besok',
    thisWeek: 'Minggu ini',
    thisMonth: 'Bulan ini',
    thisYear: 'Tahun ini',
    
    // Months
    months: {
      january: 'Januari',
      february: 'Februari',
      march: 'Maret',
      april: 'April',
      may: 'Mei',
      june: 'Juni',
      july: 'Juli',
      august: 'Agustus',
      september: 'September',
      october: 'Oktober',
      november: 'November',
      december: 'Desember',
    },
    
    // Days
    days: {
      monday: 'Senin',
      tuesday: 'Selasa',
      wednesday: 'Rabu',
      thursday: 'Kamis',
      friday: 'Jumat',
      saturday: 'Sabtu',
      sunday: 'Minggu',
    },
  },

  // Units and measurements
  units: {
    currency: 'Rp',
    sqm: 'm²',
    km: 'km',
    minute: 'menit',
    hour: 'jam',
    day: 'hari',
    week: 'minggu',
    month: 'bulan',
    year: 'tahun',
  },
};
