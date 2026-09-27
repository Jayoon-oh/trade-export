export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    name: string;
    role: string;
}