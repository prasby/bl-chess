import { flatMap, range } from "lodash";

export const RAKIROUKA_STEP = 3;

export const BOARD_SIZE = 9;


export interface Coordinate {
    x: number;
    y: number;
}

export type FigureStrategy = (
    board: (number | string)[][],
    figuresMoved: { [key: string]: boolean },
    from: Coordinate
) => Coordinate[];

export const figuresToIcons: { [key: string]: string } = {
    wr: "\u2659",
    wg: "\u2657",
    wv: "\u2658",
    wl: "\u2656",
    wgt: "\u2660",
    wkc: "\u2655",
    wkz: "\u2654",
    br: "\u2659",
    bg: "\u2657",
    bv: "\u2658",
    bl: "\u2656",
    bgt: "\u2660",
    bkc: "\u2655",
    bkz: "\u2654",
};

export const defaultGameField = flatMap([
    ["wl-1", "wg-1", "wv-1", "wkc", "wkz", "wgt", "wv-2", "wg-2", "wl-2"],
    // ["wl-1", 0, 0, 0, "wkz", 0, 0, 0, "wl-2"],
    ["wr-1", "wr-2", "wr-3", "wr-4", "wr-5", "wr-6", "wr-7", "wr-8", "wr-9"],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ["br-1", "br-2", "br-3", "br-4", "br-5", "br-6", "br-7", "br-8", "br-9"],
    ["bl-1", "bg-1", "bv-1", "bkc", "bkz", "bgt", "bv-2", "bg-2", "bl-2"],
    // ["bl-1", 0, 0, 0, "bkz", 0, 0, 0, "bl-2"],
]);

export const defaultMovedFigures: { [key: string]: boolean } = {};

export type Side = "b" | "w";

export const getSide = (figure: string): Side => {
  return figure.charAt(0) as Side;
};

export const getOppositeSide = (figure: Side): Side => {
    return getSide(figure.charAt(0)) === "w" ? "b" : "w";
};

const isPieceOfSide = (side: "b" | "w", figure: string | number) => {
  if (typeof figure !== "string") {
    return false;
  }
  return figure.charAt(0) === side;
};

const whiteRatnik: FigureStrategy = (board, figuresMoved, { x, y }) => {
    const positions: Coordinate[] = [];
    const nextY = y + 1;
    if (board[nextY][x] === 0) {
        positions.push({ x, y: nextY });
        const secondNextY = y + 2;
        if (y === 1 && board[secondNextY][x] === 0) {
            positions.push({ x, y: secondNextY });
        }
    }
    if (x > 0 && isPieceOfSide("b", board[nextY][x - 1])) {
        positions.push({ x: x - 1, y: nextY });
    }
    if (x < BOARD_SIZE - 1 && isPieceOfSide("b", board[nextY][x + 1])) {
        positions.push({ x: x + 1, y: nextY });
    }
    return positions;
};

const blackRatnik: FigureStrategy = (board, figuresMoved, { x, y }) => {
    const positions: Coordinate[] = [];
    const nextY = y - 1;
    if (board[nextY][x] === 0) {
        positions.push({ x, y: nextY });
        const secondNextY = y - 2;
        if (y === BOARD_SIZE - 2 && board[secondNextY][x] === 0) {
            positions.push({ x, y: secondNextY });
        }
    }
    if (x > 0 && isPieceOfSide("w", board[nextY][x - 1])) {
        positions.push({ x: x - 1, y: nextY });
    }
    if (x < BOARD_SIZE - 1 && isPieceOfSide("w", board[nextY][x + 1])) {
        positions.push({ x: x + 1, y: nextY });
    }
    return positions;
};

const inBounds = (value: number) => value >= 0 && value < BOARD_SIZE;

export const isValidDestination = (side: Side, board: (number | string)[][], { x, y }: Coordinate) => {
    if (!(inBounds(x) && inBounds(y))) {
        return false;
    }
    return board[y][x] === 0 || (getSide(board[y][x] as string) !== side);
};

