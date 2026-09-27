import api from './axiosInstance';
import type { Company, CompanyCreateRequest, PagedCompanies } from '../types/company';

export const createCompany = async (dto: CompanyCreateRequest): Promise<number> => {
    const response = await api.post<number>(`/companies`, dto);
    return response.data;
};

export const updateCompany = async (id: number, dto: CompanyCreateRequest): Promise<Company> => {
    const response = await api.put<Company>(`/companies/${id}`, dto);
    return response.data;
};

// pagination
export const getCompanyList = async (role?: string, companyName?: string, page: number = 0, size: number = 10): Promise<PagedCompanies> => {
    const response = await api.get<PagedCompanies>(`/companies`, {
        params: { role, companyName, page, size },
    });
    return response.data;
};

export const getAllCompanies = async (role?: string): Promise<Company[]> => {
    const response = await api.get<Company[]>('/companies/all', {
        params: { role },
    });
    return response.data;
};

export const getCompany = async (id: number): Promise<Company> => {
    const response = await api.get<Company>(`/companies/${id}`);
    return response.data;
};