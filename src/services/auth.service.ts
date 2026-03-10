import { api } from "./api";

export const authService = {
  login: async (email: string, password: string) => {
    const response: any = await api.post("/users/login", { email, password });
    
    if (response.success && response.data) {
      const { accessToken, refreshToken, user } = response.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));
      return { success: true, user };
    }
    
    return { success: false, message: response.message || "Login failed" };
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },

  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  getToken: () => {
    return localStorage.getItem("accessToken");
  }
};
