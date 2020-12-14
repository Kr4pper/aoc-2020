import {readInput} from './utils';

const input = readInput(14).split('\r\n');

// Part 1
const applyMask1 = (value: number, mask: string) => {
    let binary = value.toString(2).padStart(36, '0');
    return mask.split('').map((v, i) => v === 'X' ? binary[i] : v).join('');
};

const memory1: {[k: string]: string;} = {};
let mask1: string;
for (const line of input) {
    const [instruction, value] = line.split(' = ');
    if (instruction === 'mask') {
        mask1 = value;
        continue;
    }

    memory1[instruction.substr(4, instruction.length - 5)] = applyMask1(+value, mask1);
}

console.log('Part 1:', Object.values(memory1).reduce((acc, v) => acc + parseInt(v, 2), 0));

// Part 2
const _getTargetAddresses = (binary: string, mask: string, partialResult: string) => {
    const max = binary.length;
    let res = partialResult;
    let i = partialResult.length;

    while (i < max) {
        switch (mask[i]) {
            case '0':
                res += binary[i];
                break;
            case '1':
                res += '1';
                break;
            case 'X':
                return [
                    _getTargetAddresses(binary, mask, res + '0'),
                    _getTargetAddresses(binary, mask, res + '1'),
                ];
                default:
                    throw new Error(`Unexpected bitmap value ${mask[i]}`)
        }

        i++;
    }

    return res;
};

const getTargetAddresses = (address: number, mask: string) => _getTargetAddresses(address.toString(2).padStart(36, '0'), mask, '');

const memory2: {[k: string]: number;} = {};
let mask2: string;
for (const line of input) {
    const [instruction, value] = line.split(' = ');

    if (instruction === 'mask') {
        mask2 = value;
        continue;
    }

    getTargetAddresses(+instruction.substr(4, instruction.length - 5), mask2).forEach(t => memory2[t] = +value);
}

console.log('Part 2:', Object.values(memory2).reduce((acc, v) => acc + v, 0));
