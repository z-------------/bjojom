export interface CountdownInfo {
    name: string,
    date: Date,
    backgroundUrl: string | null,
}

export default interface Countdown extends CountdownInfo {
    uuid: string,
}
