import api from "./axiosInstance";
import type { LoginRequest, LoginResponse } from "../types/auth";

export const login = async (dto: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', dto);
    return response.data;
};