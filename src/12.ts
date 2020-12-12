import {manhattanDistance, readInput, rotateRight} from './utils';

enum Action {
    North = 'N',
    South = 'S',
    East = 'E',
    West = 'W',
    Left = 'L',
    Right = 'R',
    Forward = 'F',
}

interface Instruction {
    action: Action;
    value: number;
}

const toInstruction = (line: string): Instruction => {
    const [_, action, value] = line.match(/(.)(\d+)/);
    return {
        action: action as Action,
        value: +value
    };
};

const instructions = readInput(12).split('\r\n').map(toInstruction);

// Part 1
const executeInstructions = <State extends object>(
    instructions: Instruction[],
    rules: {[A in Action]: (state: State, value: number) => State},
    initialState: State,
) => instructions.reduce((state, i) => rules[i.action](state, i.value), initialState);

const part1 = executeInstructions(
    instructions,
    {
        [Action.North]: (s, v) => ({...s, y: s.y + v}),
        [Action.South]: (s, v) => ({...s, y: s.y - v}),
        [Action.East]: (s, v) => ({...s, x: s.x + v}),
        [Action.West]: (s, v) => ({...s, x: s.x - v}),
        [Action.Left]: (s, v) => ({...s, direction: rotateRight(s.direction, 360 - v)}),
        [Action.Right]: (s, v) => ({...s, direction: rotateRight(s.direction, v)}),
        [Action.Forward]: (s, v) => ({...s, x: s.x += s.direction[0] * v, y: s.y += s.direction[1] * v}),
    },
    {
        x: 0,
        y: 0,
        direction: [1, 0] as [number, number],
    },
);

console.log('Part 1:', manhattanDistance(part1.x, part1.y));

// Part 2
const part2 = executeInstructions(
    instructions,
    {
        [Action.North]: (s, v) => ({...s, wayY: s.wayY + v}),
        [Action.South]: (s, v) => ({...s, wayY: s.wayY - v}),
        [Action.East]: (s, v) => ({...s, wayX: s.wayX + v}),
        [Action.West]: (s, v) => ({...s, wayX: s.wayX - v}),
        [Action.Left]: (s, v) => {
            let [wayX, wayY] = rotateRight([s.wayX, s.wayY], 360 - v);
            return {...s, wayX, wayY};
        },
        [Action.Right]: (s, v) => {
            let [wayX, wayY] = rotateRight([s.wayX, s.wayY], v);
            return {...s, wayX, wayY};
        },
        [Action.Forward]: (s, v) => ({...s, x: s.x += s.wayX * v, y: s.y += s.wayY * v}),
    },
    {
        x: 0,
        y: 0,
        wayX: 10,
        wayY: 1,
    },
);

console.log('Part 2:', manhattanDistance(part2.x, part2.y));
