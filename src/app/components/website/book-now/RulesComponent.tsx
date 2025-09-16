'use client'
import React, { useState } from 'react'
import MidHeading from '../../shared/MidHeading'
import { RulesTickIcon } from '@/app/svg'
import paypalCard from '@/../public/assets/images/paypalCard.png'
import visaCard from '@/../public/assets/images/visaCard.png'
import expressCard from '@/../public/assets/images/expressCard.png'
import masterCard from '@/../public/assets/images/masterCard.png'
import Image from 'next/image'
import MyFatoorahIframe from '../../payment/MyFatoorahIframe'
import { useSelector } from 'react-redux'

const RulesComponent = ({ flightData }: any) => {
    const [loading, setLoading] = useState(false);
    const presentageCommission = useSelector((state: any) => state.flightData.presentageCommission || 5);

    const rules = [
        { name: 'If you cancel, you will get a partial amount as credit with the airline' },
        { name: 'Changeable with fees' },
    ]

    const Cards = [
        { img: paypalCard },
        { img: visaCard },
        { img: expressCard },
        { img: masterCard },
    ]

    // ✅ Convert safely to numbers
    const baseFare = Number(flightData?.price.base || 0);
    const totalFare = Number(flightData?.price.total || 0);
    const taxes = totalFare - baseFare;
    const commission = (totalFare * presentageCommission) / 100;
    const finalPrice = totalFare + commission;

    return (
        <div>
            <div className="bg-white text-grayDark p-4 border rounded-xl shadow-md border-bordered">
                {/* Fare Rules */}
                <div className='flex w-full items-center justify-between'>
                    <MidHeading><span className='text-black'>Fare rules</span></MidHeading>
                    <p className='text-sm'>Cancel & change</p>
                </div>
                <div className='mt-4 flex flex-col gap-2'>
                    {rules.map((e, i) => (
                        <div key={i} className='flex items-start gap-2 text-sm text-grayDark'>
                            <div className='mt-1'>
                                <RulesTickIcon />
                            </div>
                            <p>{e.name}</p>
                        </div>
                    ))}
                </div>

                <div className='my-5 border-b-2 border-[#999999] border-dashed w-full'></div>

                {/* Price Breakdown */}
                <MidHeading><span className='text-black'>Price breakdown</span></MidHeading>
                <div className='flex flex-col gap-2 mt-3'>
                    <div className='flex w-full justify-between items-center'>
                        <p>Base Fare</p>
                        <p>{flightData?.price.currency} {baseFare.toFixed(2)}</p>
                    </div>
                    <div className='flex w-full justify-between items-center'>
                        <p>Taxes & Fees</p>
                        <p>{flightData?.price.currency} {taxes.toFixed(2)}</p>
                    </div>
                    <div className='flex w-full justify-between items-center'>
                        <p>Administration Fees </p>
                        <p>{flightData?.price.currency} {commission.toFixed(2)}</p>
                    </div>
                </div>

                <div className='my-5 border-b-2 border-[#999999] border-dashed w-full'></div>

                {/* Final Price */}
                <div className='flex w-full justify-between items-center font-semibold text-lg'>
                    <h1>Total (incl. commission)</h1>
                    <h1>{flightData?.price.currency} {finalPrice.toFixed(2)}</h1>
                </div>

                {/* Payment */}
                <MyFatoorahIframe amount={finalPrice} />
            </div>

            {/* Cards */}
            <div className='grid grid-cols-4 my-4 gap-3'>
                {Cards.map((e, i) => (
                    <Image alt='' src={e.img} key={i} />
                ))}
            </div>
        </div>
    )
}

export default RulesComponent
