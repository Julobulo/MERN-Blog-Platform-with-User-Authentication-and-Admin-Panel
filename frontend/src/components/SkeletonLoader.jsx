import React from "react";

const ArticleCardSkeleton = () => {
    return (
        <div className="p-6 mb-8 bg-gray-900 rounded-xl shadow-md">
            {/* Skeleton for image */}
            <div className="skeleton h-48 w-full rounded-xl mb-5"></div>

            {/* Skeleton for title */}
            <h2 className="pb-3 text-xl font-semibold tracking-tight text-white">
                <div className="skeleton h-6 w-4/5 mb-1 rounded-md"></div>
                <div className="skeleton h-6 w-3/5 rounded-md"></div>
            </h2>

            {/* Skeleton for tags (hidden on small screens) */}
            <div className="flex space-x-2 md:hidden pb-2">
                <div className="skeleton h-4 w-1/4 rounded-full"></div>
                <div className="skeleton h-4 w-1/4 rounded-full"></div>
                <div className="skeleton h-4 w-1/4 rounded-full"></div>
            </div>

            {/* Skeleton for author, date, likes */}
            <div className="flex justify-between mb-4">
                {/* Skeleton for author info */}
                <div className="font-medium text-green-400">
                    <div className="flex items-center space-x-2">
                        <div className="skeleton w-8 h-8 rounded-full"></div>
                        <div className="flex flex-col">
                            <div className="skeleton h-4 w-20 rounded-md"></div>
                            <div className="skeleton h-3 w-32 rounded-md"></div>
                        </div>
                    </div>
                </div>

                {/* Skeleton for likes */}
                <div className="flex items-center space-x-2">
                    <div className="skeleton w-5 h-5 rounded-full"></div>
                    <div className="skeleton h-4 w-6 rounded-md"></div>
                </div>
            </div>

            {/* Skeleton for subtitle */}
            <p className="mb-6 text-gray-400">
                <div className="skeleton h-4 w-full rounded-md"></div>
                <div className="skeleton h-4 w-full rounded-md"></div>
                <div className="skeleton h-4 w-full rounded-md"></div>
            </p>

            {/* Skeleton for Read more and tags (hidden on small screens) */}
            <div className="flex items-center justify-between font-medium text-green-400">
                <div className="flex items-center space-x-2">
                    <div className="skeleton h-4 w-20 rounded-md"></div>
                    <div className="skeleton h-4 w-10 rounded-md"></div>
                </div>
                <div className="flex space-x-2 max-md:hidden">
                    <div className="skeleton h-4 w-1/4 rounded-full"></div>
                    <div className="skeleton h-4 w-1/4 rounded-full"></div>
                    <div className="skeleton h-4 w-1/4 rounded-full"></div>
                </div>
            </div>
        </div>
    );
};

export default ArticleCardSkeleton;
