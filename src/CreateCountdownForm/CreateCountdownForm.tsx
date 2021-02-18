import React from "react";
import { v4 as uuid } from "uuid";
import Countdown from "../Countdown";

export default function CreateCountdownForm(props: {
    onNewCountdown: (countdown: Countdown) => void,
}) {
    function handleClick() {
        const countdown: Countdown = {
            uuid: uuid(),
            name: window.prompt("Enter new countdown name") || "Untitled countdown",
            date: new Date(window.prompt("Enter new countdown date in ISO format") || 0),
        };
        props.onNewCountdown(countdown);
    }

    return (
        <button
            className="new-countdown-button"
            onClick={handleClick}
        >
            +
        </button>
    );
}
