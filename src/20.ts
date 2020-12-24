import { readInput } from './utils';

const rawTiles = readInput(20).split('\r\n\r\n');

// Part 1
const parseTile = (raw: string) => {
    const [head, ...lines] = raw.split('\r\n');
    const [_, id] = head.match(/Tile (\d+)/);

    const edges = [
        lines[0],
        lines[lines.length - 1],
    ];

    for (let y of [0, lines.length - 1]) {
        let edge = '';
        for (let x = 0; x < lines[0].length; x++) {
            edge += lines[x][y];
        }
        edges.push(edge);
    }

    const binary = edges.map(e => e.split('').reverse().reduce((sum, v, i) => sum + (v === '#' ? Math.pow(2, i) : 0), 0));

    return {
        id: +id,
        edges,
        binary,
    };
};

const tiles = rawTiles.map(parseTile);
console.log(tiles);

/**
 *  A            -D
 * B C  rot180 -C  -B   
 *  D            -A
 * 
 *  A           
 * B C  rot90   
 *  D
 * 
 * #.#.#####.  702
 * .#.#.....#  321 = 1024 - 702 - 1
 */