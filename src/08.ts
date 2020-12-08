import {readInput} from './utils';

const input = readInput(8).split('\r\n');

const enum OpCode {
    NOP = 'nop',
    ACC = 'acc',
    JMP = 'jmp',
}

interface Instruction {
    opCode: OpCode;
    argument: number;
}

// Part 1
const instructionRegex = /(\S+) ([+-]\d+)/;

const toInstruction = (line: string): Instruction => {
    const [_, opCode, argument] = line.match(instructionRegex) as [never, OpCode, number];
    return {opCode, argument: +argument};
};

const executeProgramPart1 = (instructions: Instruction[]): number => {
    let ptr = 0;
    let acc = 0;
    const visited = new Set<number>();

    while (!visited.has(ptr)) {
        const {opCode, argument} = instructions[ptr];
        visited.add(ptr);

        switch (opCode) {
            case OpCode.ACC: {
                acc += argument;
                ptr++;
                break;
            }
            case OpCode.JMP: {
                ptr += argument;
                break;
            }
            case OpCode.NOP: {
                ptr++;
                break;
            }
            default: {
                throw new Error(`Received unsupported opCode ${opCode} with argument ${argument}`);
            }
        }
    }

    return acc;
};

const instructions = input.map(toInstruction);
console.log('Part 1:', executeProgramPart1(instructions));

// Part 2
const executeProgramPart2 = (
    instructions: Instruction[],
    ptrSeed = 0,
    accSeed = 0,
    isSlave = false,
): number => {
    const visited = new Set<number>();
    let ptr = ptrSeed;
    let acc = accSeed;

    while (ptr < instructions.length) {
        const {opCode, argument} = instructions[ptr];

        if (!isSlave && [OpCode.JMP, OpCode.NOP].includes(opCode)) {
            const alteredInstructions = [...instructions];
            alteredInstructions[ptr] = {opCode: opCode === OpCode.JMP ? OpCode.NOP : OpCode.JMP, argument};

            const res = executeProgramPart2(alteredInstructions, ptr, acc, true);
            if (res) {
                return res; // fixed the faulty instruction
            }
        }

        if (visited.has(ptr)) {
            return null; // loop detected
        }

        visited.add(ptr);

        switch (opCode) {
            case OpCode.ACC: {
                acc += argument;
                ptr++;
                break;
            }
            case OpCode.JMP: {
                ptr += argument;
                break;
            }
            case OpCode.NOP: {
                ptr++;
                break;
            }
            default: {
                throw new Error(`Received unsupported opCode ${opCode} with argument ${argument}`);
            }
        }
    }

    return acc;
};

console.log('Part 2:', executeProgramPart2(instructions));
