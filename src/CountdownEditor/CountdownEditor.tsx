import React from "react";
import dateFormat from "date-fns/format";
import { CountdownInfo } from "../Countdown";
import "./CountdownEditor.css";

const TIME_DAY = 8.64e7;
const TIME_MINUTE = 60000;

export default function CountdownEditor(props: {
    initialCountdownInfo: CountdownInfo, // the countdown to use to pre-populate the form
    onSubmit: (countdownInfo: CountdownInfo) => void,
    headingText: string,
    submitButtonText: string,
}) {
    const [countdownInfo, setCountdownInfo] = React.useState(Object.assign({}, props.initialCountdownInfo));
    
    function handleSubmit() {
        props.onSubmit(countdownInfo);
    }

    function handleNameInput(e: React.ChangeEvent<HTMLInputElement>) {
        setCountdownInfo(Object.assign({}, countdownInfo, {
            name: e.target.value,
        }));
    }

    function handleDateInput(e: React.ChangeEvent<HTMLInputElement>) {
        setCountdownInfo(Object.assign({}, countdownInfo, {
            date: new Date(e.target.valueAsNumber + dateGetTimePart(countdownInfo.date)),
        }));
    }

    function handleTimeInput(e: React.ChangeEvent<HTMLInputElement>) {
        setCountdownInfo(Object.assign({}, countdownInfo, {
            date: new Date(
                e.target.valueAsNumber
                + (e.target.valueAsDate as Date).getTimezoneOffset() * TIME_MINUTE
                + dateGetDatePart(countdownInfo.date)
            ),
        }));
    }

    return (
        <div className="CountdownEditor">
            <h2>{props.headingText}</h2>
            
            <label>
                <span>Name</span>
                <input
                    id="ccf-input-name"
                    type="text"
                    defaultValue={props.initialCountdownInfo.name}
                    onChange={handleNameInput}
                />
            </label>

            <label>
                <span>Date</span>
                <input
                    id="ccf-input-date"
                    type="date"
                    defaultValue={dateFormat(props.initialCountdownInfo.date, "yyyy-MM-dd")}
                    onChange={handleDateInput}
                />
            </label>

            <label>
                <span>Time</span>
                <input
                    id="ccf-input-time"
                    type="time"
                    defaultValue={dateFormat(props.initialCountdownInfo.date, "HH:mm")}
                    onChange={handleTimeInput}
                />
            </label>

            <button onClick={handleSubmit}>{props.submitButtonText}</button>
        </div>
    );
}

CountdownEditor.defaultProps = {
    headingText: "Edit countdown",
    submitButtonText: "Save",
    initialCountdownInfo: {
        name: "Untitled countdown",
        date: new Date(),
    }
};

/**
 * Given a date, return the time part in milliseconds.
 */
function dateGetTimePart(date: Date) {
    return date.getTime() % TIME_DAY;
}

/**
 * Given a date, return the date part in milliseconds.
 */
function dateGetDatePart(date: Date) {
    return Math.floor(date.getTime() / TIME_DAY) * TIME_DAY;
}
