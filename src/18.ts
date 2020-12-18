import {readInput} from './utils';

const input = readInput(18).split('\r\n');

enum TokenType {
    Number = 'int',
    Add = '+',
    Multiply = '*',
    OpenParens = '(',
    ClosingParens = ')',
}

interface Token {
    type: TokenType;
    value?: number;
}

// Part 1
const tokenize = (line: string) => {
    const tokens: Token[] = [];
    let i = 0;
    let parensDepth = 0;
    while (i < line.length) {
        switch (line[i]) {
            case ' ':
                break;
            case '+':
                tokens.push({type: TokenType.Add});
                break;
            case '*':
                tokens.push({type: TokenType.Multiply});
                break;
            case '(':
                tokens.push({type: TokenType.OpenParens, value: parensDepth});
                parensDepth++;
                break;
            case ')':
                parensDepth--;
                tokens.push({type: TokenType.ClosingParens, value: parensDepth});
                break;
            default:
                if (isNaN(+line[i])) throw new Error(`Expected number but got "${line[i]}" at index ${i}`);

                const nextNonDigitIndex = line.substring(i).search(/\D/);
                const numberLength = nextNonDigitIndex === -1 ? line.length - i : nextNonDigitIndex;
                tokens.push({type: TokenType.Number, value: +line.substring(i, i + numberLength)});
                i = i + numberLength - 1;
        }
        i++;
    }
    return tokens;
};

const parseTokens1 = (tokens: Token[]) => {
    let i = 0;
    while (i < tokens.length) {
        switch (tokens[i].type) {
            case TokenType.Number:
                i++;
                break;
            case TokenType.Add:
                if (tokens[i + 1].type !== TokenType.Number) {
                    i++;
                    break;
                }

                tokens.splice(i - 1, 3, {type: TokenType.Number, value: tokens[i - 1].value + tokens[i + 1].value});
                i--;
                break;
            case TokenType.Multiply:
                if (tokens[i + 1].type !== TokenType.Number) {
                    i++;
                    break;
                }

                tokens.splice(i - 1, 3, {type: TokenType.Number, value: tokens[i - 1].value * tokens[i + 1].value});
                i--;
                break;
            case TokenType.OpenParens:
                const correspondingClosingParens = tokens.findIndex(t => t.type === TokenType.ClosingParens && t.value === tokens[i].value);
                const unwrapped = parseTokens1(tokens.slice(i + 1, correspondingClosingParens));
                tokens.splice(i, correspondingClosingParens - i + 1, {type: TokenType.Number, value: unwrapped});
                i = 0;
                break;
            case TokenType.ClosingParens:
            default:
                throw new Error(`Parse error at index ${i}`);
        }
    }

    return tokens[0].value;
};

const solve = (parser: (tokens: Token[]) => number) => (input: string[]) => input.reduce((sum, line) => sum + parser(tokenize(line)), 0);

console.log('Part 1:', solve(parseTokens1)(input));

// Part 2
const parseTokens2 = (tokens: Token[]) => {
    let openIdx: number;
    while ((openIdx = tokens.findIndex(t => t.type === TokenType.OpenParens)) !== -1) {
        const closeIdx = tokens.findIndex(t => t.type === TokenType.ClosingParens && t.value === tokens[openIdx].value);

        tokens.splice(openIdx, closeIdx - openIdx + 1, {type: TokenType.Number, value: parseTokens2(tokens.slice(openIdx + 1, closeIdx))});
    }

    let addIdx: number;
    while ((addIdx = tokens.findIndex(t => t.type === TokenType.Add)) !== -1) {
        tokens.splice(addIdx - 1, 3, {type: TokenType.Number, value: tokens[addIdx - 1].value + tokens[addIdx + 1].value});
    }

    return tokens
        .filter(t => t.type === TokenType.Number)
        .reduce((acc, t) => acc * t.value, 1);
};

console.log('Part 2:', solve(parseTokens2)(input));
