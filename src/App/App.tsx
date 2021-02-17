import React from "react";
// import * as localforage from "localforage";
import "./App.css";
import Countdown from "../Countdown/Countdown";

export default class App extends React.Component {
    #countdowns = [
        { name: "Foo", date: new Date("2021-12-25T00:00+08:00") },
        { name: "Bar", date: new Date("2021-02-18T00:00+08:00") },
    ];

    componentDidMount() {
        console.log("App mount");
    }

    render() {
        return (
            <div className={this.constructor.name}>
                { this.#countdowns.map(({ name, date }) => <Countdown name={name} date={date}></Countdown>) }
            </div>
        );
    }
}
