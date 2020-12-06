import {readInput} from './utils';

const input = readInput(4);

const passports = input.split('\r\n\r\n').map(p => p.replace(/\r\n/g, ' '));

// Part 1
const requiredFields = [
    'byr',
    'iyr',
    'eyr',
    'hgt',
    'hcl',
    'ecl',
    'pid',
];

const passportRegexPart1 = new RegExp(requiredFields.reduce((acc, v) => acc + `(?=.*${v}:)`, ''));

const validPasswordsPart1 = passports.filter(p => passportRegexPart1.test(p)).length;
console.log('Part 1:', validPasswordsPart1);

// Part 2
const validationRules = [
    /(19[2-9][0-9]|200[0-2])\b/,
    /(201[0-9]|2020)\b/,
    /(202[0-9]|2030)\b/,
    /(((1[5-8][0-9]|19[0-3])cm)|((59|6[0-9]|7[0-6])in))\b/,
    /\#[0-9a-f]{6}\b/,
    /(amb|blu|brn|gry|grn|hzl|oth)\b/,
    /[0-9]{9}\b/
];

const validationRegexes = requiredFields.map((v, idx) => new RegExp(`.*${v}:${new RegExp(validationRules[idx]).source}`));

const validPasswordsPart2 = passports.filter(p => validationRegexes.every(r => r.test(p))).length;
console.log('Part 2:', validPasswordsPart2);
