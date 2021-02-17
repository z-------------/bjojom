import React from "react";
import * as localforage from "localforage";
import "./App.css";
import CountdownCounter from "../CountdownCounter/CountdownCounter";
import NewCountdownForm from "../NewCountdownForm/NewCountdownForm";
import Countdown from "../Countdown";

function countdownCompareChronological(a: Countdown, b: Countdown) {
    return a.date.getTime() - b.date.getTime();
}

export default function App() {
    const [countdowns, setCountdowns] = React.useState([] as Countdown[]);

    const lfKey = "bjojomCountdowns";

    async function loadCountdownsFromDisk() {
        let loadedCountdowns: Countdown[] | null = await localforage.getItem(lfKey);
        if (loadedCountdowns == null) {
            loadedCountdowns = [];
            await localforage.setItem(lfKey, loadedCountdowns);
        }
        loadedCountdowns.sort(countdownCompareChronological);
        return loadedCountdowns;
    }

    async function saveCountdownsToDisk(countdowns: Countdown[]) {
        await localforage.setItem(lfKey, countdowns);
    }

    async function handleNewCountdown(countdown: Countdown) {
        const countdownsNew = countdowns
            .concat([countdown])
            .sort(countdownCompareChronological);
        setCountdowns(countdownsNew);
        await saveCountdownsToDisk(countdownsNew);
    }

    async function handleRemove(countdown: Countdown) {
        const countdownsNew = countdowns.filter(c => c.uuid !== countdown.uuid);
        setCountdowns(countdownsNew);
        await saveCountdownsToDisk(countdownsNew);
    }

    async function handleEdit(countdown: Countdown) {
        const countdownsNew = countdowns
            .map(c => c.uuid === countdown.uuid ? countdown : c)
            .sort(countdownCompareChronological);
        setCountdowns(countdownsNew);
        await saveCountdownsToDisk(countdownsNew);
    }

    React.useEffect(() => {
        loadCountdownsFromDisk().then(setCountdowns);
    }, []);

    return (
        <div className="App">
            <ul className="App-list">
                {
                    countdowns.map(countdown => (
                        <li key={countdown.uuid}>
                            <CountdownCounter
                                countdown={countdown}
                                onEdit={handleEdit}
                                onRemove={handleRemove}
                            ></CountdownCounter>
                        </li>
                    ))
                }
            </ul>
            <NewCountdownForm onNewCountdown={handleNewCountdown}></NewCountdownForm>
        </div>
    );
}
