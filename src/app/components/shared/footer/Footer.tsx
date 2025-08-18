import React from 'react'
import logo from '@/../public/assets/icons/footer-logo.svg'
import fb from '@/../public/assets/icons/facebook.svg'
import twitter from '@/../public/assets/icons/twitter.svg'
import youtube from '@/../public/assets/icons/youtube.svg'
import tiktok from '@/../public/assets/icons/tik_tok.svg'
import linkedin from '@/../public/assets/icons/linkedin.svg'
import insta from '@/../public/assets/icons/instagram.svg'
import Image from 'next/image'
import Section from '../section'
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';

const Footer = () => {
  const t = useTranslations('footer');
    const Abouts = [
        { src: '#', label: "Promo" },
        { src: '#', label: "Help" },
        { src: '#', label: "Order" },
        { src: '#', label: "Contact" },
        { src: '#', label: "FAQ" },
    ]
    const Resources = [
        { src: '#', label: "Documentation" },
        { src: '#', label: "Carrier" },
        { src: '#', label: "Work With Us" },
        { src: '#', label: "Blog & News" },
        { src: '#', label: "Affiliate" },
    ]
    const Legal = [
        { src: '#', label: "Terms and Condition" },
        { src: '#', label: "Privacy Policy" },
        { src: '#', label: "Cookies Policy" },
        { src: '#', label: "Developers" },
    ]
    const Social = [
        { src: '#', img: fb },
        { src: '#', img: twitter },
        { src: '#', img: linkedin },
        { src: '#', img: youtube },
        { src: '#', img: insta },
        { src: '#', img: tiktok },
    ]

    return (
        <div className='bg-footerBanner bg-no-repeat bg-cover pt-16 pb-6'>
            <Section>
                <div className=' grid lg:grid-cols-7 sm:grid-cols-5  grid-cols-1 gap-16 bg-cover bg-no-repeat h-full w-full'>
                    <div className='flex flex-col sm:col-span-2 items-start gap-4'>
                        <Image alt='' src={logo} />
                        <p className='text-lightGray font-thin'>
                            In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document
                        </p>
                    </div>
                    <div className='col-span-1 flex flex-col gap-2' >
                        <p className='text-white font-medium'>About Us</p>
                        {
                            Abouts.map((e, i) => (
                                <Link key={i} href={e.src} className='text-lightGray hover:text-white font-thin ' >{e.label}</Link>
                            ))
                        }
                    </div>
                    <div className='col-span-1 flex flex-col gap-2' >
                        <p className='text-white font-medium'>Resources</p>
                        {
                            Resources.map((e, i) => (
                                <Link key={i} href={e.src} className='text-lightGray hover:text-white font-thin' >{e.label}</Link>
                            ))
                        }
                    </div>
                    <div className='col-span-1 flex flex-col gap-2' >
                        <p className='text-white font-medium'>Legal</p>
                        {
                            Legal.map((e, i) => (
                                <Link key={i} href={e.src} className='text-lightGray hover:text-white font-thin ' >{e.label}</Link>
                            ))
                        }
                    </div>
                    <div className='lg:col-span-2 sm:col-span-5 flex lg:flex-col sm:flex-row flex-col lg:justify-normal justify-between w-fit items-end ' >
                        <div className='flex flex-col items-end'>
                            <p className='text-white font-medium'>Contact Us</p>
                            <p className='text-lightGray font-thin'>Fake@gmail.com</p>
                            <p className='text-lightGray font-thin'>+12 345 678 09</p>
                            <p className='text-lightGray font-thin'>Saudi Arabia</p>
                        </div>
                        <div className='flex flex-col gap-3 items-end mt-4'>
                            <h1 className='font-medium text-lg text-white'>Follow Us On Social</h1>
                            <div className='grid grid-cols-3 gap-x-8 gap-y-4' >
                                {
                                    Social.map((e, i) => (
                                        <Link key={i} href={e.src} className='' >
                                            <Image alt='' src={e.img} />
                                        </Link>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-span-7 my-8 bg-white h-[1px] w-full ' ></div>
                <div className='col-span-7 text-center sm:text-lg text-white' >© 2024  All rights reserved.</div>
            </Section>
        </div>
    )
}

export default Footer
