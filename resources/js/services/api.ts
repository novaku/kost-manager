import axios, { AxiosInstance, AxiosResponse, AxiosProgressEvent } from 'axios';
import { ApiResponse, User, RegisterData, Kostan, Room, Rental, Payment } from '@/types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: '/api',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Clear token and redirect to login
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    const response: AxiosResponse<ApiResponse<{ user: User; token: string }>> = await this.api.post('/login', {
      email,
      password,
    });
    return response.data;
  }

  async register(userData: RegisterData): Promise<ApiResponse<{ user: User; token: string }>> {
    const response: AxiosResponse<ApiResponse<{ user: User; token: string }>> = await this.api.post('/register', userData);
    return response.data;
  }

  async getProfile(): Promise<ApiResponse<{ user: User }>> {
    const response: AxiosResponse<ApiResponse<{ user: User }>> = await this.api.get('/profile');
    return response.data;
  }

  async updateProfile(userData: Partial<User>): Promise<ApiResponse<{ user: User }>> {
    const response: AxiosResponse<ApiResponse<{ user: User }>> = await this.api.put('/profile', userData);
    return response.data;
  }

  async changePassword(currentPassword: string, newPassword: string, confirmPassword: string): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.post('/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: confirmPassword,
    });
    return response.data;
  }

  async logout(): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.post('/logout');
    return response.data;
  }

  // Kostan endpoints
  async getKostans(params?: Record<string, any>): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.get('/kostans', { params });
    return response.data;
  }

  async getKostan(id: number): Promise<ApiResponse<Kostan>> {
    const response: AxiosResponse<ApiResponse<Kostan>> = await this.api.get(`/kostans/${id}`);
    return response.data;
  }

  async createKostan(kostanData: Partial<Kostan>): Promise<ApiResponse<Kostan>> {
    const response: AxiosResponse<ApiResponse<Kostan>> = await this.api.post('/kostans', kostanData);
    return response.data;
  }

  async updateKostan(id: number, kostanData: Partial<Kostan>): Promise<ApiResponse<Kostan>> {
    const response: AxiosResponse<ApiResponse<Kostan>> = await this.api.put(`/kostans/${id}`, kostanData);
    return response.data;
  }

  async deleteKostan(id: number): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.delete(`/kostans/${id}`);
    return response.data;
  }

  async getMyKostans(params?: Record<string, any>): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.get('/my-kostans', { params });
    return response.data;
  }

  // Room endpoints
  async getRooms(kostanId: number, params?: Record<string, any>): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.get(`/kostans/${kostanId}/rooms`, { params });
    return response.data;
  }

  async getRoom(id: number): Promise<ApiResponse<Room>> {
    const response: AxiosResponse<ApiResponse<Room>> = await this.api.get(`/rooms/${id}`);
    return response.data;
  }

  async createRoom(kostanId: number, roomData: Partial<Room>): Promise<ApiResponse<Room>> {
    const response: AxiosResponse<ApiResponse<Room>> = await this.api.post(`/kostans/${kostanId}/rooms`, roomData);
    return response.data;
  }

  async updateRoom(kostanId: number, roomId: number, roomData: Partial<Room>): Promise<ApiResponse<Room>> {
    const response: AxiosResponse<ApiResponse<Room>> = await this.api.put(`/kostans/${kostanId}/rooms/${roomId}`, roomData);
    return response.data;
  }

  async deleteRoom(kostanId: number, roomId: number): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.delete(`/kostans/${kostanId}/rooms/${roomId}`);
    return response.data;
  }

  // Rental endpoints
  async applyForRental(roomId: number, rentalData: Partial<Rental>): Promise<ApiResponse<Rental>> {
    const response: AxiosResponse<ApiResponse<Rental>> = await this.api.post('/rentals/apply', {
      room_id: roomId,
      ...rentalData,
    });
    return response.data;
  }

  async getMyRentals(params?: Record<string, any>): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.get('/my-rentals', { params });
    return response.data;
  }

  async getRentalApplications(params?: Record<string, any>): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.get('/rentals/applications', { params });
    return response.data;
  }

  async getRental(id: number): Promise<ApiResponse<Rental>> {
    const response: AxiosResponse<ApiResponse<Rental>> = await this.api.get(`/rentals/${id}`);
    return response.data;
  }

  async approveRental(rentalId: number): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.post(`/rentals/${rentalId}/approve`);
    return response.data;
  }

  async rejectRental(rentalId: number, reason?: string): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.post(`/rentals/${rentalId}/reject`, { reason });
    return response.data;
  }

  // Payment endpoints
  async getMyPayments(params?: Record<string, any>): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.get('/my-payments', { params });
    return response.data;
  }

  async getPayments(params?: Record<string, any>): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.get('/payments', { params });
    return response.data;
  }

  async getPayment(id: number): Promise<ApiResponse<Payment>> {
    const response: AxiosResponse<ApiResponse<Payment>> = await this.api.get(`/payments/${id}`);
    return response.data;
  }

  async createPayment(paymentData: Partial<Payment>): Promise<ApiResponse<Payment>> {
    const response: AxiosResponse<ApiResponse<Payment>> = await this.api.post('/payments', paymentData);
    return response.data;
  }

  async processPayment(paymentId: number): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.post(`/payments/${paymentId}/process`);
    return response.data;
  }

  // Process payment with receipt upload (multipart/form-data)
  async processPaymentWithReceipt(
    paymentId: number,
    formData: FormData,
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
  ): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.post(`/payments/${paymentId}/process`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress,
    });
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.get('/health');
    return response.data;
  }
}

export default new ApiService();
