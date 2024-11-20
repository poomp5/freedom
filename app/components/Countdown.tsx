import { useState, useEffect } from "react";

export default function Countdown() {
    const [timeLeft, setTimeLeft] = useState({
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
    });
    const [isCountdownOver, setIsCountdownOver] = useState(false);

    useEffect(() => {
        const second = 1000,
            minute = second * 60,
            hour = minute * 60,
            day = hour * 24;

        const today = new Date();
        const dd = String(today.getDate()).padStart(2, "0");
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const yyyy = today.getFullYear();
        const nextYear = yyyy + 1;
        const dayMonth = "12/18/";
        let birthday = `${dayMonth}${yyyy}`;

        if (new Date(`${mm}/${dd}/${yyyy}`) > new Date(birthday)) {
            birthday = `${dayMonth}${nextYear}`;
        }

        const countDown = new Date(birthday).getTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = countDown - now;

            if (distance < 0) {
                setIsCountdownOver(true);
                clearInterval(interval);
            } else {
                setTimeLeft({
                    days: String(Math.floor(distance / day)).padStart(2, "0"),
                    hours: String(Math.floor((distance % day) / hour)).padStart(2, "0"),
                    minutes: String(Math.floor((distance % hour) / minute)).padStart(2, "0"),
                    seconds: String(Math.floor((distance % minute) / second)).padStart(2, "0"),
                });
            }
        }, 1000);

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    return (
        <div>
            {isCountdownOver ? (
                <div id="content">🎉 The countdown is over! 🎉</div>
            ) : (
                <div id="countdown" className="mt-0 kanit text-gray-600 font- text-center max-w-screen-sm md:max-w-screen-xl">
                <ul className="inline-flex space-x-1.5 md:space-x-6 font-bold">
                    <li className="inline-block rounded-lg p-2.5">
                    <span className="countdown-span">{timeLeft.days}</span> <span className="font-semibold text-gray-500">DAYS</span>
                    </li>
                    <li className="inline-block rounded-lg p-2.5">
                    <span className="countdown-span">{timeLeft.hours}</span> <span className="font-semibold text-gray-500">HOURS</span>
                    </li>
                    <li className="inline-block rounded-lg p-2.5">
                        <span className="countdown-span">{timeLeft.minutes}</span> <span className="font-semibold text-gray-500">MINUTIES</span>
                    </li>
                    <li className="inline-block rounded-lg p-2.5">
                        <span className="countdown-span">{timeLeft.seconds}</span> <span className="font-semibold text-gray-500">SECONDS</span>
                    </li>
                </ul>
                </div>
            )}
        </div>
    );
}
