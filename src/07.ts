import {readInput} from './utils';

const input = readInput(7).split('\n');

const splitRegex = /(\w+ \w+) bags contain ([^\.]*)/;
const ruleRegex = /(\d+) (\w+ \w+)/;

// Part 1
const getRules = (bag: string) => {
    const [_, type, content] = bag.match(splitRegex);

    if (content === 'no other bags') return {type, content: []};

    return {
        type,
        content: content.split(', ').map(getContent),
    };
};

const getContent = (rawContent: string) => {
    const [_, count, type] = rawContent.match(ruleRegex);
    return {type, count: +count};
};

interface BagTypes {
    [OuterBagType: string]: {
        [ContainedBagType: string]: number;
    };
}

const rules = Object
    .values(input.map(getRules))
    .reduce<BagTypes>((acc, {type, content}) => ({
        ...acc,
        [type]: content.reduce((_acc, {type, count}) => ({
            ..._acc,
            [type]: count
        }), {}),
    }), {});

const canContainBag = (wantedType: string) => (bagType: string) => {
    const contains = rules[bagType];
    if (contains[wantedType]) return true;

    return Object.keys(contains).some(k => canContainBag(wantedType)(k));
};

const bagTypes = Object.keys(rules);
console.log('Part 1:', bagTypes.filter(canContainBag('shiny gold')).length);

// Part 2
const countNestedBags = (acc: number, [type, count]: [string, number]) => acc + count * (1 + bagsContainedIn(type));
const bagsContainedIn = (bagType: string) => Object.entries(rules[bagType]).reduce(countNestedBags, 0);
console.log('Part 2:', bagsContainedIn('shiny gold'));
