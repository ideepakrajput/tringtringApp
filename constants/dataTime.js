export function formatDateToDDMMYYYY(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDay().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}

export function ordinalDateFormat(timestamp) {
    function addOrdinalSuffix(day) {
        if (day > 3 && day < 21) return day + 'th';
        switch (day % 10) {
            case 1: return day + 'st';
            case 2: return day + 'nd';
            case 3: return day + 'rd';
            default: return day + 'th';
        }
    }

    const dayWithOrdinal = addOrdinalSuffix(timestamp.getDate());

    // Array of month names
    const monthNames = [
        'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
        'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
    ];

    // Format the date as "26th August, 2023"
    const formattedDate = `${dayWithOrdinal} ${monthNames[timestamp.getMonth()]}, ${timestamp.getFullYear()}`;

    return formattedDate;
}