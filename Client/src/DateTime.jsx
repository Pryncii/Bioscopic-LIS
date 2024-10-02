import React, { useState, useEffect } from 'react';

function DateTime() {

    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(interval); // Clean up the interval on component unmount
    }, []);

    const h = formatTime(time.getHours() % 12 || 12);
    const m = formatTime(time.getMinutes());
    const s = formatTime(time.getSeconds());
    const ampm = time.getHours() >= 12 ? 'PM' : 'AM';
    const day = formatTime(time.getDate());
    const month = formatTime(time.getMonth() + 1);
    const year = time.getFullYear();
    const weekday = time.getDay();

    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const formattedDateTime = `${weekdays[weekday]}, ${month}/${day}/${year} ${h}:${m}:${s} ${ampm}`;

    function formatTime(i) {
        return i < 10 ? "0" + i : i;
    }

    return (
        <h2 className='_title'>{formattedDateTime}</h2>
    );
}
  
export default DateTime