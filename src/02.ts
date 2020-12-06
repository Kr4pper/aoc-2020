import {readInput} from './utils';

const input = readInput(2).split('\n');

const toPasswordData = (entry: string) => {
    const [_, x, y, character, password] = entry.match(/(\d+)-(\d+) (.): (.*)/);

    return {
        x: +x,
        y: +y,
        character,
        password,
    };
};

// PART 1
const data = input.map(toPasswordData);
const validPasswordsPart1 = data.filter(({password, character, x, y}) => {
    const occurences = (password.match(new RegExp(character, 'g')) || []).length;

    return occurences >= +x
        && occurences <= +y;
});
console.log('Part 1:', validPasswordsPart1.length);

// PART 2
const validPasswordsPart2 = data.filter(({password, character, x, y}) => {
    const atX = password[x - 1] === character ? 1 : 0;
    const atY = password[y - 1] === character ? 1 : 0;

    return atX + atY === 1;
});
console.log('Part 2:', validPasswordsPart2.length);
