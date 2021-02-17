export interface CountdownInfo {
    name: string,
    date: Date,
}

export default interface Countdown extends CountdownInfo {
    uuid: string,
}
