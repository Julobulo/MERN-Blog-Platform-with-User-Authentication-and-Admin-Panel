import React from "react";
import { differenceInYears, formatDistanceToNow } from "date-fns";


const formatDate = (date) => {
    const parsedDate = new Date(date);
    const yearsDifference = differenceInYears(new Date(), parsedDate);

    if (yearsDifference >= 1) {
        return format(parsedDate, 'MMMM d, yyyy'); // Display exact date
    } else {
        return formatDistanceToNow(parsedDate, { addSuffix: true }); // Relative date
    }
};

export default formatDate;