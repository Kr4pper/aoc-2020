import {memoizeBy, readInput} from './utils';

const [rawRules, messages] = readInput(19).split('\r\n\r\n').map(v => v.split('\r\n'));

type Rule = {
    ruleNumber: string;
    literal?: string;
    options?: string[][];
    recursive?: boolean;
};

// Part 1
const parseRule = (line: string): Rule => {
    try {
        const [_, ruleNumber, rest] = line.match(/^(\d+): (.*)$/);

        if (rest.match(/"(.)"/)) {
            const [_, literal] = rest.match(/"(.)"/);
            return {ruleNumber, literal};
        }

        const options = rest.split(' | ').map(p => p.split(' '));
        return {
            ruleNumber,
            options,
            recursive: options.some(v => v.includes(ruleNumber)),
        };
    } catch (e) {
        console.log('parse error', line);
    }
};

const rules = new Map<string, Rule>();
rawRules.map(parseRule).forEach(r => rules.set(r.ruleNumber, r));

const cross = (as: string[], bs: string[]) => {
    if (!as.length) return bs;
    if (!bs.length) return as;

    const res = [];
    for (let a of as) {
        for (let b of bs) {
            res.push(a + b);
        }
    }
    return res;
};

const cache = new Map<string, string[]>();
const untangle = (ruleNumber: string, from: string): string[] => {
    //console.log('untangle', ruleNumber, from);

    const rule = rules.get(ruleNumber);
    if (!rule) throw new Error(`Rule not found: ${ruleNumber}`);

    if (rule.literal) {
        return [rule.literal];
    }

    if (cache.has(ruleNumber)) {
        return cache.get(ruleNumber);
    }

    const next = [];

    for (let option of rule.options) {
        const recursiveIdx = option.indexOf(ruleNumber);
        if (recursiveIdx !== -1) {
            const before = option.filter((_, i) => i < recursiveIdx);
            const after = option.filter((_, i) => i > recursiveIdx);
            const prefixes = before.flatMap(v => untangle(v, ruleNumber));
            const suffixes = after.flatMap(v => untangle(v, ruleNumber));
            //console.log('recursion', ruleNumber, before, after, prefixes, suffixes);

            const combinations = cross(prefixes, suffixes);

            const pre = prefixes.length ? prefixes : [''];
            const suf = suffixes.length ? suffixes : [''];

            const depth = 1;
            const next = Array(pre.length * suf.length * combinations.length * depth);
            console.log(ruleNumber, 'recursion allocated', pre.length, suf.length, combinations.length, pre.length * suf.length * combinations.length * depth);
            for (let b of pre) {
                for (let a of suf) {
                    for (let c of combinations) {
                        for (let i = 0; i < depth; i++) {
                            next.push(a + c.repeat(i) + b);
                        }
                    }
                }
            }

            console.log(ruleNumber, 'recursion total res', next.length);
            cache.set(ruleNumber, next);
            return next;
        }

        const resolved = option.filter(o => o.length).map(o => untangle(o, ruleNumber));
        const [a, b, c] = resolved;
        console.log(ruleNumber, option, a?.length, b?.length, c?.length);

        for (let fromA of a) {
            if (b) {
                for (let fromB of b) {
                    if (c) {
                        for (let fromC of c) {
                            next.push(fromA + fromB + fromC);
                        }
                    }
                    next.push(fromA + fromB);
                }
            }
            else next.push(fromA);
        }

        console.log('loop completed', next.length);
    }

    cache.set(ruleNumber, next);

    return next;
};

const valid = new Set(untangle('0', null));
console.log(valid.size);
console.log('Part 1:', messages.filter(m => valid.has(m)));
