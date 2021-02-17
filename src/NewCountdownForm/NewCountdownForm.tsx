import React from "react";
import Countdown from "../Countdown";

export default function NewCountdownForm(props: {
    onNewCountdown: (countdown: Countdown) => void,
}) {
    function handleClick() {
        const countdown: Countdown = {
            name: window.prompt("Enter new countdown name") ?? "Untitled countdown",
            date: new Date(window.prompt("Enter new countdown date in ISO format") ?? ""),
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