const moveInDirection = (board: (string | number)[][], side: Side, { x, y }: Coordinate, mX: number, mY: number, limit = -1) => {
    const positions: Coordinate[] = [];
    for (let i = 1; limit === -1 || i <= limit; i++) {
        const dX = i * mX;
        const dY = i * mY;
        const dest = { x: x + dX, y: y + dY };
        if (!isValidDestination(side, board, dest)) {
            break;
        }
        positions.push(dest);
        if (board[y + dY][x + dX] !== 0) {
            break;
        }
    }
    return positions;
}

const garmata = (limit: number = -1): FigureStrategy => (board, figuresMoved, coord) => {
    const side = getSide(board[coord.y][coord.x] as string);
    return [
        ...moveInDirection(board, side, coord, -1, -1, limit),
        ...moveInDirection(board, side, coord, -1, 1, limit),
        ...moveInDirection(board, side, coord, 1, -1, limit),
        ...moveInDirection(board, side, coord, 1, 1, limit),
    ];
};

const vaukalak: FigureStrategy = (board, figuresMoved, { x, y }) => {
    const positions: Coordinate[] = [];
    const side = getSide(board[y][x] as string);
    const addIfValid = (dx: number, dy: number) => {
        if (isValidDestination(side, board, { x: x - dx, y: y - dy })) {
            positions.push({ x: x - dx, y: y - dy });
        }
    }
    addIfValid(1, 2);
    addIfValid(2, 1);
    addIfValid(1, -2);
    addIfValid(2, -1);
    addIfValid(-1, 2);
    addIfValid(-2, 1);
    addIfValid(-1, -2);
    addIfValid(-2, -1);
    return positions;
};

const laddzia = (limit: number = -1): FigureStrategy => (board, figuresMoved, coord) => {
    const side = getSide(board[coord.y][coord.x] as string);
    return [
        ...moveInDirection(board, side, coord, 0, -1, limit),
        ...moveInDirection(board, side, coord, 0, 1, limit),
        ...moveInDirection(board, side, coord, -1, 0, limit),
        ...moveInDirection(board, side, coord, 1, 0, limit),
    ];
};

const getman: FigureStrategy = (board, figuresMoved, coord) => {
    return [
        ...laddzia()(board, figuresMoved, coord),
        ...garmata()(board, figuresMoved, coord),
    ];
};

const kniaz: FigureStrategy = (board, figuresMoved, coord) => {
    const moveMotions = [
        ...laddzia(1)(board, figuresMoved, coord),
        ...garmata(1)(board, figuresMoved, coord),
    ];
    const figureId = board[coord.y][coord.x] as string;
    if (!figuresMoved[figureId]) {
        const leftLaddziaId = board[coord.y][0];
        const leftPathFree = !range(1, coord.x - 1).find(x => board[coord.y][x] !== 0)
        if (leftPathFree && typeof leftLaddziaId === "string" && !figuresMoved[leftLaddziaId]) {
            moveMotions.push({ x: coord.x - RAKIROUKA_STEP, y: coord.y });
        }
        const rightPathFree = !range(coord.x + 1, BOARD_SIZE - 1).find(x => board[coord.y][x] !== 0)
        const rightLaddziaId = board[coord.y][BOARD_SIZE - 1];
        if (rightPathFree && typeof rightLaddziaId === "string" && !figuresMoved[rightLaddziaId]) {
            moveMotions.push({ x: coord.x + RAKIROUKA_STEP, y: coord.y });
        }
    }
    return moveMotions;
};

const kniazhych: FigureStrategy = (board, figuresMoved, coord) => {
    return [
        ...laddzia(2)(board, figuresMoved, coord),
        ...garmata(2)(board, figuresMoved, coord),
    ];
};

export const figuresToRules: { [key: string]: FigureStrategy } = {
    wr: whiteRatnik,
    wg: garmata(),
    wv: vaukalak,
    wl: laddzia(),
    wgt: getman,
    wkc: kniazhych,
    wkz: kniaz,
    br: blackRatnik,
    bg: garmata(),
    bv: vaukalak,
    bl: laddzia(),
    bgt: getman,
    bkc: kniazhych,
    bkz: kniaz,
};