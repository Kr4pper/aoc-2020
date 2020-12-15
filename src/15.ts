import {readInput} from './utils';

const rawInput = readInput(15).split(',');

// Part 1
const getNthSpokenNumber = (n: number, seed: {[k: number]: number;}, lastNumber: number) => {
    const lastOccurences = new Map(Object.entries(seed).map(([k, v]) => [+k, +v]));

    for (let i = lastOccurences.size; i < n; i++) {
        const previous = lastOccurences.get(lastNumber);
        const next = previous != null
            ? i - 1 - previous
            : 0;

        lastOccurences.set(lastNumber, i - 1);

        lastNumber = next;
    }

    return lastNumber;
};

const parseInput = (input: string[]): [{}, number] => [Object.values(input).reduce((acc, v, i) => ({...acc, [+v]: [i]}), {}), +input[input.length - 1]];

const [input, lastNumber] = parseInput(rawInput);
console.log('Part 1:', getNthSpokenNumber(2020, input, lastNumber));

// Part 2
console.log('Part 2:', getNthSpokenNumber(30000000, input, lastNumber));
