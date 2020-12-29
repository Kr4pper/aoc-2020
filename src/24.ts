import { readInput } from './utils';

const input = readInput(24).split('\r\n');

// Part 1
const countOccurences = (line: string) => {
    const ne = (line.match(/ne/g) || []).length;
    const se = (line.match(/se/g) || []).length;
    const e = (line.match(/e/g) || []).length - se - ne;
    const sw = (line.match(/sw/g) || []).length;
    const nw = (line.match(/nw/g) || []).length;
    const w = (line.match(/w/g) || []).length - sw - nw;

    return { e, se, sw, w, nw, ne };
};

type Moves = ReturnType<typeof countOccurences>;

const directions: { [k in keyof Moves]: [number, number] } = {
    ne: [1, 1],
    se: [1, -1],
    e: [2, 0],
    sw: [-1, -1],
    nw: [-1, 1],
    w: [-2, 0],
};

const getTile = (moves: Moves) =>
    Object.entries(moves)
        .reduce(
            ({ x, y }, [k, v]) => {
                const [dx, dy] = directions[k];
                return { x: x + dx * v, y: y + dy * v };
            },
            { x: 0, y: 0 }
        );

const tiles = new Map<string, number>();
for (const line of input) {
    const { x, y } = getTile(countOccurences(line));
    const tileId = `${x}_${y}`;
    const old = tiles.get(tileId) || 0;
    tiles.set(tileId, old + 1);
}

let blackTiles = new Set<string>();
for (const [tileId, flipCount] of tiles) {
    if (flipCount % 2 === 1) blackTiles.add(tileId);
}

console.log('Part 1:', blackTiles.size);

// Part 2
const _directions = Object.values(directions);

function* adjacentTiles(tiles: Set<string>): Generator<string, void, never> {
    for (const tileId of tiles) {
        yield tileId;
        const [x, y] = tileId.split('_');
        for (const [dx, dy] of _directions) {
            yield `${+x + dx}_${+y + dy}`;
        }
    }
};

for (let i = 0; i < 100; i++) {
    const next = new Set<string>();
    for (const tileId of new Set(adjacentTiles(blackTiles))) {
        const [x, y] = tileId.split('_');
        let adjacentBlack = 0;
        for (const [dx, dy] of _directions) {
            if (blackTiles.has(`${+x + dx}_${+y + dy}`)) adjacentBlack++;
        }

        if (blackTiles.has(tileId)) {
            if (adjacentBlack === 1 || adjacentBlack === 2) next.add(tileId);
        }
        else {
            if (adjacentBlack === 2) next.add(tileId);
        }
    }

    blackTiles = next;
}

console.log('Part 2:', blackTiles.size);
