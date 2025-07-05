"use client"
import Image from 'next/image';
import React from 'react';
import Logo from '@/assets/logo.png'
import { Phone, MapPinHouse, Mail, Facebook, Youtube, Instagram } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { SETTING_QUERY } from '@/graphql/setting';

const Footer = () => {
    const { data } = useQuery(SETTING_QUERY, {
        variables: {
            id: 1,
        },
    });
    const year = new Date().getFullYear()

    return (
        <footer className=' bg-gray-light  dark:bg-gray-deep   mt-10 border-t'>
            <div className="container md:px-0 px-5">
                <div className='py-5 flex flex-wrap justify-between gap-5'>
                    <div>
                        <Image src={Logo} alt='B Soft' width={100} height={100} />
                        <ul className=' mt-5'>
                            <li className='flex  gap-1 items-center'>
                                <Phone size={15} />
                                <Button variant={'link'} className=' px-1  font-playfair text-gray dark:text-gray-light'>
                                    <a href={
                                        `tel:${data?.websiteinfo?.phone}`
                                    }>  {
                                            data?.websiteinfo?.phone
                                        } </a>
                                </Button>

                            </li>
                            <li className='flex  gap-1 items-center'>
                                <MapPinHouse size={15} />
                                <Button variant={'link'} className=' px-1  font-playfair text-gray dark:text-gray-light '>
                                    {
                                        data?.websiteinfo?.location
                                    }
                                </Button>
                            </li>
                            <li className='flex  gap-1 items-center'>
                                <Mail size={15} />
                                <Button variant={'link'} className=' px-1  font-playfair text-gray dark:text-gray-light'>
                                    <a
                                        href={`mailto:${data?.websiteinfo?.email}`}
                                    >
                                        {
                                            data?.websiteinfo?.email
                                        }
                                    </a>
                                </Button>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className=' font-playfair font-semibold  text-lg mt-5'>User Area</h4>
                        <ul className=' mt-2'>
                            <li className='flex  gap-1 items-center'>
                                <Button variant={'link'} className=' px-1  font-playfair text-gray dark:text-gray-light'>
                                    <Link href={"/shop"}>  All Products   </Link>
                                </Button>

                            </li>
                            <li className='flex  gap-1 items-center'>
                                <Button variant={'link'} className=' px-1  font-playfair text-gray dark:text-gray-light'>
                                    <Link href={"/customer/profile"}>  My Account  </Link>
                                </Button>
                            </li>
                            <li className='flex  gap-1 items-center'>
                                <Button variant={'link'} className=' px-1  font-playfair text-gray dark:text-gray-light'>
                                    <Link href={"/softwares"}>  Download Center  </Link>
                                </Button>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className=' font-playfair font-semibold  text-lg mt-5'>Useful Links</h4>
                        <ul className=' mt-2'>
                            <li className='flex  gap-1 items-center'>
                                <Button variant={'link'} className=' px-1  font-playfair text-gray dark:text-gray-light'>
                                    <Link href={"/contact-us"}> Contact Us   </Link>
                                </Button>

                            </li>
                            <li className='flex  gap-1 items-center'>
                                <Button variant={'link'} className=' px-1  font-playfair text-gray dark:text-gray-light'>
                                    <Link href={"/privicy"}> Privicy Policy   </Link>
                                </Button>
                            </li>
                            <li className='flex  gap-1 items-center'>
                                <Button variant={'link'} className=' px-1  font-playfair text-gray dark:text-gray-light'>
                                    <Link href={"/terms"}>  Terms and Conditions </Link>
                                </Button>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
            <div className='border-t min-h-16'>
                <div className='container md:px-0 px-5 py-4 min-h-16 flex items-center justify-between flex-wrap gap-2'>
                    <p className='  text-gray dark:text-gray-light font-lato '  >© {year} Bsoft. All rights reserved.</p>
                    <div className='flex gap-2 items-center'>
                        <Link href={
                            data?.websiteinfo?.facebook || '#'
                        }>
                            <Button size={'icon'} variant={'ghost'} >
                                <Facebook />
                            </Button>
                        </Link>
                        <Link href={
                            data?.websiteinfo?.instagram || '#'
                        }>
                            <Button size={'icon'} variant={'ghost'} >
                                <Instagram />
                            </Button>
                        </Link>

                        <Link href={
                            data?.websiteinfo?.youtube || '#'
                        }>
                            <Button size={'icon'} variant={'ghost'} >
                                <Youtube />
                            </Button>
                        </Link>

                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;