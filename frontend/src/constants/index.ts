export const ORDER_STATUSES = [
    'PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED'
];

export const PAYMENT_STATUSES = [
    'PENDING',
    'COMPLETED',
    'FAILED',
    'REFUNDED'
];


export const API = process.env.NEXT_PUBLIC_URI || 'http://127.0.0.1:8000/graphql/'