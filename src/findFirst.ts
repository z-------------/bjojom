export default function findFirst<T>(array: Iterable<T>, predicate: (item: T) => boolean): [T | null, number] {
    let idx = 0;
    for (const item of array) {
        if (predicate(item)) {
            return [item, idx];
        }
        ++idx;
    }
    return [null, -1];
}
