import React from "react";
import findFirst from "../findFirst";
import "./CountdownCounter.css";

const TIME_DAY = 8.64e7;
const TIME_HOUR = 3.6e6;
const TIME_MINUTE = 60000;
const TIME_SECOND = 1000;

interface CountdownCounterProps {
    name: string,
    date: Date,
}

interface CountdownCounterState {
    timeRemaining: number,
}

export default class CountdownCounter extends React.Component<CountdownCounterProps, CountdownCounterState> {
    constructor(props: CountdownCounterProps) {
        super(props);

        this.state = {
            timeRemaining: props.date.getTime() - Date.now(),
        }
    }

    componentDidMount() {
        this.tick();
        this.scheduleTick();
    }

    render() {
        return (
            <div className={this.constructor.name}>
                <div className={this.constructor.name + "-name"}>{this.props.name}</div>
                <div className={this.constructor.name + "-counter"}>{this.formatDuration(this.state.timeRemaining)}</div>
            </div>
        );
    }

    scheduleTick() {
        const now = Date.now();
        const endOfSecond = Math.floor(now / 1000) * 1000 + 1000;
        setTimeout(() => {
            this.tick();
            this.scheduleTick();
        }, endOfSecond - now);
    }

    tick() {
        this.setState({ timeRemaining: this.props.date.getTime() - Date.now() });
    }

    formatDuration(duration: number) {
        const d = Math.floor(duration / TIME_DAY);
        const h = Math.floor(duration % TIME_DAY / TIME_HOUR);
        const m = Math.floor(duration % TIME_HOUR / TIME_MINUTE);
        const s = Math.ceil(duration % TIME_MINUTE / TIME_SECOND);

        const partNames = ["d", "h", "m", "s"];
        const parts = [d, h, m, s];
        const [, firstSignificantPartIdx] = findFirst(parts, n => n !== 0);
        return parts.map((n, idx) => idx >= firstSignificantPartIdx ? n + partNames[idx] : "").join(" ");
    }
}