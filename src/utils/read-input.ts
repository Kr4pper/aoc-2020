import {readFileSync} from 'fs';
import {join} from 'path';

export const readInput = (day: number) => readFileSync(
    join(__dirname, '..', 'input', ('0' + day).slice(-2)),
    {encoding: 'utf-8'}
);
