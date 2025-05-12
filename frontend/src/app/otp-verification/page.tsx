'use client';
import Loading from '@/components/ui/loading';
import { OTP_VARIFICATION } from '@/graphql/accounts';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@apollo/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const Page = () => {
    const params = useSearchParams();
    const email = params.get('email');
    const otp = params.get('otp');
    const router = useRouter();
    const { toast } = useToast();

    const [verify] = useMutation(OTP_VARIFICATION, {
        onCompleted(data) {
            if (data?.otpVerify?.success) {
                 toast({
                     description: 'Successfully varified!',
                 });
                router.push('/login');
            }
        },
        onError: (error) => {
            toast({
                description: error.message,
                variant: 'destructive',
            });
        },
    });

    useEffect(() => {
        if (email && otp) {
            verify({
                variables: {
                    email,
                    otp,
                },
            });
        }
    }, [email, otp, verify]);

    return (
        <div className=" w-full h-screen flex items-center justify-center">
            <Loading />
        </div>
    );
};

export default Page;
