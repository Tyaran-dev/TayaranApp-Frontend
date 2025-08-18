import { BaggageTickIcon, ExclmationIcon } from '@/app/svg';
import React from 'react';
import Section from '../../shared/section';

// Define types for the card data
type CardData = {
    id: number;
    title: string;
    price: number;
    currency: string;
    baggage: string[];
    cancel: string[];
};

const cardData: CardData[] = [
    {
        id: 1,
        title: 'SAVER',
        price: 1016,
        currency: 'SAR',
        baggage: ['7 KG Cabin baggage', 'No Checked baggage'],
        cancel: ['Non-refundable', 'Non-changeable fare'],
    },
    {
        id: 2,
        title: 'FLEXI PLUS',
        price: 3742,
        currency: 'SAR',
        baggage: ['7 KG Cabin baggage', 'No Checked baggage'],
        cancel: ['Non-refundable', 'Changeable without fees'],
    },
    {
        id: 3,
        title: 'Super 6E',
        price: 3742,
        currency: 'SAR',
        baggage: ['7 KG Cabin baggage', 'No Checked baggage'],
        cancel: ['Non-refundable', 'Changeable without fees'],
    },
];

const PriceCards: React.FC = () => {
    return (
        <Section>
            <div className="flex flex-col py-10 pb-20 items-center justify-center w-full">

                <div className='my-10 '>
                    <p className='sm:text-4xl text-2xl font-bold'>Select fare type</p>
                </div> 

                <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 lg:gap-12 gap-6 w-full">
                    {cardData.map((card) => (
                        <div key={card.id} className="bg-white p-6 rounded-3xl  w-full">
                            <p className="text-gray-500 text-end">{card.currency}</p>
                            <h3 className="font-bold text-lg text-black">{card.title}</h3>
                            <div className="flex items-center justify-end -mt-3">
                                <p className="lg:text-5xl sm:text-4xl text-3xl font-semibold">{card.price}</p>
                            </div>

                            <hr className="my-4 border-t-2 border-dashed border-[#CCCCCC]" />

                            <div className="space-y-2">
                                <p className="font-bold sm:text-2xl text-xl mb-3">Baggage allowance</p>
                                {card.baggage.map((item, index) => (
                                    <p key={index} className="flex sm:text-xl gap-3 items-center text-[#0C111F99]">
                                        <div className='flex-shrink-0'>
                                            <BaggageTickIcon />
                                        </div>
                                        {item}
                                    </p>
                                ))}
                                <div className='flex items-center justify-between w-full'>
                                    <p className="font-bold sm:text-2xl text-xl ">Cancel & date change</p>
                                    <ExclmationIcon />
                                </div>
                                {card.cancel.map((item, index) => (
                                    <p key={index} className="flex sm:text-xl gap-3 items-center text-[#0C111F99]">
                                        <div className='flex-shrink-0'>
                                            <BaggageTickIcon />
                                        </div>
                                        {item}
                                    </p>
                                ))}
                            </div>

                            <button className="mt-10 w-full bg-greenGradient text-white p-3 rounded-2xl">
                                Select
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    );
};

export default PriceCards;
