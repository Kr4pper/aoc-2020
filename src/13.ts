import {lcm, readInput} from './utils';

// Part 1
const parseInput = () => {
    const [earliestString, allBusIds] = readInput(13).split('\r\n');
    return {earliest: +earliestString, busIds: allBusIds.split(',')};
};

const {earliest, busIds} = parseInput();
const busIdsPart1 = busIds.filter(v => v !== 'x').map(Number);

const earliestDepartures = busIdsPart1.map(v => [v, Math.ceil(earliest / v) * v]);
const [busId, busDeparture] = earliestDepartures.sort(([_, d1], [__, d2]) => d1 > d2 ? 1 : -1)[0];
console.log('Part 1:', busId * (busDeparture - earliest));

// Part 2
const getPart2Result = () => {
    const rules = busIds
        .map(v => v !== 'x' ? v : null)
        .map(Number)
        .map((v, offset) => v === 0 ? undefined : [v, offset])
        .filter(r => !!r)
        .sort(([a], [b]) => a < b ? 1 : -1);

    let matchedRules = 1;
    let step = rules[0][0];
    let t = step - rules[0][1];
    do {
        for (let [busId, offset] of rules.slice(matchedRules)) {
            if ((t + offset) % busId !== 0) break;

            if (++matchedRules === rules.length) return t;
            step = lcm(step, busId);
        }
    } while (t += step);
};

console.log('Part 2:', getPart2Result());
