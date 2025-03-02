"use client"
import useAuth from '@/hooks/use-auth';
import DashboardLayout from '@/layout/DashboardLayout';
import MainLayout from '@/layout/MainLayout';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
const Layout = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter()
    const checkAuth = useAuth()

    useEffect(() => {
        if (checkAuth?.isAuthenticated) {
            router.push('/dashboard')
        } else {
            router.push('/login')
        }
    }, [checkAuth?.isAuthenticated, router])
    return (
        <MainLayout>
            <DashboardLayout>{children}</DashboardLayout>
        </MainLayout>
    );
};

export default Layout;