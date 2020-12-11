import {readInput} from './utils';

const input = readInput(11).split('\r\n');

enum Tile {
    Floor = '.',
    Empty = 'L',
    Occupied = '#',
}

type Grid = Tile[][];

// Part 1
const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
];

const countAdjacentOccupied = (grid: Grid, lineIdx: number, tileIdx: number) =>
    directions.reduce((acc, [dx, dy]) => acc + (grid[lineIdx + dy] && grid[lineIdx + dy][tileIdx + dx] === Tile.Occupied ? 1 : 0), 0);

const nextGenerationPart1 = (current: Grid) => {
    return current.map((line, lineIdx) => line.map((tile, tileIdx) => {
        switch (tile) {
            case Tile.Floor:
                return Tile.Floor;
            case Tile.Empty:
                return countAdjacentOccupied(current, lineIdx, tileIdx) === 0
                    ? Tile.Occupied
                    : Tile.Empty;
            case Tile.Occupied:
                return countAdjacentOccupied(current, lineIdx, tileIdx) >= 4
                    ? Tile.Empty
                    : Tile.Occupied;
            default:
                throw new Error(`Unexpected tile ${tile}`);
        }
    }));
};

const notEqual = (a: Grid, b: Grid) => a.some((line, y) => line.some((tile, x) => tile !== b[y][x]));

const stabilize = (grid: Grid, evolve: (grid: Grid) => Grid) => {
    let last: Grid;
    do {
        last = grid;
        grid = evolve(grid);
    } while (notEqual(grid, last));

    return grid;
};

const seed = input.map(line => line.split('') as Tile[]);
const stable = stabilize(seed, nextGenerationPart1);

const countOccupied = (grid: Grid) => grid.reduce((acc, line) => acc + line.filter(tile => tile === Tile.Occupied).length, 0);

console.log('Part 1', countOccupied(stable));

// Part 2
const buildVisibilityMap = (grid: Grid): number[][] => {
    const visibility = Array.from(
        {length: grid[0].length},
        () => Array.from(
            {length: grid.length},
            () => 0
        )
    );

    grid.forEach((line, lineIdx) =>
        line.forEach((tile, tileIdx) => {
            if (tile === Tile.Floor) return;

            directions.forEach(([dx, dy]) => {
                let x = tileIdx;
                let y = lineIdx;

                while (true) {
                    x += dx;
                    y += dy;

                    if (!grid[y] || !grid[y][x]) break;

                    switch (grid[y][x]) {
                        case Tile.Occupied:
                            visibility[tileIdx][lineIdx]++;
                            return;
                        case Tile.Empty:
                            return; // empty seat blocks site
                        case Tile.Floor:
                            break; // keep looking behind floor tile
                        default:
                            throw new Error(`Unexpected tile ${tile}`);
                    }
                }
            });
        })
    );

    return visibility;
};

const nextGenerationPart2 = (current: Grid) => {
    const visibility = buildVisibilityMap(current);

    return current.map((line, lineIdx) =>
        line.map((tile, tileIdx) => {
            switch (tile) {
                case Tile.Floor:
                    return tile;
                case Tile.Empty:
                    return visibility[tileIdx][lineIdx] === 0
                        ? Tile.Occupied
                        : Tile.Empty;
                case Tile.Occupied:
                    return visibility[tileIdx][lineIdx] >= 5
                        ? Tile.Empty
                        : Tile.Occupied;
                default:
                    throw new Error(`Unexpected tile ${tile}`);
            }
        })
    );
};

console.log('Part 2:', countOccupied(stabilize(seed, nextGenerationPart2)));
