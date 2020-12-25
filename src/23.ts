import { readInput } from './utils';

const input = readInput(23).split('').map(Number);
const FIRST_CUP = input[0];
const INPUT_LENGTH = input.length;
const MAX_SIZE = 1_000_000;

// Part 1
const simulate = (cups: Map<number, number>, moves: number, firstCup: number) => {
    let currentCup = firstCup;

    for (let i = 0; i < moves; i++) {
        const first = cups.get(currentCup);
        const second = cups.get(first);
        const third = cups.get(second);
        const pickedUp = [first, second, third];

        let dest = currentCup === 1
            ? cups.size
            : currentCup - 1;
        while (pickedUp.includes(dest)) {
            dest--;

            if (dest === 0) dest = cups.size;
        }

        cups.set(currentCup, cups.get(third));
        cups.set(third, cups.get(dest));
        cups.set(dest, first);

        currentCup = cups.get(currentCup);
    }
};

const cups1 = new Map<number, number>();
input.forEach((v, i) => cups1.set(v, input[(i + 1) % INPUT_LENGTH]));
const cups2 = new Map(cups1);

simulate(cups1, 100, FIRST_CUP);

const labels = [];
let currentCup = 1;
for (let i = 0; i < INPUT_LENGTH - 1; i++) {
    currentCup = cups1.get(currentCup);
    labels.push(currentCup);
}

console.log('Part 1:', +labels.join(''));

// Part 2
for (let i = INPUT_LENGTH + 1; i <= MAX_SIZE; i++) cups2.set(i, i + 1);
cups2.set(input[INPUT_LENGTH - 1], INPUT_LENGTH + 1);
cups2.set(MAX_SIZE, FIRST_CUP);

simulate(cups2, 10_000_000, FIRST_CUP);
console.log('Part 2:', cups2.get(1) * cups2.get(cups2.get(1)));
