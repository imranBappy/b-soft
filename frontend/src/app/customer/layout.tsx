"use client"
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
 
import useAuth from "@/hooks/use-auth";
 
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const CustomerLayout = ({ children }: { children: React.ReactNode }) => {
     const router = useRouter();
     const checkAuth = useAuth();


     useEffect(() => {
        if (checkAuth?.isLoading)return;  
        
         if (!checkAuth?.isAuthenticated) {
             router.push('/login');
         }
     }, [checkAuth?.isAuthenticated, checkAuth?.isLoading, router]);

  
    
    return (
        <div className="container flex  gap-7">
            <div className="  w-64 hidden md:block">
                <h4 className=" font-playfair text-2xl my-5 ">My Account</h4>
                <Separator />
                <ul className="flex flex-col  my-5">
                    <li>
                        <Button
                            variant={'link'}
                            className="mx-0 px-0 pt-0 text-blue"
                        >
                            <Link href="/customer/profile">My Account</Link>
                        </Button>
                    </li>
                    <li>
                        <Button
                            variant={'link'}
                            className="mx-0 px-0 text-blue"
                        >
                            <Link href="/customer/orders">My Orders</Link>
                        </Button>
                    </li>
                    <li className="mt-3">
                        <Button
                            onClick={() => checkAuth?.logout()}
                            variant={'outline'}
                            className=" w-full rounded-none"
                        >
                            Logout
                        </Button>
                    </li>
                </ul>
            </div>
            <div className="px-2 w-full">{children}</div>
        </div>
    );
};

export default CustomerLayout;