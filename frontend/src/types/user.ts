export interface User {
    id: number;
    username: string;
    password: string;
    name: string;
    role: UserRole;
    createdAt: string;
}

export type UserRole = 'STAFF' | 'ADMIN';