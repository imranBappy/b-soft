"use client";

import React, { useEffect, useState, ComponentType } from "react";
import { useRouter } from "next/navigation";
import authVerify from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

type RoleType = string[];
const withProtection = <P extends object>(WrappedComponent: ComponentType<P>, allowedRoles: RoleType) => {

    const ProtectedComponent = (props: P) => {
        const { toast } = useToast()
        const router = useRouter();
        const [isAuthorized, setIsAuthorized] = useState(false);
        useEffect(() => {
            const auth = authVerify();
            if ('error' in auth) {
                router.replace("/login");
                toast({
                    description: auth.message,
                    variant: 'destructive',
                })
                return;
            }
            if (allowedRoles.includes(auth.role)) {
                setIsAuthorized(true);
            } else {
                router.replace("/login");
                toast({
                    description: "You do not have the required permissions",
                    variant: 'destructive',
                })
            }
        }, [router, toast]);

        if (!isAuthorized) return null; // Optionally show a loading spinner here

        return <WrappedComponent {...props} />;
    };

    ProtectedComponent.displayName = `withProtection(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
    return ProtectedComponent;
};

export default withProtection;
