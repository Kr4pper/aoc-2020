import {readInput} from './utils';

const input = readInput(10).split('\r\n').map(Number);

// Part 1
const getDeltas = (values: number[]) => values.slice(1).map((v, i) => v - values[i]);

const sorted = [0, ...input.sort((a, b) => a - b), Math.max(...input) + 3];
const counts = getDeltas(sorted).reduce((acc, v) => ({...acc, [v]: (acc[v] || 0) + 1}), {});

console.log('Part 1:', counts[1] * counts[3]);

// Part 2
const bitmaps = Array.from({length: 4}, (_, i) => Array.from({length: Math.pow(2, i)}, (_, j) => j).map(v => v.toString(2).padStart(i, '0').split('').map(Number)));

const isValidPermutation = (block: number[]) => (bitmap: number[]) => Math.max(...getDeltas(block.filter((_, i) => bitmap[i - 1] ?? true))) <= 3;

const countValidPermutations = (block: number[]) => bitmaps[block.length - 2].filter(isValidPermutation(block)).length;

const countPermutations = (block: number[]) => block.length < 3 ? 1 : countValidPermutations(block);

let permutations = 1;
let blockStartIdx = 0;
let idx = 0;

while (idx++ < sorted.length) {
    if (sorted[idx - 1] + 3 === sorted[idx]) {
        permutations *= countPermutations(sorted.slice(blockStartIdx, idx));
        blockStartIdx = idx;
    }
}

console.log('Part 2:', permutations);
