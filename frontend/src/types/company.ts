export interface Company {
    id: number;
    companyName: string;
    address: string;
    country: string;
    registrationNumber: string;
    nameOfOwner: string;
    partnerDate: string;
    category: string;
    deliveryMethod: string;
    role: string;
    logoPath: string;
    signaturePath: string;
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