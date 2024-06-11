import React from "react";
import { formatDistanceToNow, differenceInYears, format } from 'date-fns';

const ArticleCard = ({ title, subtitle, href, author, date, tags, imgSrc, hearts }) => {
    const formatDate = (date) => {
        const parsedDate = new Date(date);
        const yearsDifference = differenceInYears(new Date(), parsedDate);

        if (yearsDifference >= 1) {
            return format(parsedDate, 'MMMM d, yyyy'); // Display exact date
        } else {
            return formatDistanceToNow(parsedDate, { addSuffix: true }); // Relative date
        }
    };
    return (
        <div className="p-6 mb-8 bg-gray-900 rounded-xl shadow-md">
            <a href={href}>
                <img
                    alt={title}
                    src={imgSrc}
                    className="mb-5 h-48 w-full rounded-xl bg-no-repeat object-cover object-center transition-transform duration-200 ease-out hover:scale-[1.02]"
                />
            </a>
            <h2 className="pb-3 text-xl font-semibold tracking-tight text-white">
                <a href={href}>{title}</a>
            </h2>
            <div className="flex space-x-2 md:hidden pb-2">
                {tags.map(tag => (
                    <div key={tag} className="flex rounded-full border border-gray-700 bg-gray-800 px-3 py-1 badge">
                        {<span className="text-xs uppercase leading-none text-green-400 text-center my-auto">{tag}</span>}
                    </div>
                ))}
            </div>
            <div className="flex justify-between mb-4">
                <a href={`/author/${author}`} className="font-medium text-green-400">
                    <div className="flex items-center space-x-2">
                        <img
                            alt={author}
                            src="https://via.placeholder.com/32"
                            className="w-8 h-8 rounded-full"
                        />
                        <div className="flex flex-col">
                            <span>{author}</span>
                            <span className="text-sm text-gray-400">{formatDate(date)}</span>
                        </div>
                    </div>
                </a>
                <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.344l1.172-1.172a4 4 0 015.656 5.656l-1.172 1.172L10 17.828l-5.656-5.656L3.172 10.83a4 4 0 010-5.656zM10 16.172l4.656-4.656a2 2 0 10-2.828-2.828L10 9.344l-1.828-1.828a2 2 0 00-2.828 2.828L10 16.172z" clipRule="evenodd" />
                    </svg>
                    <span className='text-red-500'>{hearts}</span>
                </div>
            </div>
            <p className="mb-6 text-gray-400">{subtitle}</p>
            <div className="flex items-center justify-between font-medium text-green-400">
                <a href={href} className="flex items-center space-x-2">
                    <span>Read more</span>
                    <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-inherit">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12.2929 0.292905C12.6834 -0.097635 13.3166 -0.097635 13.7071 0.292905L21.7072 8.2929C22.0976 8.68342 22.0976 9.31658 21.7072 9.7071L13.7071 17.7072C13.3166 18.0976 12.6834 18.0976 12.2929 17.7072C11.9024 17.3166 11.9024 16.6834 12.2929 16.2928L18.5858 10H1C0.44772 10 0 9.55228 0 9C0 8.44772 0.44772 8 1 8H18.5858L12.2929 1.7071C11.9024 1.31658 11.9024 0.683425 12.2929 0.292905Z" fill="currentColor"></path>
                    </svg>
                </a>
                <div className="flex space-x-2 max-md:hidden">
                    {tags.map(tag => (
                        <div key={tag} className="flex rounded-full border border-gray-700 bg-gray-800 px-3 py-1 badge">
                            {<span className="text-xs uppercase leading-none text-green-400 text-center my-auto">{tag}</span>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ArticleCard