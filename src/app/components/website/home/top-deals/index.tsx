'use client';
import React from 'react';
import { StaticImageData } from 'next/image';
import bg from '/public/assets/hotels/Travel.png';
import Section from '@/app/components/shared/section';
import ParaHeading from '@/app/components/shared/para-heading';
import DealCard from './deal-card';

type Props = { 
    t: (key: string) => string;
}

const hotels = [
    {
        image: '/assets/hotels/d1.png',
        title: 'Cairo',
        arTitle: "القاهرة",
        location: 'London',
        arLocation: "لندن",
        price: 148.25,
        guests: '4-6 guests',
        arGuests: "4-6 نزيل",
        rating: 9.0,
        reviews: 'Wonderful (769 reviews)',
        arReviwes: "رائع (769 تقييمًا)",
        nights: 'SAR 2,542 total',
        arNights: "إجمالي 2,542 ريال سعودي",
        discount: 20, // Optional field
    },
    {
        image: '/assets/hotels/d1.png',
        title: 'Cairo',
        arTitle: "القاهرة",
        location: 'London',
        arLocation: "لندن",
        price: 148.25,
        guests: '4-6 guests',
        arGuests: "4-6 نزيل",
        rating: 9.0,
        reviews: 'Wonderful (769 reviews)',
        arReviwes: "رائع (769 تقييمًا)",
        nights: 'SAR 2,542 total',
        arNights: "إجمالي 2,542 ريال سعودي",
        discount: 20, // Optional field
    },
    {
        image: '/assets/hotels/d1.png',
        title: 'Cairo',
        arTitle: "القاهرة",
        location: 'London',
        arLocation: "لندن",
        price: 148.25,
        guests: '4-6 guests',
        arGuests: "4-6 نزيل",
        rating: 9.0,
        reviews: 'Wonderful (769 reviews)',
        arReviwes: "رائع (769 تقييمًا)",
        nights: 'SAR 2,542 total',
        arNights: "إجمالي 2,542 ريال سعودي",
        discount: 20, // Optional field
    },
    {
        image: '/assets/hotels/d1.png',
        title: 'Cairo',
        arTitle: "القاهرة",
        location: 'London',
        arLocation: "لندن",
        price: 148.25,
        guests: '4-6 guests',
        arGuests: "4-6 نزيل",
        rating: 9.0,
        reviews: 'Wonderful (769 reviews)',
        arReviwes: "رائع (769 تقييمًا)",
        nights: 'SAR 2,542 total',
        arNights: "إجمالي 2,542 ريال سعودي",
        discount: 20, // Optional field
    },
    // Add more hotel data here...
];

export default function TopDeals(props: Props)  {
    const {t} = props;

    return (
        <div
            className="min-w-full flex items-center bg-contain bg--top-center bg-no-repeat"
            style={{ backgroundImage: `url(${(bg as StaticImageData).src})` }}
        >
            <Section>
                <div className="lg:py-20 py-10 space-y-6">
                    <ParaHeading className="text-center !text-black">
                        {t("weekendDeals.heading")}
                    </ParaHeading>

                    <div data-aos="zoom-in-up" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {hotels.map((hotel, index) => (
                            <DealCard key={index} {...hotel} t={t}/>
                        ))}
                    </div>
                </div>

            </Section>
        </div>
    );
};
