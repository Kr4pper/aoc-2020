import {readInput} from './utils';

const [_rules, _myTicket, _nearbyTickets] = readInput(16).split('\r\n\r\n').map(v => v.split('\r\n'));

// Part 1
const range = (min: number, max: number) => Array.from({length: max - min + 1}, (_, i) => min + i);

const ruleRegex = /^([^\:]*): (\d+)-(\d+) or (\d+)-(\d+)$/;
const parseRule = (rule: string) => {
    const [_, name, min1, max1, min2, max2] = rule.match(ruleRegex);
    return {
        name,
        allowed: new Set([
            ...range(+min1, +max1),
            ...range(+min2, +max2),
        ]),
    };
};

const rules = _rules.map(parseRule);
const validValues = new Set(
    rules.reduce(
        (valid, rule) => [
            ...valid,
            ...rule.allowed,
        ],
        [],
    )
);

const parseTicket = (ticket: string) => ticket.split(',').map(Number);
const nearbyTickets = _nearbyTickets.slice(1).map(parseTicket);
const res = nearbyTickets.reduce(
    (sum, t) => sum + t.filter(v => !validValues.has(v)).reduce(
        (acc, v) => acc + v,
        0,
    ),
    0,
);

console.log('Part 1:', res);

// Part 2
const validTickets = nearbyTickets.filter(t => t.every(v => validValues.has(v)));

const ruleCount = rules.length;
const columns = Array
    .from({length: ruleCount}, (_, i) => validTickets.map(t => t[i]))
    .map(values => rules.filter(r => values.every(v => r.allowed.has(v))).map(r => r.name));

const fields: {[k: string]: number;} = {};
const matchedRules = new Set<string>();
while (matchedRules.size < ruleCount) {
    columns.forEach((potentialFields, i) => {
        const remaining = potentialFields.filter(v => !matchedRules.has(v));
        if (remaining.length === 1) {
            const fieldName = remaining[0];
            matchedRules.add(fieldName);
            fields[fieldName] = i;
        }
    });
}

const myTicket = parseTicket(_myTicket[1]);
const departureIndexes = Object.entries(fields).filter(([k]) => k.startsWith('departure')).map(([_, v]) => v);
console.log('Part 2:', departureIndexes.reduce((acc, i) => acc * myTicket[i], 1));
