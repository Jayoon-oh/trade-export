export interface Company {
    id: number;
    companyName: string;
    address: string;
    country: string;
    nameOfOwner: string;
    registrationNumber: string;
    role: string;
    category?: string;
    deliveryMethod?: string;
}

export interface PagedCompanies {
    content: Company[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}

export interface CompanyCreateRequest {
    companyName: string;
    address: string;
    country: string;
    nameOfOwner: string;
    role: string;

    registrationNumber?: string;
    partnerDate?: string;
    category?: string;
    deliveryMethod?: string;
    logoPath?: string;
    signaturePath?: string;
}