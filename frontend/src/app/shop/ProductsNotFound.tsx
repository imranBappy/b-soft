import React from 'react';

const ProductsNotFound = () => {
    return (
        <div className="w-full  flex   flex-col items-center justify-center py-20 px-4 text-center text-gray-600">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-20 w-20 mb-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 17v-2a4 4 0 014-4h0a4 4 0 014 4v2m-6 0v2m6-2v2m-6-4h6"
                />
            </svg>
            <h2 className="text-2xl font-semibold mb-2">No products found</h2>
            <p className="max-w-xs text-gray-500">
                Sorry, we couldn’t find any products matching your search or filter criteria. Try adjusting your filters or search terms.
            </p>
        </div>
    );
};

export default ProductsNotFound;
