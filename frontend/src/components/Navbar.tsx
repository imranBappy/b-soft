"use client";

import Image from 'next/image';
import Logo from '@/assets/logo.png'
import Link from 'next/link';
import { User, Search, ShoppingBag, Contact, MenuIcon, X } from 'lucide-react';
import SearchInput from './SearchInput';
// import ThemeButton from './ThemeButton';
import { Button } from "@/components/ui/button"
import useAuth from '@/hooks/use-auth';
import Profile from './Profile';
import { useState } from 'react';


const Navbar = () => {
    const auth = useAuth()
    const [isOpenMenu, setIsOpenMenu] = useState(false)
    const handleMenuToggle = () => {
        setIsOpenMenu(!isOpenMenu)
    }

    return (
        <div className="navbar border-b h-[80px]   bg-gray-deep  relative    ">
            <div className="container">
                <div className="navbar-wrap h-[80px]  flex items-center justify-between">
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
                        <Button className=' hidden md:block   font-playfair  text-white  px-3 text-base' variant={'ghost'}>
                            <Link href={'/contact-us'} className='flex items-center gap-2' >
                                <Contact className="text-4xl" />
                                <span className=''>Contact Us</span>
                            </Link>
                        </Button>
                        <Button className=' hidden md:block  font-playfair  text-white  px-3 text-base' variant={'ghost'}>
                            <Link href={'/shop'} className='flex items-center gap-2' >
                                <ShoppingBag className="text-4xl" />
                                <span className=''>Shop</span>
                            </Link>
                        </Button>

                        {
                            auth?.isAuthenticated ? (
                                <Profile
                                />
                            ) : (<Button className=' hidden md:block  font-playfair  text-white  px-3 text-base' variant={'ghost'}>
                                <Link href={'/login'} className='flex items-center gap-2' >
                                    <User className="text-4xl" />
                                    <span className=''>Sign in </span>
                                </Link>
                            </Button>)
                        }

                        {
                            // hamburger menu
                        }
                        {
                            !auth?.isAuthenticated && (
                                <Button
                                    variant={'ghost'}
                                    onClick={handleMenuToggle}
                                    className='  font-playfair  text-white  px-3 text-base md:hidden' >
                                    {
                                        !isOpenMenu ? <MenuIcon className="text-5xl" /> : <X className="text-5xl" />
                                    }
                                </Button>
                            )
                        }
                        {/* <ThemeButton /> */}
                    </div>

                </div>
            </div>
            <div className={`w-full px-5 py-3 absolute  ${isOpenMenu ? 'block' : 'hidden'} md:hidden !z-50 bg-black`}>
                <ul className='flex flex-col gap-1 !z-50'>
                    <li
                        onClick={() => setIsOpenMenu(!isOpenMenu)}
                        className='flex py-2 items-center gap-2 text-white font-playfair text-base hover:text-gray-400 border-b border-gray-400 '
                    ><Link href={'/shop'}>Shop</Link></li>
                    <li
                        onClick={() => setIsOpenMenu(!isOpenMenu)}
                        className='flex py-2 items-center gap-2 text-white font-playfair text-base hover:text-gray-400 border-b border-gray-400 '
                    ><Link href={'/contact-us'}>Contact Us</Link></li>
                    {
                        auth?.isAuthenticated ? (
                            <Profile
                            />
                        ) : (<li
                            onClick={() => setIsOpenMenu(!isOpenMenu)}
                            className='flex py-2 items-center gap-2 text-white font-playfair text-base hover:text-gray-400 border-b border-gray-400 '
                        ><Link href={'/login'}>Sign In</Link></li>)
                    }
                </ul>
            </div>
            <div className={`overlay ${isOpenMenu ? 'open' : ''}`} onClick={() => setIsOpenMenu(!isOpenMenu)}></div>
        </div >
    );
};

export default Navbar;