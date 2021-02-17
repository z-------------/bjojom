import React from "react";
import * as localforage from "localforage";
import "./App.css";
import CountdownCounter from "../CountdownCounter/CountdownCounter";
import NewCountdownForm from "../NewCountdownForm/NewCountdownForm";
import Countdown from "../Countdown";

export default function App() {
    const [countdowns, setCountdowns] = React.useState([] as Countdown[]);

    const lfKey = "bjojomCountdowns";

    async function loadCountdownsFromDisk() {
        let loadedCountdowns: Countdown[] | null = await localforage.getItem(lfKey);
        if (loadedCountdowns == null) {
            loadedCountdowns = [];
            await localforage.setItem(lfKey, loadedCountdowns);
        }
        return loadedCountdowns;
    }

    async function saveCountdownsToDisk(countdowns: Countdown[]) {
        await localforage.setItem(lfKey, countdowns);
    }

    async function handleNewCountdown(countdown: Countdown) {
        const countdownsNew = countdowns.concat([countdown]);
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
                    countdowns.map(({ name, date }) => (
                        <li key={name + date}>
                            <CountdownCounter name={name} date={date}></CountdownCounter>
                        </li>
                    ))
                }
            </ul>
            <NewCountdownForm onNewCountdown={handleNewCountdown}></NewCountdownForm>
        </div>
    );
}
