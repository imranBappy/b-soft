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

export const countries = [
    { value: 'BD', label: 'Bangladesh' },
    { value: 'IN', label: 'India' },
    { value: 'US', label: 'United States' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'CA', label: 'Canada' },
];