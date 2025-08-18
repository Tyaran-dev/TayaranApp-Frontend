import { CrossIcon } from '@/app/svg';
import React from 'react';
import Heading from '../../shared/heading';
import CustomSelect from '../../shared/customSelect';
import CardCustomSelect from './AddCardSelector';
import AddCardInput from './AddCardInput';

interface AddCardModalProps {
    onClose: () => void;
    cardNumber: string;
    expiryDate: string;
    cvc: string;
    name: string;
    country: string;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCountrySelect: (country: string) => void;
}

const AddNewCard: React.FC<AddCardModalProps> = ({
    onClose,
    cardNumber,
    expiryDate,
    cvc,
    name,
    country,
    onInputChange,
    onCountrySelect,
}) => {
    const countryOptions = [
        { label: 'United States', value: 'United States' },
        { label: 'Pakistan', value: 'Pakistan' },
        { label: 'India', value: 'India' },
        { label: 'New Zealand', value: 'New Zealand' },
    ];

    return (
        <div className="bg-white rounded-lg p-6 w-[50%] overflow-auto h-[90vh] px-12">

            <div className='flex justify-end w-full'>
                <div onClick={onClose} className='cursor-pointer'>
                    <CrossIcon />
                </div>
            </div>

            <h2 className="lg:text-[40px] md:text-4xl text-3xl font-semibold text-center mb-4">Add a new Card</h2>

            {/* Card Input Fields */}
            <div className="space-y-6 my-10">

                <div className='w-full'>
                    <AddCardInput
                        type="text"
                        name="cardNumber"
                        placeholder="4321 4321 4321 4321"
                        label="Card Number"
                        value={cardNumber}
                        onChange={onInputChange}
                    />
                </div>
                <div className='w-full flex items-center justify-between gap-4'>
                    <div className='w-1/2'>
                        <AddCardInput
                            type="text"
                            name="expiryDate"
                            placeholder="01/10"
                            label="Exp. Date"
                            value={expiryDate}
                            onChange={onInputChange}
                        />
                    </div>
                    <div className='w-1/2'>
                        <AddCardInput
                            type="text"
                            name="cvc"
                            placeholder="123"
                            label="CVC"
                            value={cvc}
                            onChange={onInputChange}
                        />
                    </div>
                </div>

                <div className='w-full'>
                    <AddCardInput
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        label="Name on Card"
                        value={name}
                        onChange={onInputChange}
                    />
                </div>

                <div className='w-full relative'>
                    <CardCustomSelect
                        placeholder='United States'
                        value={country}
                        onSelect={onCountrySelect}
                        options={countryOptions}
                        style={'py-2.5'}
                    />
                    <span className='absolute -top-4 text-sm left-4 bg-white px-1.5 py-0.5'>Country or Region</span>
                </div>

                <div className='flex items-center gap-2'>
                    <input
                        type="checkbox"
                        className='h-5 w-5'
                    />
                    <p className='font-medium'>Securely save my information for 1-click checkout</p>
                </div>
            </div>

            {/* Action Buttons */}
            <button className="px-4 py-2 bg-greenGradient text-white rounded-2xl  w-full">
                Add Card
            </button>

            <p className='text-[#112211] text-center text-xs my-4'>By confirming your subscription, you allow The Outdoor Inn Crowd Limited to charge your card for this payment and future payments in accordance with their terms. You can always cancel your subscription.</p>
        </div>
    );
};

export default AddNewCard;
