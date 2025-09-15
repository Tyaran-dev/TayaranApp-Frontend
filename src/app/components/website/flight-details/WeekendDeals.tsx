import { BaggageTickIcon, ExclmationIcon } from '@/app/svg';
import React from 'react';
import Section from '../../shared/section';
import h1 from '@/../public/assets/hotels/hd3.png'
import Image from 'next/image';

// Define types for the card data
type CardData = {
    id: number;
    img: any; // You can replace `any` with the specific type, e.g., string if using URLs or a specific image type.
    city: string;
    title: String,
    rating: number;
    reviews: number;
    experience: string;
    price: number;
    time: string;
    total: string;
    taxes: string;
};

// Sample card data
const cardData: CardData[] = [
    {
        id: 1,
        img: h1, // Ensure `h1` is properly imported or defined as a valid image source
        title: 'Cairo',
        city: 'London',
        rating: 9.2,
        reviews: 769,
        experience: 'Wonderful',
        price: 148.25,
        time: 'Per night',
        total: 'SAR 2,542 total',
        taxes: 'Include taxes & fees',
    },
    {
        id: 2,
        img: h1,
        title: 'Cairo',
        city: 'London',
        rating: 9.2,
        reviews: 769,
        experience: 'Wonderful',
        price: 148.25,
        time: 'Per night',
        total: 'SAR 2,542 total',
        taxes: 'Include taxes & fees',
    },
    {
        id: 3,
        img: h1,
        title: 'Cairo',
        city: 'London',
        rating: 9.2,
        reviews: 769,
        experience: 'Wonderful',
        price: 148.25,
        time: 'Per night',
        total: 'SAR 2,542 total',
        taxes: 'Include taxes & fees',
    },
    {
        id: 4,
        img: h1,
        title: 'Cairo',
        city: 'London',
        rating: 9.2,
        reviews: 769,
        experience: 'Wonderful',
        price: 148.25,
        time: 'Per night',
        total: 'SAR 2,542 total',
        taxes: 'Include taxes & fees',
    },
];


const WeekendDeals: React.FC = () => {
    return (
        <Section>
            <div className="flex flex-col py-10 pb-20 items-center justify-center w-full">

                <div className='my-10 '>
                    <p className='sm:text-4xl text-2xl font-bold'>Select fare type</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-5  w-full">
                    {cardData.map((card) => (
                        <div key={card.id} className="bg-white p-3 flex flex-col gap-2 rounded-2xl border shadow-lg  border-[#D2D2D2] w-full">
                            <div>
                                <Image alt='' src={card.img} className='h-56 w-full object-cover rounded-xl' />
                            </div>
                            <p className="text-gray-500 ">{card.city}</p>
                            <h3 className="font-bold lg:text-4xl md:text-3xl text-2xl text-black">{card.title}</h3>
                                <div className='flex items-start gap-2'>
                                    <div className='bg-green rounded-2xl text-white px-4 py-0.5 text-sm' >{card.rating}</div>
                                    <p className='text-lg font-medium'>{card.experience}</p>
                                    <p>({card.reviews} reviews)</p>
                                </div>
                            <h1 className="lg:text-3xl sm:text-2xl text-xl font-bold">${card.price}</h1>
                            <div className='flex flex-col items-start'>
                                <p className='text-gray2' >{card.time}</p>
                                <p className='text-gray2' >{card.total}</p>
                                <p className='text-gray2' >{card.taxes}</p>
                            </div>
                            <button className='bg-orange text-white px-4 py-2 rounded-2xl' >Member Price Available</button>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    );
};

export default WeekendDeals;
