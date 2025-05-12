'use client';
import Image from 'next/image';
import whatsappLogo from '@/assets/whatsapp.png';
import Link from 'next/link';
import { SETTING_QUERY } from '@/graphql/setting';
import { useQuery } from '@apollo/client';

const WhatsApp = () => {
 const { data} = useQuery(SETTING_QUERY, {
         variables: {
             id: 1,
         },
     });
    return (
        <div
            className="w-16 h-16 fixed  dark:bg-black  bg-white  border rounded-lg cursor-pointer shadow-md  md:right-[50px]  right-[10px] bottom-[130px]  "
        >
            <Link
                target="blank"
                href={data?.websiteinfo?.whatsappLink || '#'}
                className="w-full h-full flex items-center justify-center"
            >
                <Image
                    src={whatsappLogo}
                    alt="Chat"
                    width={100}
                    height={100}
                    className="w-14 h-14 "
                />
            </Link>
        </div>
    );
};

export default WhatsApp;
