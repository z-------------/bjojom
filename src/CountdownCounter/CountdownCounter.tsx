import React from "react";
import dateFormat from "date-fns/format";
import Countdown from "../Countdown";
import findFirst from "../findFirst";
import "./CountdownCounter.css";

const TIME_DAY = 8.64e7;
const TIME_HOUR = 3.6e6;
const TIME_MINUTE = 60000;
const TIME_SECOND = 1000;

interface CountdownCounterProps {
    countdown: Countdown,
    onRemove: (countdown: Countdown) => void,
    onEdit: (countdown: Countdown) => void,
}

interface CountdownCounterState {
    timeRemaining: number,
}

export default class CountdownCounter extends React.Component<CountdownCounterProps, CountdownCounterState> {
    #tickTimeout: NodeJS.Timeout | null = null;

    constructor(props: CountdownCounterProps) {
        super(props);

        this.state = {
            timeRemaining: props.countdown.date.getTime() - Date.now(),
        }
    }

    componentDidMount() {
        this.tick();
        this.scheduleTick();
    }

    componentWillUnmount() {
        if (this.#tickTimeout != null) {
            clearTimeout(this.#tickTimeout);
        }
    }

    scheduleTick() {
        const now = Date.now();
        const endOfSecond = Math.floor(now / 1000) * 1000 + 1000;
        this.#tickTimeout = setTimeout(() => {
            this.tick();
            this.scheduleTick();
        }, endOfSecond - now);
    }

    tick() {
        this.setState({ timeRemaining: this.props.countdown.date.getTime() - Date.now() });
    }

    handleEditBtnClick() {
        const newName = window.prompt("Enter new name", this.props.countdown.name) || this.props.countdown.name;
        const newDate = new Date(window.prompt("Enter new date", this.props.countdown.date.toISOString()) || this.props.countdown.date);
        this.props.onEdit({
            uuid: this.props.countdown.uuid,
            name: newName,
            date: newDate,
        });
    }

    handleDeleteBtnClick() {
        this.props.onRemove(this.props.countdown);
    }

    static formatDate(date: Date): string {
        return dateFormat(date, "E, d MMM y, HH:mm");
    }

    static renderDuration(duration: number): JSX.Element[] {
        const d = Math.floor(duration / TIME_DAY);
        const h = Math.floor(duration % TIME_DAY / TIME_HOUR);
        const m = Math.floor(duration % TIME_HOUR / TIME_MINUTE);
        const s = Math.ceil(duration % TIME_MINUTE / TIME_SECOND);

        const labels = ["d", "h", "m", "s"];
        const parts = [d, h, m, s];
        const [, firstSignificantPartIdx] = findFirst(parts, n => n !== 0);
        return parts
            .map((n, idx) => [n, labels[idx]])
            .filter((_, idx) => idx >= firstSignificantPartIdx)
            .map(([n, label], _) => (
                <span className="counter-counter-part" key={label}>
                    <span className="counter-counter-part-count">{n}</span>
                    <span className="counter-counter-part-label">{label}</span>
                </span>
            ));
    }

    render() {
        return (
            <div className="counter">
                <div className="counter-name">{this.props.countdown.name}</div>
                <div className="counter-counter">{CountdownCounter.renderDuration(this.state.timeRemaining)}</div>
                <div className="counter-date">{CountdownCounter.formatDate(this.props.countdown.date)}</div>

                <div className="counter-controls">
                    <button className="counter-editbtn" onClick={this.handleEditBtnClick.bind(this)}>edit</button>
                    <button className="counter-deletebtn" onClick={this.handleDeleteBtnClick.bind(this)}>delete</button>
                </div>
            </div>
        );
    }
}
