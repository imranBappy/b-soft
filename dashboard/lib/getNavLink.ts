import { ADMIN, MANAGER, WAITER, CHEF } from '@/constants/role.constants';
import { Bot, Settings2, SquareTerminal, Users } from 'lucide-react';
import authVerify from './auth';

interface NavItem {
    title: string;
    icon?: React.ComponentType;
    url: string;
    items?: NavItem[];
    isActive?: boolean;
}

type NavLinks = {
    [key: string]: NavItem[];
};

const navbarLinks: NavLinks = {
    [ADMIN]: [
        {
            title: 'Dashboard',
            url: '/',
            icon: SquareTerminal,
            isActive: true,
        },
        {
            title: 'User',
            url: '/users',
            icon: Users,
            items: [
                {
                    title: 'User List',
                    url: '/users',
                },
            ],
        },
        {
            title: 'Product',
            url: '/product',
            icon: Bot,
            items: [
                {
                    title: 'Product List',
                    url: '/product',
                },
                {
                    title: 'Category List',
                    url: '/product/category',
                },
            ],
        },
        {
            title: 'Order ',
            url: '#',
            icon: SquareTerminal,
            items: [
                {
                    title: 'Order list',
                    url: '/orders',
                },
                {
                    title: 'Payment list',
                    url: '/orders/payments',
                },
            ],
        },
        {
            title: 'Blog',
            url: '/blog',
            icon: Bot,
            items: [
                {
                    title: 'Blog List',
                    url: '/blog',
                },
                // {
                //     title: 'Category List',
                //     url: '/product/category',
                // },
            ],
        },
        {
            title: 'Settings',
            url: '#',
            icon: Settings2,
            items: [
                {
                    title: 'Slider',
                    url: '/settings/sliders',
                },
            ],
        },
    ],
    [MANAGER]: [
        {
            title: 'Dashboard',
            url: '/',
            icon: SquareTerminal,
            isActive: true,
        },
        {
            title: 'Product',
            url: '#',
            icon: Bot,
            items: [
                {
                    title: 'Product List',
                    url: '#',
                },
                {
                    title: 'Product Dashboard',
                    url: '#',
                },
                {
                    title: 'Add Product',
                    url: '#',
                },
            ],
        },
        {
            title: 'Manage Order',
            url: '#',
            icon: SquareTerminal,
            items: [
                {
                    title: 'Order list',
                    url: '#',
                },
                {
                    title: 'Counter List',
                    url: '#',
                },
                {
                    title: 'Complete order',
                    url: '#',
                },
            ],
        },
    ],
    [CHEF]: [
        {
            title: 'Dashboard',
            url: '/',
            icon: SquareTerminal,
            isActive: true,
        },
    ],
    [WAITER]: [
        {
            title: 'Order ',
            url: '#',
            icon: SquareTerminal,
            items: [
                {
                    title: 'Order list',
                    url: '/orders',
                },
                {
                    title: 'Payment list',
                    url: '/orders/payments',
                },
                {
                    title: 'POS',
                    url: '/dashboard',
                },
            ],
        },
    ],
};

const getNavLink = (): NavItem[] => {
    try {
        const auth = authVerify();
        if ('error' in auth) return [];
        return navbarLinks[auth.role] || [];
    } catch {
        return [];
    }
};

export default getNavLink;
