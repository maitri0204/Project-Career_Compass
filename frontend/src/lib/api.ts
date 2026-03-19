import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - attach token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (data: {
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    mobile?: string;
    country?: string;
    state?: string;
    city?: string;
    classGrade?: string;
    schoolName?: string;
    board?: string;
  }) => api.post("/auth/signup", data),

  verifySignup: (data: { email: string; otp: string }) =>
    api.post("/auth/verify-signup", data),

  verifySignupOTP: (data: { email: string; otp: string }) =>
    api.post("/auth/verify-signup", data),

  login: (data: { email: string }) => api.post("/auth/login", data),

  verifyOTP: (data: { email: string; otp: string }) =>
    api.post("/auth/verify-otp", data),

  getProfile: () => api.get("/auth/profile"),
};

// Question API
export const questionAPI = {
  getAll: (partNumber?: number) =>
    api.get("/questions", { params: partNumber ? { partNumber } : {} }),

  getById: (id: string) => api.get(`/questions/${id}`),

  create: (data: any) => api.post("/questions", data),

  update: (id: string, data: any) => api.put(`/questions/${id}`, data),

  delete: (id: string) => api.delete(`/questions/${id}`),
};

// Test API
export const testAPI = {
  start: () => api.post("/test/start"),

  submit: (id: string, answers: Record<string, string>) =>
    api.put(`/test/${id}/submit`, { answers }),

  getMyResults: () => api.get("/test/my-results"),

  getResult: (id: string) => api.get(`/test/result/${id}`),
};

// Admin Test API
export const adminTestAPI = {
  getAllResults: () => api.get("/test/admin/results"),

  getStudents: () => api.get("/test/admin/students"),

  getStudentResults: (studentId: string) =>
    api.get(`/test/admin/students/${studentId}/results`),
};

export default api;
