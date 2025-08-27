export default {
  // Navigation
  nav: {
    home: 'Home',
    kostans: 'Boarding Houses',
    dashboard: 'Dashboard',
    profile: 'Profile',
    myKostans: 'My Boarding Houses',
    myRentals: 'My Rentals',
    payments: 'Payments',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
  },

  // Error messages
  error: {
    general: 'An error occurred. Please try again.',
    network: 'Network error. Check your internet connection.',
    server: 'Server error. Please try again later.',
    unauthorized: 'You do not have access.',
    forbidden: 'Access denied.',
    notFound: 'Page not found.',
    validation: 'The data entered is invalid.',
    timeout: 'Request timeout. Please try again.',
    fileUpload: 'Failed to upload file.',
    
    // Specific error messages
    loginFailed: 'Login failed. Check your email and password.',
    registrationFailed: 'Registration failed. Please try again.',
    paymentFailed: 'Payment failed. Please try another method.',
    bookingFailed: 'Booking failed. Room may no longer be available.',
    
    // 404 page
    pageNotFound: 'Page not found',
    goHome: 'Go Home',
  },

  // Authentication
  auth: {
    signIn: 'Sign in to your account',
    signUp: 'Create your account',
    createAccount: 'Create Account',
    alreadyHaveAccount: 'Already have an account?',
    signInHere: 'sign in to existing account',
    emailAddress: 'Email address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    name: 'Full Name',
    phone: 'Phone Number',
    phoneOptional: 'Phone Number (Optional)',
    role: 'Account Type',
    owner: 'Owner (Managing boarding house)',
    tenant: 'Tenant (Looking for room)',
    enterEmail: 'Enter your email',
    enterPassword: 'Enter your password',
    enterName: 'Enter your full name',
    enterPhone: 'Enter your phone number',
    confirmPasswordPlaceholder: 'Confirm your password',
    selectRole: 'Select your role',
  selectKostanLabel: 'Select a boarding house',
  selectKostanPlaceholder: '-- Select a boarding house --',
  noKostans: 'No boarding houses available at the moment',
    forgotPassword: 'Forgot password?',
    rememberMe: 'Remember me',
    or: 'Or',
  unauthorized: 'You do not have access.',
  },

  // Buttons
  button: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    submit: 'Submit',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    search: 'Search',
    filter: 'Filter',
    reset: 'Reset',
    close: 'Close',
    confirm: 'Confirm',
    loading: 'Loading...',
    getStarted: 'Get Started',
    browseKostans: 'Browse Boarding Houses',
    goToDashboard: 'Go to Dashboard',
    signIn: 'Sign in',
    register: 'Register',
    viewDetails: 'View Details',
    bookNow: 'Book Now',
    applyNow: 'Apply Now',
    pay: 'Pay',
    download: 'Download',
    upload: 'Upload',
  },

  // Home Page
  home: {
    title: 'Boarding House Management Made Simple',
    subtitle: 'Complete solution for managing boarding houses with integrated payment system, tenant management, and mobile-first design.',
    whyChoose: 'Why Choose KostManager?',
    whyChooseSubtitle: 'Designed specifically for Indonesian boarding house management with modern features and mobile-first approach.',
    features: {
      easyManagement: {
        title: 'Easy Management',
        description: 'Manage multiple boarding houses, rooms, and tenants from one dashboard.',
      },
      securePayments: {
        title: 'Secure Payments',
        description: 'Integrated payment system with multiple payment methods.',
      },
      tenantPortal: {
        title: 'Tenant Portal',
        description: 'Tenants can easily browse, apply, and make payments online.',
      },
      reliableSecure: {
        title: 'Reliable & Secure',
        description: 'Built with security and reliability in mind for your peace of mind.',
      },
    },
    statistics: {
      title: 'Trusted by Thousands of Users',
      kostans: 'Registered Boarding Houses',
      owners: 'Boarding House Owners',
      tenants: 'Active Tenants',
      transactions: 'Successful Transactions',
    },
    testimonials: {
      title: 'What They Say',
      subtitle: 'Hear directly from users who have experienced the benefits of KostManager.',
    },
    cta: {
      title: 'Ready to Get Started?',
      subtitle: 'Join thousands of boarding house owners and tenants using KostManager.',
      ownerCta: 'Register as Owner',
      tenantCta: 'Register as Tenant',
    },
  },

  // Dashboard
  dashboard: {
    welcome: 'Welcome',
    welcomeBack: 'Welcome back',
    overview: 'Overview',
    recentActivity: 'Recent Activity',
    quickActions: 'Quick Actions',
    statistics: 'Statistics',
    notifications: 'Notifications',
    noNotifications: 'No notifications',
    viewAll: 'View All',
    comingSoon: 'Implementation coming soon...',
    quickOverview: 'Quick Overview',
    
    // Owner dashboard
    owner: {
      welcomeText: 'Manage your boarding houses and tenants from this dashboard.',
      totalKostans: 'Total Boarding Houses',
      totalRooms: 'Total Rooms',
      occupiedRooms: 'Occupied Rooms',
      monthlyRevenue: 'Monthly Revenue',
      pendingPayments: 'Pending Payments',
      newApplications: 'New Applications',
      addNewKostan: 'Add New Boarding House',
      manageRooms: 'Manage Rooms',
      viewReports: 'View Reports',
      myKostans: 'My Kostans',
      myKostansDesc: 'Manage your boarding houses',
      rentalApplications: 'Rental Applications',
      rentalApplicationsDesc: 'Review tenant applications',
    },
    
    // Tenant dashboard
    tenant: {
      welcomeText: 'Find and manage your rental from this dashboard.',
      currentRental: 'Current Rental',
      nextPayment: 'Next Payment',
      paymentHistory: 'Payment History',
      findRoom: 'Find Room',
      payRent: 'Pay Rent',
      contactOwner: 'Contact Owner',
      browseKostans: 'Browse Kostans',
      browseKostansDesc: 'Find your perfect room',
      myRentals: 'My Rentals',
      myRentalsDesc: 'View your current rental',
      payments: 'Payments',
    },
  },

  // Kostan/Room related
  kostan: {
    kostan: 'Boarding House',
    kostans: 'Boarding Houses',
    room: 'Room',
    rooms: 'Rooms',
    available: 'Available',
    occupied: 'Occupied',
    maintenance: 'Maintenance',
    price: 'Price',
    priceFrom: 'Starting from',
    perMonth: '/month',
    facilities: 'Facilities',
    description: 'Description',
    location: 'Location',
    address: 'Address',
    contact: 'Contact',
    owner: 'Owner',
    type: 'Type',
    size: 'Size',
    floor: 'Floor',
    availability: 'Availability',
    images: 'Images',
    details: 'Details',
    specifications: 'Specifications',
    nearbyPlaces: 'Nearby Places',
    reviews: 'Reviews',
    rules: 'Rules',
    
    // Room types
    roomTypes: {
      single: 'Single Bedroom',
      shared: 'Shared Room',
      private: 'Private Room',
      suite: 'Suite',
    },
    
    // Facilities
    commonFacilities: {
      wifi: 'WiFi',
      ac: 'AC',
      parking: 'Parking',
      kitchen: 'Kitchen',
      laundry: 'Laundry',
      security: '24-Hour Security',
      cctv: 'CCTV',
      garden: 'Garden',
      gym: 'Gym',
      pool: 'Swimming Pool',
    },
  },

  // Rental/Booking
  rental: {
    rental: 'Rental',
    rentals: 'Rentals',
    booking: 'Booking',
    application: 'Application',
  // label for status column
    startDate: 'Start Date',
    endDate: 'End Date',
    duration: 'Duration',
    totalCost: 'Total Cost',
    deposit: 'Deposit',
    monthlyRent: 'Monthly Rent',
    dueDate: 'Due Date',
    // Additional keys used by MyRentalsPage
    myRentals: 'My Rentals',
    myRentalsDesc: 'View your current rentals',
    statusLabel: 'Status',
    status: {
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      active: 'Active',
      expired: 'Expired',
      cancelled: 'Cancelled',
      terminated: 'Terminated',
    },
    
    // Rental status
    statuses: {
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      active: 'Active',
      expired: 'Expired',
      cancelled: 'Cancelled',
    },
    
    messages: {
      applicationSubmitted: 'Rental application submitted',
      applicationApproved: 'Rental application approved',
      applicationRejected: 'Rental application rejected',
      rentalExpiring: 'Rental expires in :days days',
      renewalNeeded: 'Renewal needed',
    },
    // UI specific / page-specific strings
    activeRental: 'Active Rental',
    pendingApproval: 'Pending Approval',
    pendingDesc: 'Your rental application is pending owner approval.',
    nextPayment: 'Next Payment',
    daysUntilExpiry: 'days until expiry',
    expiredOn: 'Expired on',
    terminated: 'Terminated',
    terminatedOn: 'Terminated on',
    rejected: 'Rejected',
    expired: 'Expired',
    empty: {
      title: 'No rentals',
      description: 'You have no current rentals.',
      filtered: 'No rentals with this status',
      filteredDesc: 'No rentals found for the selected filter.',
    },
    per: 'per',
    month: 'month',
  },

  // Payment
  payment: {
    payment: 'Payment',
    payments: 'Payments',
    paymentHistory: 'Payment History',
    paymentMethod: 'Payment Method',
    amount: 'Amount',
    date: 'Date',
    time: 'Time',
    transactionId: 'Transaction ID',
    reference: 'Reference',
    receipt: 'Receipt',
    invoice: 'Invoice',
    
    // Payment status
    statuses: {
      pending: 'Pending',
      processing: 'Processing',
      completed: 'Completed',
      failed: 'Failed',
      cancelled: 'Cancelled',
      refunded: 'Refunded',
    },
    
    // Payment methods
    methods: {
      bankTransfer: 'Bank Transfer',
      creditCard: 'Credit Card',
      debitCard: 'Debit Card',
      eWallet: 'E-Wallet',
      qris: 'QRIS',
      cash: 'Cash',
    },
    
    messages: {
      paymentSuccessful: 'Payment successful',
      paymentFailed: 'Payment failed',
      paymentPending: 'Payment pending',
      paymentOverdue: 'Payment overdue',
      reminderSent: 'Payment reminder sent',
    },
    // Backwards-compatible simple keys used across components
    status: {
      pending: 'Pending',
      processing: 'Processing',
      completed: 'Completed',
      failed: 'Failed',
      cancelled: 'Cancelled',
      refunded: 'Refunded',
    },
    type: {
      monthlyRent: 'Monthly Rent',
      deposit: 'Deposit',
      lateFee: 'Late Fee',
      utility: 'Utility',
      other: 'Other',
    },
    filterByStatus: 'Filter by status',
    filterByType: 'Filter by type',
    empty: {
      title: 'No payments found',
      description: 'You have no payments yet.',
    },
    lateFee: 'Late fee',
    for: 'for',
    downloadReceipt: 'Download receipt',
    dueDate: 'Due date',
    createdAt: 'Created at',
    paidAt: 'Paid at',
    daysOverdue: 'days overdue',
    overdue: 'Payment overdue',
    overdueDesc: 'Your payment is overdue. Please make the payment as soon as possible.',
    failed: 'Payment failed',
    failedDesc: 'Payment attempt failed. Please try again or contact support.',
    processing: 'Processing',
    processingDesc: 'Your payment is being processed. This may take a few minutes.',
    backToList: 'Back to payments',
  statusLabel: 'Status',
  myPayments: 'My Payments',
  myPaymentsDesc: 'Manage and view your payment history and receipts',
  },

  // Generic labels
  notes: 'Notes',
  // Common small strings used across pages
  all: 'All',
  view: 'View',
  details: 'Details',
  room: 'Room',
  per: 'per',
  month: 'month',
  reason: 'Reason',

  // Notifications
  notification: {
    notifications: 'Notifications',
    noNotifications: 'No notifications',
    markAllRead: 'Mark All Read',
    markAsRead: 'Mark as Read',
    delete: 'Delete',
    deleteAll: 'Delete All',
    
    types: {
      payment: 'Payment',
      rental: 'Rental',
      system: 'System',
      promotion: 'Promotion',
      reminder: 'Reminder',
    },
    
    // Common notification messages
    messages: {
      welcomeMessage: 'Welcome to KostManager!',
      profileIncomplete: 'Complete your profile for a better experience',
      paymentReminder: 'Reminder: Rent payment due on :date',
      paymentOverdue: 'Your rent payment is overdue. Please make payment immediately',
      paymentReceived: 'Rent payment for :month has been received',
      rentalApproved: 'Your rental application has been approved',
      rentalRejected: 'Your rental application was rejected',
      rentalExpiring: 'Your rental expires in :days days',
      newRentalRequest: 'New rental request for room :room',
      roomAvailable: 'Your favorite room is now available',
      maintenanceScheduled: 'Maintenance scheduled for :date',
      systemUpdate: 'System will be updated on :date',
    },
  },

  // Common forms
  form: {
    required: 'Required',
    optional: 'Optional',
    pleaseSelect: 'Please select',
    chooseFile: 'Choose file',
    dragDropFile: 'Drag and drop file here',
    maxFileSize: 'Maximum size :size',
    allowedFileTypes: 'Allowed file types: :types',
    
    // Validation messages
    validation: {
      emailInvalid: 'Invalid email address',
      passwordTooShort: 'Password must be at least 8 characters',
      passwordMismatch: 'Password confirmation does not match',
      phoneInvalid: 'Invalid phone number',
      fileTooLarge: 'File is too large',
      fileTypeNotSupported: 'File type is not supported',
    },
  },

  // Common UI elements
  ui: {
    loading: 'Loading...',
    saving: 'Saving...',
    noData: 'No data',
    noResults: 'No results',
    searchPlaceholder: 'Search...',
    filterBy: 'Filter by',
    sortBy: 'Sort by',
    showMore: 'Show more',
    showLess: 'Show less',
    readMore: 'Read more',
    readLess: 'Read less',
    expand: 'Expand',
    collapse: 'Collapse',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit fullscreen',
    refresh: 'Refresh',
    print: 'Print',
    share: 'Share',
    export: 'Export',
    import: 'Import',
    comingSoon: 'Implementation coming soon...',
  },

  // Short common labels
  language: 'Language',


  // Pages
  pages: {
    myKostans: 'My Kostans',
    myRentals: 'My Rentals',
    payments: 'Payments',
    profile: 'Profile',
    browseKostans: 'Browse Kostans',
    kostanListing: 'Kostan listing page implementation coming soon...',
  },

  // List / Browse specific translations (components use `kostans.*` keys)
  kostans: {
    browse: {
      title: 'Browse Boarding Houses',
    },
    search: {
      placeholder: 'Search boarding houses, location, or facilities...',
    },
    filter: {
      allCities: 'All Cities',
    },
    empty: {
      title: 'No boarding houses found',
      description: 'No boarding houses match your search.',
      ownerDescription: 'You have not added any boarding houses yet. Create your first one now.',
    },
    rooms: 'rooms',
    viewDetails: 'View Details',
    myKostans: 'My Kostans',
    myKostansDesc: 'Manage your boarding houses',
    create: 'Create Boarding House',
    delete: {
      confirm: 'Are you sure you want to delete this boarding house? This action cannot be undone.'
    },
    owner: 'Owner',
    facilities: 'Facilities',
    rules: 'Rules',
    availableRooms: 'Available Rooms',
    reviews: 'Reviews',
  },

  // Pagination
  pagination: {
    previous: 'Previous',
    next: 'Next',
  },

  // Short common strings used in list cards
  more: 'more',

  // Success messages
  success: {
    general: 'Success!',
    saved: 'Data saved successfully',
    updated: 'Data updated successfully',
    deleted: 'Data deleted successfully',
    sent: 'Sent successfully',
    uploaded: 'File uploaded successfully',
    
    // Specific success messages
    loginSuccess: 'Login successful',
    registrationSuccess: 'Registration successful',
    paymentSuccess: 'Payment successful',
    bookingSuccess: 'Booking successful',
    profileUpdated: 'Profile updated successfully',
    passwordChanged: 'Password changed successfully',
  },

  // Date and time
  date: {
    today: 'Today',
    yesterday: 'Yesterday',
    tomorrow: 'Tomorrow',
    thisWeek: 'This week',
    thisMonth: 'This month',
    thisYear: 'This year',
    
    // Months
    months: {
      january: 'January',
      february: 'February',
      march: 'March',
      april: 'April',
      may: 'May',
      june: 'June',
      july: 'July',
      august: 'August',
      september: 'September',
      october: 'October',
      november: 'November',
      december: 'December',
    },
    
    // Days
    days: {
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday',
    },
  },

  // Units and measurements
  units: {
    currency: 'Rp',
    sqm: 'sqm',
    km: 'km',
    minute: 'minute',
    hour: 'hour',
    day: 'day',
    week: 'week',
    month: 'month',
    year: 'year',
  },
};
