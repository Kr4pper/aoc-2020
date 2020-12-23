import { readInput } from './utils';

const input = readInput(22);

// Part 1
const combat = (seed: number[][]): number[][] => {
    const decks = seed.map(d => [...d]);

    while (decks.every(p => p.length)) {
        const topCards = decks.flatMap(p => p.splice(0, 1));
        const high = Math.max(...topCards);
        const low = Math.min(...topCards);
        const winner = topCards.indexOf(high);
        decks[winner].push(high, low);
    }

    return decks;
};

const players = input.split('\r\n\r\n').map(p => p.split('\r\n').slice(1).map(Number));

const getScore = (deck: number[]) => deck.reverse().reduce((sum, v, i) => sum + v * (i + 1), 0);

console.log('Part 1:', getScore(combat(players).filter(p => p.length)[0]));

// Part 2
const recursiveCombat = (seed: number[][]): [number, number[]] => {
    const decks = seed.map(d => [...d]);
    const previousDecks = [new Set(), new Set()];

    while (decks.every(d => d.length)) {
        if (previousDecks[0].has(decks[0].join(',')) || previousDecks[1].has(decks[1].join(','))) {
            return [0, null];
        }

        previousDecks[0].add(decks[0].join(','));
        previousDecks[1].add(decks[1].join(','));

        const [aCard, bCard] = decks.flatMap(p => p.splice(0, 1));

        if (decks[0].length >= aCard && decks[1].length >= bCard) {
            const winner = recursiveCombat([decks[0].slice(0, aCard), decks[1].slice(0, bCard)])[0];
            decks[winner].push(...(winner === 0 ? [aCard, bCard] : [bCard, aCard]));
            continue;
        }

        const high = Math.max(aCard, bCard);
        const low = Math.min(aCard, bCard);
        const winner = [aCard, bCard].indexOf(high);
        decks[winner].push(high, low);
    }

    return [decks.findIndex(d => d.length), decks.find(d => d.length)];
};

console.log('Part 2:', getScore(recursiveCombat(players)[1]));
