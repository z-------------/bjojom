import React from "react";
import dateFormat from "date-fns/format";
import Countdown, { CountdownInfo } from "../Countdown";
import findFirst from "../findFirst";
import "./CountdownCounter.css";
import CountdownEditor from "../CountdownEditor/CountdownEditor";

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
    isEditorOpen: boolean,
}

export default class CountdownCounter extends React.Component<CountdownCounterProps, CountdownCounterState> {
    #tickTimeout: NodeJS.Timeout | null = null;

    constructor(props: CountdownCounterProps) {
        super(props);

        this.state = {
            timeRemaining: props.countdown.date.getTime() - Date.now(),
            isEditorOpen: false,
        }
    }

    /* lifecycle methods */

    componentDidMount() {
        this.tick();
        this.scheduleTick();
    }

    componentWillUnmount() {
        if (this.#tickTimeout != null) {
            clearTimeout(this.#tickTimeout);
        }
    }

    /* helpers */

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

    /* handlers */

    handleEditBtnClick() {
        this.setState({ isEditorOpen: true });
    }

    handleEditorSubmit(countdownInfo: CountdownInfo) {
        this.setState({ isEditorOpen: false });
        const countdown = Object.assign({
            uuid: this.props.countdown.uuid,
        }, countdownInfo);
        this.props.onEdit(countdown);
    }

    handleDeleteBtnClick() {
        this.props.onRemove(this.props.countdown);
    }

    /* render */

    render() {
        const hasBackgroundImage = this.props.countdown.backgroundUrl != null;

        return (
            <div
                className={["counter", ...(hasBackgroundImage ? ["counter--has-bg"] : [])].join(" ")}
                style={{
                    backgroundImage: hasBackgroundImage ?
                        `url(${this.props.countdown.backgroundUrl})` :
                        "none",
                }}
            >
                <div className="counter-bgmask">
                    <div className="counter-name">{this.props.countdown.name}</div>
                    <div className="counter-counter">{CountdownCounter.renderDuration(this.state.timeRemaining)}</div>
                    <div className="counter-date">{CountdownCounter.formatDate(this.props.countdown.date)}</div>

                    <div className="counter-controls">
                        <button className="counter-editbtn" onClick={this.handleEditBtnClick.bind(this)}>edit</button>
                        <button className="counter-deletebtn" onClick={this.handleDeleteBtnClick.bind(this)}>delete</button>
                    </div>
                </div>

                <div className="counter-editor" style={{ display: this.state.isEditorOpen ? "block" : "none" }}>
                    <CountdownEditor
                        initialCountdownInfo={this.props.countdown}
                        onSubmit={this.handleEditorSubmit.bind(this)}
                        submitButtonText="Save"
                    />
                </div>
            </div>
        );
    }
}
