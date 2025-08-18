import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const getPageNumbers = (current: number, total: number): (number | string)[] => {
    const delta = 2; // how many pages to show around current
    const range: (number | string)[] = [];

    const rangeWithDots = () => {
        let left = current - delta;
        let right = current + delta;
        let pages: (number | string)[] = [];

        for (let i = 1; i <= total; i++) {
            if (i === 1 || i === total || (i >= left && i <= right)) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== "...") {
                pages.push("...");
            }
        }

        return pages;
    };

    return rangeWithDots();
};

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const pages = getPageNumbers(currentPage, totalPages);

    return (
        <div className="flex justify-center items-center gap-2 mt-6 mb-6 flex-wrap">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
            >
                &lt;
            </button>

            {/* Page Numbers */}
            {pages.map((page, idx) =>
                page === "..." ? (
                    <span key={`ellipsis-${idx}`} className="px-3 py-1 text-gray-400">...</span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(Number(page))}
                        className={`px-3 py-1 rounded-md ${currentPage === page ? "bg-greenGradient text-white" : "bg-gray-200"}`}
                    >
                        {page}
                    </button>
                )
            )}

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
            >
                &gt;
            </button>
        </div>
    );
};

export default Pagination;
