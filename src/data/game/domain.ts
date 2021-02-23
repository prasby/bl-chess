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

export const TRON_POSITION = 4;

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

export const tronTest = flatMap([
    ["wl-1", "wg-1", "wv-1", 0, "wgt", 0, "wv-2", "wg-2", "wl-2"],
    ["wr-1", 0, 0, 0, 0, 0, 0, 0, "wr-2"],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    // [0, 0, 0, "wkz", 0, 0, 0, 0, 0],
    [0, "wkz", 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, "wkc", 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ["br-1", "br-2", "br-3", "br-4", "br-5", "br-6", "br-7", "br-8", "br-9"],
    ["bl-1", "bg-1", "bv-1", "bkc", "bkz", "bgt", "bv-2", "bg-2", "bl-2"],
]);

export const normalGame = flatMap([
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

export const defaultGameField = tronTest;

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
    const nextCoord = { x, y: nextY };
    if (board[nextY][x] === 0 && !isTron(nextCoord)) {
        positions.push({ x, y: nextY });
        const secondNextY = y + 2;
        const secondNextCoord = { x, y: y + 2 };
        if (y === 1 && board[secondNextY][x] === 0 && !isTron(secondNextCoord)) {
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
    if (board[nextY][x] === 0 && !isTron({ x, y: nextY })) {
        positions.push({ x, y: nextY });
        const secondNextY = y - 2;
        const secondNextCoord = { x, y: secondNextY };
        if (y === BOARD_SIZE - 2 && board[secondNextY][x] === 0 && !isTron(secondNextCoord)) {
            positions.push(secondNextCoord);
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

enum TronPolicy {
    STEP,
    SKIP,
    BLOCK,
}

export const isTron = ({ x, y }: Coordinate) =>
    x === TRON_POSITION && y === TRON_POSITION;

export const isValidDestination = (side: Side, board: (number | string)[][], { x, y }: Coordinate) => {
    if (!(inBounds(x) && inBounds(y))) {
        return false;
    }
    return board[y][x] === 0 || (getSide(board[y][x] as string) !== side);
};

const moveInDirection = (board: (string | number)[][], side: Side, { x, y }: Coordinate, mX: number, mY: number, tronPolicy: TronPolicy, limit = -1) => {
    const positions: Coordinate[] = [];
    for (let i = 1; limit === -1 || i <= limit; i++) {
        const dX = i * mX;
        const dY = i * mY;
        const dest = { x: x + dX, y: y + dY };
        if (isTron(dest)) {
            // switch-case overrides `break`, do not refactor :)
            if (tronPolicy === TronPolicy.BLOCK) {
                break;
            }
            if (tronPolicy === TronPolicy.SKIP) {
                continue;
            }
        }
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

const garmata = (limit: number = -1, tronPolicy: TronPolicy = TronPolicy.BLOCK): FigureStrategy => (board, figuresMoved, coord) => {
    const side = getSide(board[coord.y][coord.x] as string);
    return [
        ...moveInDirection(board, side, coord, -1, -1, tronPolicy, limit),
        ...moveInDirection(board, side, coord, -1, 1, tronPolicy, limit),
        ...moveInDirection(board, side, coord, 1, -1, tronPolicy, limit),
        ...moveInDirection(board, side, coord, 1, 1, tronPolicy, limit),
    ];
};

const vaukalak: FigureStrategy = (board, figuresMoved, { x, y }) => {
    const positions: Coordinate[] = [];
    const side = getSide(board[y][x] as string);
    const addIfValid = (dx: number, dy: number) => {
        const destination = { x: x - dx, y: y - dy };
        if (isValidDestination(side, board, destination) && !isTron(destination)) {
            positions.push(destination);
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

const laddzia = (limit: number = -1, tronPolicy: TronPolicy = TronPolicy.BLOCK): FigureStrategy => (board, figuresMoved, coord) => {
    const side = getSide(board[coord.y][coord.x] as string);
    return [
        ...moveInDirection(board, side, coord, 0, -1, tronPolicy, limit),
        ...moveInDirection(board, side, coord, 0, 1, tronPolicy, limit),
        ...moveInDirection(board, side, coord, -1, 0, tronPolicy, limit),
        ...moveInDirection(board, side, coord, 1, 0, tronPolicy, limit),
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
        ...laddzia(1, TronPolicy.STEP)(board, figuresMoved, coord),
        ...garmata(1, TronPolicy.STEP)(board, figuresMoved, coord),
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
    const side = getSide(board[coord.y][coord.x] as string);
    let kniazInPalac = false;
    for (let i = 2; i < 7; i++) {
        for (let j = 2; j < 7; j++) {
            if (board[i][j] === `${side}kz`) {
                kniazInPalac = true;
                break;
            }
        }
    }
    const tronPolicy = kniazInPalac ? TronPolicy.STEP : TronPolicy.SKIP;
    return [
        ...laddzia(2, tronPolicy)(board, figuresMoved, coord),
        ...garmata(2, tronPolicy)(board, figuresMoved, coord),
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