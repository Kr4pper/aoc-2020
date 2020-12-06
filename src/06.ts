import {readInput} from './utils';

const input = readInput(6);

// Part 1
const groups = input.split('\r\n\r\n').map(v => v.split('\r\n'));
const counts = groups.map(g => new Set(g.join('').split('')).size);
console.log('Part 1:', counts.reduce((acc, c) => acc + c, 0));

// Part 2
const countUnanimousAnswers = (responses: string[]) => {
    const tmp = {};
    for (let res of responses) {
        for (let c of res.split('')) {
            tmp[c] = (tmp[c] || 0) + 1;
        }
    }

    const responseCount = responses.length;
    return Object.values(tmp).filter(v => v === responseCount).length;
};
console.log('Part 2:', groups.map(countUnanimousAnswers).reduce((acc, c) => acc + c, 0));
