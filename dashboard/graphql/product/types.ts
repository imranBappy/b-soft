import { USER_TYPE } from "../accounts/types";

interface RELATED_TYPE {
    id: string;
    name: string;
}


export interface PRODUCT_TYPE {
    id: string;
    name: string;
    description?: string;
    price: number;
    sku?: string;
    tag?: string;
    isActive?: boolean;
    createdAt?: string;
    vat: number;
    category?: RELATED_TYPE | string;
    subcategory?: RELATED_TYPE | string;
    photo?: string | Promise<string>,
    orders?: {
        totalCount: number,
        edges: {
            order: ORDER_TYPE
        }[]
    }
}
export interface CATEGORY_TYPE {
    id: string;
    name: string;
    description: string;
    photo: string;
    isActive: boolean;
    products?: PRODUCT_TYPE[];
    subcategories?: CATEGORY_TYPE[];
}

export interface SUBCATEGORY_TYPE {
    id: string;
    name: string;
    description: string;
    photo: string;
    isActive: boolean;
}

export interface ORDER_ITEM_TYPE {
    id: string;
    product?: PRODUCT_TYPE;
    quantity: number;
    price: number;
    discount?: number
    vat: number
}



export interface ORDER_TYPE {
    id: string;
    user: USER_TYPE;
    paymentMethod: string;
    totalPrice: number;
    amount: number;
    status: string;
    createdAt: string;
    category: RELATED_TYPE | string;
    orderItems: ORDER_ITEM_TYPE[];
    orderId: string
    items?: {
        edges: { node: ORDER_ITEM_TYPE }[]
    }
    payments?: {
        totalCount: number;
        edges: { node: PAYMENT_TYPE }[]
    }
}
export interface PAYMENT_TYPE {
    id: string;
    user: USER_TYPE;
    paymentMethod: string;
    amount: number;
    status: string;
    createdAt: string;
    remarks: string;
    trxId: string;
    order: ORDER_TYPE[];
}

export interface DESCRIPTION_TYPE {
    id?: string;
    product?: PRODUCT_TYPE;
    label: string;
    tag:string;
    createdAt: string;
    description: string;
}

export interface ATTRIBUTE_OPTION_TYPE {
    id: number;
    option: string;
    extraPrice: number;
    message?: string;
    photo?: string;
}
export interface ATTRIBUTE_TYPE {
    id: string;
    name: string;
    attributeOptions?: {
        totalCount?:number;
        edges: { node: ATTRIBUTE_OPTION_TYPE }[];
    };
}