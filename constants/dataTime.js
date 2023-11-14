export function formatDateToDDMMYYYY(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}

export function formatTimestampToTimeDate(timestamp) {
    const date = new Date(timestamp);

    // Get the time in HH:MM AM/PM format
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`;

    // Get the date in DD:MM:YYYY format
    const day = date.getDate();
    const month = date.getMonth() + 1; // Month is zero-based
    const year = date.getFullYear();
    const dateString = `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;

    // Combine time and date
    return `${dateString} ${timeString}`;
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
export function ordinalDate(timestamp) {
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
    const capitalizedMonths = monthNames.map(month => month.charAt(0) + month.slice(1).toLowerCase());

    // Format the date as "26th August, 2023"
    const formattedDate = `${dayWithOrdinal} ${capitalizedMonths[timestamp.getMonth()]}`;

    return formattedDate;
}