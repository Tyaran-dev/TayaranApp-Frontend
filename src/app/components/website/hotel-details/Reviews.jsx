import React, { useState } from 'react';
import Button from '../../shared/Button';
import Image from 'next/image';
import { FlagIcon } from '@/app/svg';

const reviews = [
    {
        rating: 5.0,
        author: 'Omar Siphron',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
        rating: 5.0,
        author: 'Omar Siphron',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
        rating: 5.0,
        author: 'Omar Siphron',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
        rating: 5.0,
        author: 'Omar Siphron',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
        rating: 5.0,
        author: 'Omar Siphron',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
        rating: 5.0,
        author: 'Omar Siphron',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
        rating: 5.0,
        author: 'Omar Siphron',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
        rating: 5.0,
        author: 'Omar Siphron',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    // Add more reviews as needed
];

const Reviews = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 5;

    // Calculate total pages
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);

    // Get current reviews to display
    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

    // Handle page change
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="bg-[#FBFBFB] my-8 p-4">
            {/* Reviews Heading */}
            <div className="flex  w-full gap-3 items-center justify-between">
                <h1 className="lg:text-5xl md:text-4xl sm:text-3xl text-2xl font-bold">Reviews</h1>
                <Button style='bg-greenGradient' label='Give Your Review'/>
            </div>

            {/* Average Rating */}
            <div className="flex items-center mt-4 space-x-4">
                <div className="lg:text-7xl md:text-6xl sm:text-5xl text-4xl  font-bold text-orange">4.2</div>
                <div className="text-lg flex flex-col md:gap-5 sm:gap-3 gap-1">
                    <span className="block lg:text-3xl sm:text-2xl text-xl font-semibold">Very good</span>
                    <span className="">371 verified reviews</span>
                </div>
            </div>

            {/* Reviews List */}
            <div className="mt-8 space-y-8">
                {currentReviews.map((review, index) => (
                    <div key={index} className="border-t border-[#2e2e2e] pt-4">
                        <div className="flex items-start">
                            {/* <Image
                                src={img}
                                alt="avatar"
                                className="w-10 h-10 rounded-2xl mr-4"
                            /> */}
                            <div>
                                <p className=" text-sm">
                                    {review.rating} Amazing | <span className='text-gray2' >{review.author}</span>
                                </p>
                                <p className="text-gray2 mt-2">{review.text}</p>
                            </div>
                            <div className="ml-auto">
                               <FlagIcon/>
                            </div>
                        </div>
                        
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-6 items-center mt-8">
                <button
                    onClick={handlePreviousPage}
                    className={`text-gray-500 hover:text-gray-800 ${currentPage === 1 ? 'cursor-not-allowed' : ''}`}
                    disabled={currentPage === 1}
                >
                    &lt;
                </button>
                <span>
                    {currentPage} of {totalPages}
                </span>
                <button
                    onClick={handleNextPage}
                    className={`text-gray-500 hover:text-gray-800 ${currentPage === totalPages ? 'cursor-not-allowed' : ''}`}
                    disabled={currentPage === totalPages}
                >
                    &gt;
                </button>
            </div>
        </div>
    );
};

export default Reviews;
