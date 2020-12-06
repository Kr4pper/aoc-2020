import {readInput} from './utils';

const input = readInput(5).split('\r\n');

const binaryPartionining = (value: string, high: string) =>
    value.split('')
        .map(v => v === high)
        .reverse()
        .reduce((acc, v, idx) => acc + (v ? Math.pow(2, idx) : 0), 0);

// Part 1
const data = input.map(i => ({
    row: binaryPartionining(i.slice(0, 7), 'B'),
    column: binaryPartionining(i.slice(7, 10), 'R'),
}));

const seatIds = data.map(v => 8 * v.row + v.column);
console.log('Part 1:', Math.max(...seatIds));

// Part 2
const occupied = new Set(seatIds);
const missing = seatIds.find(id => !occupied.has(id + 1) && occupied.has(id + 2)) + 1;
console.log('Part 2:', missing);
