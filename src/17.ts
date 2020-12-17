import {readInput} from './utils';

const input = readInput(17).split('\r\n');

enum State {
    Active = '#',
    Inactive = '.',
}

type PocketDimension = State[][][][]; // w z x y

const distances = [-1, 0, 1];
const directions = (depth: number): number[][] =>
    depth === 1
        ? distances.map(tail => [tail])
        : directions(depth - 1).flatMap(head => distances.map(tail => [...head, tail]));

const _4d = directions(4).filter(values => values.some(v => v !== 0));

let state: PocketDimension = [[input.map(line => line.split('') as State[])]];
let next: PocketDimension;
for (let i = 0; i < 6; i++) {
    const [wLen, zLen, xLen, yLen] = [state.length + 2, state[0].length + 2, state[0][0].length + 2, state[0][0].length + 2];

    next = Array.from(
        {length: wLen},
        () => Array.from(
            {length: zLen},
            () => Array.from(
                {length: xLen},
                () => Array.from(
                    {length: yLen}
                )
            )
        )
    );

    for (let w = 0; w < wLen; w++) {
        for (let z = 0; z < zLen; z++) {
            for (let x = 0; x < xLen; x++) {
                for (let y = 0; y < yLen; y++) {
                    const nearbyActive = _4d.filter(([dw, dz, dx, dy]) => state[w - 1 + dw]?.[z - 1 + dz]?.[x - 1 + dx]?.[y - 1 + dy] === State.Active).length;

                    next[w][z][x][y] = state[w - 1]?.[z - 1]?.[x - 1]?.[y - 1] === State.Active
                        ? (nearbyActive === 2 || nearbyActive === 3) ? State.Active : State.Inactive
                        : nearbyActive === 3 ? State.Active : State.Inactive;
                }
            }
        }
    }

    state = next;
}

type NestedArray<T> = T[] | Array<NestedArray<T>>;
type Unboxed<T> = T extends (infer U)[] ? Unboxed<U> : T;

const fullyUnboxed = <T>(arg: NestedArray<T>): arg is T[] => typeof (arg[0] as any[])?.reduce !== 'function';

const fancyCount = <T>(
    structure: NestedArray<T>,
    criterion: (arg: Unboxed<T>) => boolean,
): number =>
    fullyUnboxed(structure)
        ? (structure as Unboxed<T>[]).filter(criterion).length
        : structure.reduce<number>((acc, sub) => acc + fancyCount(sub, criterion), 0);

console.log(fancyCount(state, v => v === State.Active));
