import { readInput } from './utils';

const [card, door] = readInput(25).split('\r\n').map(Number);

// Part 1
const cache = {};

let tmp = 7;
for (let i = 1; i < 10_000_000; i++) {
    cache[tmp] = i;
    tmp = (tmp * 7) % 20201227;
}

const cardLoops = cache[card];
const doorLoops = cache[door];

const seed = cardLoops < doorLoops ? door : card;
let res = seed;
for (let i = 1; i < Math.min(cardLoops, doorLoops); i++) {
    res = (res * seed) % 20201227;
}

console.log('Part 1:', res);
