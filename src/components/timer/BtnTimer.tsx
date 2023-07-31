import "./btnDown.scss"
import { useState, useEffect } from 'react';

type TimeNumber = {
    deadLine ? :number,
};
export default function BtnTimer({ deadLine }: TimeNumber) {
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {

        let myInterval = setInterval(() => {
            const currentDate: any = Date.now()/1000;
            const diff = deadLine - currentDate;
            const dayNum = diff > 0 ? Math.floor(diff  / 60 / 60 / 24) : 0;
            const hourNum = diff > 0 ? Math.floor(diff  / 60 / 60) % 24 : 0;
            const minNum = diff > 0 ? Math.floor(diff  / 60) % 60 : 0;
            const secNum = diff > 0 ? Math.floor(diff ) % 60 : 0;

            if (currentDate < deadLine) {
                setDays(dayNum);
                setHours(hourNum);
                setMinutes(minNum);
                setSeconds(secNum);
            }
            else{
            }

        }, 0)
        return () => {
            clearInterval(myInterval);
        };

    }, [deadLine]);

    return (
        <div className="btntimer">
            <span>
                {days < 10 ? `0${days}` : days} Days {hours < 10 ? `0${hours}` : hours} : {minutes < 10 ? `0${minutes}` : minutes} : {seconds < 10 ? `0${seconds}` : seconds}
            </span>
        </div>
    )
}