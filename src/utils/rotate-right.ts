export const rotateRight = ([x, y]: [number, number], deg: number): [number, number] => {
    switch (deg) {
        case 90: return [y, -x];
        case 180: return [-x, -y];
        case 270: return [-y, x];
        default:
            throw new Error(`Rotations other than 90/180/270 degrees are not supported (got ${deg})`);
    }
};
