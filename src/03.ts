import {readInput} from './utils';

const input = readInput(3).split('\n');

const trees = input.map(line => line.split('').map(v => v === '#'));

// Part 1
const isTree = (x: number, y: number) => {
    return trees[y][x % (trees[0].length - 1)];
};

let treeCount = 0;
let x = 3;
for (let y = 1; y < trees.length;) {
    if (isTree(x, y)) treeCount++;

    x += 3;
    y += 1;
}

console.log('Part 1:', treeCount);

// Part 2
const slopes = [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2],
];

const treeCounts = slopes.map(([dx, dy]) => {
    let treeCount = 0;
    let x = dx;
    for (let y = dy; y < trees.length;) {
        if (isTree(x, y)) treeCount++;

        x += dx;
        y += dy;
    }

    return treeCount;
});
console.log('Part 2:', treeCounts.reduce((acc, c) => acc * c, 1));
