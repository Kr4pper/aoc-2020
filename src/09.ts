import {readInput} from './utils';

const input = readInput(9).split('\r\n').map(Number);

// Part 1
const possibleAsTwoNumberSum = (target: number, values: number[]) => {
    const unique = new Set(values);
    return [...unique].some(v => unique.has(target - v));
};

const findFaultyXmasNumber = (xmasList: number[], preambleLength: number) =>
    xmasList.slice(preambleLength).find((v, idx) =>
        !possibleAsTwoNumberSum(v, xmasList.slice(idx, idx + preambleLength))
    );

const faultyXmasNumber = findFaultyXmasNumber(input, 25);
console.log('Part 1:', faultyXmasNumber);

// Part 2
const findEncryptionWeakness = (xmasList: number[], faultyNumber: number) => {
    let lower = 0;
    let upper = 0;
    let sum = 0;

    while (sum != faultyNumber) {
        if (sum < faultyNumber)
            sum += xmasList[upper++];
        else
            sum -= xmasList[lower++];
    }

    const segment = xmasList.slice(lower, upper + 1);
    return Math.min(...segment) + Math.max(...segment);
};

console.log('Part 2:', findEncryptionWeakness(input, faultyXmasNumber));
