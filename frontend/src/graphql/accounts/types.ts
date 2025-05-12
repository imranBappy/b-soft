
export interface USER_TYPE {
    id?: string
    name: string
    email: string
    photo?: string,
    role?: {
        id: string
        name: string
    }
    gender?: string
    isActive?: boolean
    isVerified?: boolean
}

export interface USERS_TYPE {
    products: USER_TYPE[];
}

export interface ROLE_TYPE {
    id: string,
    name: string
}
