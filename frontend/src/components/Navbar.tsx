"use client";

import Image from 'next/image';
import Logo from '@/assets/logo.png'
import Link from 'next/link';
import { User, Search } from 'lucide-react';
import SearchInput from './SearchInput';
import ThemeButton from './ThemeButton';
import { Button } from "@/components/ui/button"
import useAuth from '@/hooks/use-auth';
import Profile from './Profile';


const Navbar = () => {
    const auth = useAuth()
    return (
        <div className="navbar border-b h-[80px]   bg-gray-deep     ">
            <div className="container">
                <div className="navbar-wrap  h-[80px]  flex items-center justify-between">
                    <div className="logo">
                        <Link href={'/'}>
                            <Image src={Logo} width={100} height={100} alt='' />
                        </Link>
                    </div>
                    <div className="search hidden md:block">
                        <SearchInput />
                    </div>
                    <div className="flex items-center gap-3">
                        <Button className=' md:hidden px-3  font-playfair text-base' variant={'secondary'}>
                            <Link href={'/shop'} className='flex items-center gap-2' >
                                <Search className="text-4xl" />
                            </Link>
                        </Button>
                        {
                            auth?.isAuthenticated ? (
                                <Profile
                                />
                            ) : (<Button className='  font-playfair  px-3 text-base' variant={'ghost'}>
                                <Link href={'/login'} className='flex items-center gap-2' >
                                    <User className="text-4xl" />
                                    <span>Sign in </span>
                                </Link>
                            </Button>)
                        }
                        <ThemeButton />
                    </div>

                </div>
            </div>
        </div >
    );
};

export default Navbar;