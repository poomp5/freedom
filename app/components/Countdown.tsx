"use client";
import { useState, useEffect } from "react";

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export default function Countdown() {
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
    const [isCountdownOver, setIsCountdownOver] = useState(false);

    useEffect(() => {
        const SECOND = 1000;
        const MINUTE = SECOND * 60;
        const HOUR = MINUTE * 60;
        const DAY = HOUR * 24;

        const calculateTargetDate = () => {
            const today = new Date();
            const currentYear = today.getFullYear();
            const targetDate = new Date(`07/21/${currentYear}`);

            if (today > targetDate) {
                targetDate.setFullYear(currentYear + 1);
            }

            return targetDate.getTime();
        };

        const targetTimestamp = calculateTargetDate();

        const updateCountdown = (): TimeLeft | null => {
            const now = new Date().getTime();
            const distance = targetTimestamp - now;

            if (distance < 0) {
                setIsCountdownOver(true);
                return null;
            }

            return {
                days: Math.floor(distance / DAY),
                hours: Math.floor((distance % DAY) / HOUR),
                minutes: Math.floor((distance % HOUR) / MINUTE),
                seconds: Math.floor((distance % MINUTE) / SECOND)
            };
        };

        // Explicitly handle potential null return
        const initialTimeLeft = updateCountdown();
        if (initialTimeLeft !== null) {
            setTimeLeft(initialTimeLeft);
        }

        const intervalId = setInterval(() => {
            const newTimeLeft = updateCountdown();
            if (newTimeLeft === null) {
                setIsCountdownOver(true);
                clearInterval(intervalId);
            } else {
                setTimeLeft(newTimeLeft);
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const renderCountdownItem = (value: number | undefined) => {
        if (value === undefined || value === null) {
            return <span className="inline-block w-10 h-10 bg-gray-100 animate-pulse rounded"></span>;
        }
        return String(value).padStart(2, "0");
    };

    return (
        <div className="flex justify-center items-center">
            {isCountdownOver ? (
                <div className="text-center text-2xl font-bold text-green-600">
                    สอบเสร็จแล้ว!
                </div>
            ) : (
                <div className="mt-4 kanit text-gray-600 font-bold text-center max-w-screen-sm md:max-w-screen-xl">
                    <ul className="inline-flex space-x-2 md:space-x-8">
                        {[
                            { label: "DAYS", value: timeLeft?.days },
                            { label: "HOURS", value: timeLeft?.hours },
                            { label: "MINUTES", value: timeLeft?.minutes },
                            { label: "SECONDS", value: timeLeft?.seconds }
                        ].map(({ label, value }) => (
                            <li key={label} className="inline-block rounded-lg p-3">
                                <span className="text-4xl text-gray-600 countdown-span">
                                    {renderCountdownItem(value)}
                                </span>
                                <div className="mt-2 font-semibold text-gray-500">{label}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}