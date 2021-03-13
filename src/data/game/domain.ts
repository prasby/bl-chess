import { flatMap, range, chunk, uniqBy } from "lodash";

export const RAKIROUKA_STEP = 3;

export const BOARD_SIZE = 9;

export interface GameConclusion {
    type: "tron" | "mat";
    winner: Side;
};

export interface Coordinate {
    x: number;
    y: number;
}

export type FigureStrategy = (
    board: (number | string)[][],
    figuresMoved: { [key: string]: boolean },
    from: Coordinate,
    checkAttack: boolean,
) => Coordinate[];

export const TRON_ROW = 4;
export const TRON_POSITION = TRON_ROW * BOARD_SIZE + TRON_ROW;

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

export const checkTest = flatMap([
    [0, 0, 0, "bv-1", 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    // [0, 0, 0, "wkz", 0, 0, 0, 0, 0],
    [0, "wkz", 0, 0, 0, 0, "bl-1", 0, 0],
    ["br-1", 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, "bg-1", "bg-2", 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, "bkz"],
]);

export const promotionTest = ["wl-1",0,0,0,"wkz",0,0,"wg-2","wl-2","wr-1","br-3",0,0,"wr-5","wr-6",0,"wr-8","wr-9",0,0,0,0,0,0,0,0,0,0,0,0,"wr-4","wg-1",0,"wr-7",0,0,0,0,0,0,0,0,"bv-2",0,0,0,"br-2",0,"br-4","bg-1",0,0,0,0,0,"wkc",0,0,0,0,0,"br-8",0,"br-1",0,"wr-3","br-12","br-5","br-6",0,0,"br-9",0, 0,0,0,"bkz",0,0,0,0];
export const rakiroukaTest = ["wl-1",0,0,0,"wkz",0,"wv-2","wg-2","wl-2","wr-1",0,0,0,"wr-5","wr-6",0,"wr-8","wr-9",0,0,0,"wv-1",0,0,0,0,0,0,"wr-2","wr-3","wr-4","wg-1",0,"wr-7",0,0,0,0,0,0,0,0,"bv-2",0,0,0,"br-2","br-3","br-4","bg-1",0,0,0,0,0,"wkc",0,"bv-1",0,0,"wgt","br-8",0,"br-1",0,0,0,"br-5","br-6",0,0,"br-9","bl-1",0,0,0,"bkz",0,0,0,"bl-2"];
export const karanacyjaTest = ["wl-1","wg-1","wv-1","wkc","wkz",0,"wv-2","wg-2","wl-2","wr-1","wr-2","wr-3","wr-4",0,"wr-6","wr-7","wr-8","wr-9",0,0,0,0,0,0,0,0,0,0,0,0,"wgt","wr-5",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"bkz",0,0,0,0,0,0,0,0,"bkc","br-5",0, 0,0,0,"br-1","br-2","br-3","br-4",0,"br-6","br-7","br-8","br-9","bl-1","bg-1","bv-1",0,0,"bgt","bv-2","bg-2","bl-2"];
export const matTest = [0,"wg-1","wv-1","wkc","wkz",0,"wv-2","wg-2","wl-2","wl-1","wr-2","wr-3","wr-4",0,"wr-6","wr-7","wr-8","wr-9","wr-1",0,0,0,0,0,0,0,0,0,0,0,0,"wr-5",0,0,0,0,0,0,0,0,0,0,0,0,0,0,"wgt",0,"bkz","br-5",0,0,0,0,"br-1",0,0,0,0,0,0,0,0,"bl-1","br-2","br-3","bkc","br-22","br-6","br-7","br-8","br-9",0,"bg-1","br-26","br-23","br-24","bgt","br-25","bg-2","bl-2"];
export const checkTest2 = [0,"wg-1","wv-1","wkc","wkz",0,"wv-2","wg-2","wl-2","wl-1","wr-2","wr-3","wr-4",0,"wr-6","wr-7","wr-8","wr-9","wr-1",0,0,0,0,0,0,0,0,0,0,0,0,"wr-5",0,0,0,0,0,0,0,0,0,0,0,0,0,0,"wgt",0,"bkz","br-5",0,0,0,0,"br-1",0,0,0,0,0,0,0,0,"bl-1","br-2","br-3","bkc","br-22","br-6","br-7","br-8","br-9",0,"bg-1","br-26","br-23","br-24","bgt","br-25","bg-2","bl-2"];
export const karanacyjaMatTest = ["wl-1","wg-1","wv-1","wkc","wkz",0,"wv-2","wg-2","wl-2",0,"wr-2","wr-3","wr-4",0,"wr-6","wr-7","wr-8","wr-9","wr-1",0,0,0,0,0,0,0,0,0,0,0,0,"wr-5",0,0,0,0,0,0,0,0,0,0,0,0,0,0,"wgt",0,"bkz","br-5",0,0,0,0,"br-1",0,0,"bkc",0,0,0,0,0,"bl-1","br-2","br-3",0,"br-22","br-6","br-7","br-8","br-9",0,"bg-1","br-26","br-23","br-24","bgt","br-25","bg-2","bl-2"];

export const normalGame = flatMap([
    ["wl-1", "wv-1", "wg-1", "wgt", "wkz", "wkc", "wv-2", "wg-2", "wl-2"],
    ["wr-1", "wr-2", "wr-3", "wr-4", "wr-5", "wr-6", "wr-7", "wr-8", "wr-9"],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ["br-1", "br-2", "br-3", "br-4", "br-5", "br-6", "br-7", "br-8", "br-9"],
    ["bl-1", "bg-1", "bv-1", "bkc", "bkz", "bgt", "bg-2", "bv-2", "bl-2"],
]);

type Motion = { from: Coordinate; to: Coordinate };
type Promotion = { position: number; figureId: string };

export interface MotionDetails {
    motions: Motion[];
    promotions: Promotion[];
    beatenFields: Coordinate[];
}

export type GameField = (number | string)[];

export type FiguresMoved = { [key: string]: boolean };

export type Side = "b" | "w";

export interface GameStateSnapshot {
    conclusion?: GameConclusion;
    promotion?: { position: number, side: Side };
    field: GameField;
    karanacyjaHappened: boolean;
    activeSide: Side;
    figuresMoved: FiguresMoved;
};

export const normalizeCoord = ({ x, y }: Coordinate) =>
    y * BOARD_SIZE + x

export const denormalizeCoord = (pos: number): Coordinate => ({
    x: pos % BOARD_SIZE,
    y: Math.floor(pos / BOARD_SIZE),
});


export const getKniazychOf = (gameField: GameField, side: Side) =>
    gameField.findIndex(id => id === `${side}kc`);

export const getKniazOf = (gameField: GameField, side: Side) =>
    gameField.findIndex(id => id === `${side}kz`);

export const getMotionsDetails = (board: GameField, from: Coordinate, to: Coordinate): MotionDetails => {
    const figureId = board[normalizeCoord(from)] as string;
    const [figureType] = figureId.split("-");
    const motions = [{ from, to }];
    const beatenFields: Coordinate[] = [];
    const dx = to.x - from.x;
    // rakirouka
    if (["bkz", "wkz"].includes(figureType) && Math.abs(dx) === RAKIROUKA_STEP) {
        const laddziaX = dx > 0 ? BOARD_SIZE - 1 : 0;
        const beatStep = dx > 0 ? 1 : -1;
        for (let bx = from.x; bx !== to.x; bx += beatStep) {
            beatenFields.push({ y: from.y, x: bx });
        }
        motions.push({
            from: { x: laddziaX, y: from.y },
            to: { x: laddziaX + (dx > 0 ? -2 : 2), y: from.y },
        });
    }
    return { motions, beatenFields, promotions: [] };
};

export const getMissingFigures = (gameField: GameField, side: Side) => {
    const allFigures = {
        [`${side}g-1`]: false,
        [`${side}v-1`]: false,
        [`${side}l-1`]: false,
        [`${side}g-2`]: false,
        [`${side}v-2`]: false,
        [`${side}l-2`]: false,
        [`${side}gt`]: false,
        [`${side}kc`]: false,
        [`${side}kz`]: false,
    }
    for (let i = 0; i < gameField.length; i++) {
        if (allFigures[gameField[i]] === false) {
            allFigures[gameField[i]] = true;
        }
    }

    return uniqBy(
        Object.keys(allFigures)
            .filter(f => allFigures[f] === false),
        key => key.split("-")[0]
    );
    
};

// check tron
// export const defaultGameState: GameStateSnapshot = {"field":["wl-1","wv-1","wg-1","wgt",0,"wkc","wv-2",0,"wl-2","wr-1","wr-2","wr-3",0,"wr-5","wr-6","wr-7","wr-8","wg-2",0,0,0,0,0,0,0,0,"wr-9",0,0,0,"wr-4","wkz",0,0,0,0,"br-1",0,"bv-1",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"br-2","br-3","br-4","br-5","br-6","br-7","br-8","br-9","bl-1","bg-1",0,"bkc","bkz","bgt","bg-2","bv-2","bl-2"],"figuresMoved":{"wr-4":true,"br-1":true,"wkz":true,"bv-1":true,"wr-9":true,"wg-2":true},"activeSide":"w"};

// check test 2
// export const defaultGameState = {"field":[0,"wg-1","wv-1","wkc","wkz",0,"wv-2","wg-2","wl-2","wl-1","wr-2","wr-3","wr-4",0,"wr-6","wr-7","wr-8","wr-9","wr-1",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"wgt",0,0,0,"wr-5",0,0,0,0,"br-1",0,0,0,0,0,0,0,0,"bl-1","br-2","br-3","bkz","br-22","br-6","br-7","br-8","br-9",0,"bg-1","br-26","br-23","br-24","bgt","br-25","bg-2","bl-2"],"figuresMoved":{"wgt":true,"bkz":true,"wr-5":true},"activeSide":"b"};

// promotion no figures
// export const defaultGameState: GameStateSnapshot = {"field":["wl-1","wv-1","wg-1","wgt",0,"wkc","wv-2",0,"wl-2","wr-1","wr-2","wr-3",0,"wr-5",0,"wr-7","wr-8","wg-2",0,0,0,0,0,0,0,0,"wr-9",0,0,0,"wr-4","wkz",0,0,0,0,"br-1",0,"bv-1",0,0,0,0,0,0,0,"br-2",0,0,0,0,0,0,0,0,0,"br-3",0,0,0,0,0,0,0,0,0,"br-4",0,"wr-6","br-7","br-8","br-9","bl-1","bg-1",0,"bkc","bkz","bgt","bg-2","bv-2","bl-2"],"figuresMoved":{"wr-4":true,"br-1":true,"wkz":true,"bv-1":true,"wr-9":true,"wg-2":true,"wr-6":true,"br-5":true,"br-3":true,"br-2":true},"activeSide":"w"};

// promotion mat figures
// export const defaultGameState: GameStateSnapshot = {karanacyjaHappened: false, "field":["wl-1","wv-1","wg-1",0,0,"wkc","wv-2",0,"wl-2","wr-1","wr-2","wr-3",0,"wr-5",0,"wr-7","wr-8","wg-2",0,0,0,"bv-1",0,0,0,0,"wr-9",0,0,0,"wr-4","wkz",0,0,0,0,"br-1",0,0,0,0,0,0,0,0,0,"br-2",0,0,0,0,0,0,0,0,0,"br-3",0,0,0,0,0,0,0,0,0,"br-4",0,"wr-6","br-7","br-8","br-9","bl-1","bg-1",0,"bkc","bkz","bgt","bg-2","bv-2","bl-2"],"figuresMoved":{"wr-4":true,"br-1":true,"wkz":true,"bv-1":true,"wr-9":true,"wg-2":true,"wr-6":true,"br-5":true,"br-3":true,"br-2":true,"wgt":true},"activeSide":"w"}

// promotion rokash
// export const defaultGameState: GameStateSnapshot = {"karanacyjaHappened":false,"field":["wl-1","wv-1","wg-1",0,"wkc",0,"wv-2",0,"wl-2",0,"wr-2","wr-3",0,"wr-5",0,"wr-7","wr-8","wg-2","wr-1",0,0,0,"wkz",0,0,0,"wr-9",0,0,0,0,0,0,0,0,0,"br-1",0,"bv-1","wr-4","bkz",0,0,0,0,0,"br-2",0,0,0,0,0,0,0,0,0,"br-3",0,0,0,0,0,0,0,0,0,"br-4",0,"wr-6","br-7","br-8","br-9","bl-1","bg-1",0,"bkc","bgt",0,"bg-2","bv-2","bl-2"],"figuresMoved":{"wr-4":true,"br-1":true,"wkz":true,"bv-1":true,"wr-9":true,"wg-2":true,"wr-6":true,"br-5":true,"br-3":true,"br-2":true,"wgt":true,"bkz":true,"wkc":true,"bgt":true,"wr-1":true},"activeSide":"w"};

// promotion tron
export const defaultGameState: GameStateSnapshot = {"karanacyjaHappened":false,"field":[0,"wv-1","wg-1",0,0,"wl-2",0,0,0,"wl-1","wr-2",0,"br-7",0,0,"wr-7","wr-8","wg-2","wr-1",0,"wr-3",0,0,0,0,0,0,"bv-1",0,0,0,0,0,0,0,0,"br-1","br-2",0,"wr-4",0,0,"wkz",0,"wr-9",0,0,0,"bkz",0,0,0,0,0,0,0,"br-3",0,0,0,0,0,0,0,0,0,"br-4",0,"wr-6",0,"br-8","br-9","bl-1","bg-1",0,"bkc",0,"wgt","bg-2","bv-2","bl-2"],"figuresMoved":{"wr-4":true,"br-1":true,"wkz":true,"bv-1":true,"wr-9":true,"wg-2":true,"wr-6":true,"br-5":true,"br-3":true,"br-2":true,"wgt":true,"bkz":true,"wkc":true,"bgt":true,"wr-1":true,"wr-3":true,"wv-2":true,"br-7":true,"wr-5":true,"wl-2":true,"wl-1":true},"activeSide":"b"};

// export const defaultGameState: GameStateSnapshot = {
//     field: normalGame,
//     activeSide: "w",
//     figuresMoved: {},
//     conclusion: undefined,
// };

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
    if (nextY === BOARD_SIZE || nextY === -1) {
        return positions;
    }
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
    ATTACK,
}

export const isTron = ({ x, y }: Coordinate) =>
    x === TRON_ROW && y === TRON_ROW;

export const isValidDestination = (side: Side, board: (number | string)[][], { x, y }: Coordinate) => {
    if (!(inBounds(x) && inBounds(y))) {
        return false;
    }
    return board[y][x] === 0 || (getSide(board[y][x] as string) !== side);
};

const moveInDirection = (board: (string | number)[][], side: Side, { x, y }: Coordinate, mX: number, mY: number, tronPolicy: TronPolicy, limit = -1, checkAttack: boolean = false) => {
    const positions: Coordinate[] = [];
    for (let i = 1; limit === -1 || i <= limit; i++) {
        const dX = i * mX;
        const dY = i * mY;
        const dest = { x: x + dX, y: y + dY };
        if (isTron(dest)) {
            // switch-case overrides `break`, do not refactor :)
            if (tronPolicy === TronPolicy.BLOCK) {
                if (checkAttack) {
                    positions.push(dest);
                }
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

const garmata = (limit: number = -1, tronPolicy: TronPolicy = TronPolicy.BLOCK): FigureStrategy =>
    (board, figuresMoved, coord, checkAttack) => {
        const side = getSide(board[coord.y][coord.x] as string);
        return [
            ...moveInDirection(board, side, coord, -1, -1, tronPolicy, limit, checkAttack),
            ...moveInDirection(board, side, coord, -1, 1, tronPolicy, limit, checkAttack),
            ...moveInDirection(board, side, coord, 1, -1, tronPolicy, limit, checkAttack),
            ...moveInDirection(board, side, coord, 1, 1, tronPolicy, limit, checkAttack),
        ];
    };

const vaukalak: FigureStrategy = (board, figuresMoved, { x, y }, checkAttack) => {
    const positions: Coordinate[] = [];
    const side = getSide(board[y][x] as string);
    const addIfValid = (dx: number, dy: number) => {
        const destination = { x: x - dx, y: y - dy };
        if (isValidDestination(side, board, destination)) {
            if (!isTron(destination) || checkAttack) {
                positions.push(destination);
            }
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

const laddzia = (limit: number = -1, tronPolicy: TronPolicy = TronPolicy.BLOCK): FigureStrategy =>
    (board, figuresMoved, coord, checkAttack) => {
        const side = getSide(board[coord.y][coord.x] as string);
        return [
            ...moveInDirection(board, side, coord, 0, -1, tronPolicy, limit, checkAttack),
            ...moveInDirection(board, side, coord, 0, 1, tronPolicy, limit, checkAttack),
            ...moveInDirection(board, side, coord, -1, 0, tronPolicy, limit, checkAttack),
            ...moveInDirection(board, side, coord, 1, 0, tronPolicy, limit, checkAttack),
        ];
    };

const getman: FigureStrategy = (board, figuresMoved, coord, checkAttack) => {
    return [
        ...laddzia()(board, figuresMoved, coord, checkAttack),
        ...garmata()(board, figuresMoved, coord, checkAttack),
    ];
};

const kniaz: FigureStrategy = (board, figuresMoved, coord, checkAttack) => {
    const moveMotions = [
        ...laddzia(1, TronPolicy.STEP)(board, figuresMoved, coord, checkAttack),
        ...garmata(1, TronPolicy.STEP)(board, figuresMoved, coord, checkAttack),
    ];
    const figureId = board[coord.y][coord.x] as string;
    // we check position cause knizhych might be promoted
    if (!figuresMoved[figureId] && coord.x === TRON_ROW) {
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

const kniazhych: FigureStrategy = (board, figuresMoved, coord, checkAttack) => {
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
        ...laddzia(2, tronPolicy)(board, figuresMoved, coord, checkAttack),
        ...garmata(2, tronPolicy)(board, figuresMoved, coord, checkAttack),
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

export const getRatnikPositionToPromote = (gameField: GameField, side: Side) => {
    const rowIndex = side === "w" ? BOARD_SIZE - 1 : 0;
    const row = chunk(gameField, BOARD_SIZE)[rowIndex];
    const colIndex = row.findIndex(f => f.toString().indexOf(`${side}r`) === 0);
    if (colIndex === -1) {
        return -1;
    } else {
        return rowIndex * BOARD_SIZE + colIndex;
    }
};

export const hasRatnikToPromote = (gameField: GameField, side: Side) => {
    const position = getRatnikPositionToPromote(gameField, side);
    return position !== -1;
};

export const checkTronConfirmed = (
    side: Side,
    gameField: GameField,
    oldGameField: GameField
): GameConclusion | undefined => {
    if (onTron(gameField, side) && onTron(oldGameField, side)) {
        return { type: "tron", winner: side };
    }
    return undefined;
}

export const getGameConclusion = (
    gameState: GameStateSnapshot,
    oldGameState: GameStateSnapshot,
    side: Side
): GameConclusion | undefined => {
    const oppositeSide = getOppositeSide(side);
    const tron = checkTronConfirmed(side, gameState.field, oldGameState.field);
    if (tron) {
        return tron;
    }
    if (gameState.karanacyjaHappened && isUnderCheck(gameState, oppositeSide)) {
        return { type: "mat", winner: side };
    } else {
        const availableOpponentMotions = getAllAvailableMotions(gameState, oppositeSide);
        return availableOpponentMotions.length === 0 ?
            { type: "mat", winner: side } :
            undefined;
    }
}

export const computeNewGameState = (gameState: GameStateSnapshot, details: MotionDetails): GameStateSnapshot => {
    const newGameField = [...gameState.field];
    const justMovedFigures: { [key: string]: boolean } = {};
    details.motions.forEach((motion) => {
        const prevPos = normalizeCoord(motion.from);
        const newPos = normalizeCoord(motion.to);
        justMovedFigures[gameState.field[prevPos]] = true;
        newGameField[newPos] = newGameField[prevPos];
        newGameField[prevPos] = 0;
    });
    details.promotions.forEach((promotion) => {
        newGameField[promotion.position] = promotion.figureId;
    });
    const oppositeSide = getOppositeSide(gameState.activeSide);
    let newActiveSide = oppositeSide;
    const kniazPosition = getKniazOf(newGameField, oppositeSide);
    let karanacyjaHappened = false;
    if (kniazPosition === -1) {
        karanacyjaHappened = true;
        newActiveSide = gameState.activeSide;
        const position = getKniazychOf(newGameField, oppositeSide);
        newGameField[position] = `${oppositeSide}kz`;
    }
    const newFiguresMoved = {
        ...gameState.figuresMoved,
        ...justMovedFigures,
    };
    return {
        ...gameState,
        karanacyjaHappened,
        field: newGameField,
        figuresMoved: newFiguresMoved,
        activeSide: newActiveSide,
    }
}

export const needKaranacyja = ({ field, activeSide}: GameStateSnapshot) => {
    return getKniazOf(field, getOppositeSide(activeSide)) === -1;
};

export const getFiguresOf = (gameField: GameField, side: Side): number[] => {
    const result = [];
    for (let i = 0; i < gameField.length; i++) {
        const entry = gameField[i];
        if (typeof entry === "string" && getSide(entry) === side) {
            result.push(i);
        }
    }
    return result;
};

export const getAllAvailableMotions = (gameState: GameStateSnapshot, side: Side) => {
    const oppFigures = getFiguresOf(gameState.field, side);
    return oppFigures.flatMap(
        oppPosition => {
            const oppCoordinate = denormalizeCoord(oppPosition);
            return getAvailableMotions(gameState, oppCoordinate, false);
        }
    );
};

export const isPositionAttacked = (gameState: GameStateSnapshot, side: Side, position: number) => {
    if (position !== -1) {
        const oppFigures = getFiguresOf(gameState.field, getOppositeSide(side));
        return oppFigures.find(
            oppPosition => {
                const oppCoordinate = denormalizeCoord(oppPosition);
                const oppMotions = getAvailableMotions(gameState, oppCoordinate, true);
                return oppMotions.find(motion => {
                    return normalizeCoord(motion) === position;
                });
            }
        )
    }
    return false;
}

export const isUnderRokash = (gameState: GameStateSnapshot, side: Side) => {
    const tronValue = gameState.field[TRON_POSITION];
    if (typeof tronValue !== "string") {
        return false;
    }
    return getSide(tronValue) === side &&
        isPositionAttacked(gameState, side, TRON_POSITION);
};

export const isUnderCheck = (gameState: GameStateSnapshot, side: Side) => {
    const kniazhychPosition = getKniazychOf(gameState.field, side);
    if (kniazhychPosition !== -1) {
        return false;
    }
    const kniazPosition = getKniazOf(gameState.field, side);
    return isPositionAttacked(gameState, side, kniazPosition);
};

export const onTron = (gameField: GameField, side: Side) => {
    return [`${side}kz`, `${side}kc`].includes(gameField[TRON_POSITION].toString());
};

export const onUnattackedTron = (gameState: GameStateSnapshot, oldGameState: GameStateSnapshot, side: Side) => {
    if (!onTron(gameState.field, side)) {
        return false;
    }
    if (isPositionAttacked(gameState, side, TRON_POSITION)) {
        return false;
    }
    const oppositeSide = getOppositeSide(side);
    const canPromoteInOneStep = hasRatnikToPromote(gameState.field, oppositeSide) && !hasRatnikToPromote(oldGameState.field, oppositeSide);
    if (canPromoteInOneStep) {
        const missingFigures = getMissingFigures(gameState.field, oppositeSide);
        const promotePosition = getRatnikPositionToPromote(gameState.field, oppositeSide);
        for (const figure of missingFigures) {
            const fieldWithPromotion = gameState.field.concat();
            fieldWithPromotion[promotePosition] = figure;
            const gameStateWithPromotion = {
                ...gameState,
                field: fieldWithPromotion,
            }
            if (isPositionAttacked(gameStateWithPromotion, side, TRON_POSITION)) {
                return false;
            }
        }
    }
            
    return true;
};

export const getAvailableMotions = (gameState: GameStateSnapshot, from: Coordinate, checkAttack: boolean) => {
    const { field, figuresMoved } = gameState;
    const figureId = field[normalizeCoord(from)] as string;
    const denormalizedBoard = chunk(field, BOARD_SIZE);
    const [figureType] = figureId.split("-");
    const rules = figuresToRules[figureType];
    const availableMotions = rules(denormalizedBoard, figuresMoved, from, checkAttack);
    return checkAttack ?
        availableMotions :
        availableMotions.filter(to => {
            const outcomes = getMotionsDetails(field, from, to);
            const newGameState = computeNewGameState(gameState, outcomes);
            const activeSide = getSide(figureId);
            const invalidRakirouka = outcomes.beatenFields.find((coord) => {
                return isPositionAttacked(newGameState, getSide(figureId), normalizeCoord(coord));
            });
            if (invalidRakirouka) {
                return false;
            }
            const underCheck = isUnderCheck(newGameState, activeSide);
            const underRokash = isUnderRokash(newGameState, activeSide);
            const opponentOnUnattackedTron = onUnattackedTron(newGameState, gameState, getOppositeSide(activeSide));
            const checkKaranacyja = getKniazOf(newGameState.field, activeSide) === -1;
            if (underCheck || underRokash || checkKaranacyja || opponentOnUnattackedTron) {
                return false;
            }
            return true;
        });
};

export const isMotionValid = (gameState: GameStateSnapshot, from: Coordinate, to: Coordinate) => {
    const { field, activeSide, figuresMoved } = gameState;
    const figureId = field[normalizeCoord(from)] as string;
    const side = getSide(figureId);
    if (side !== activeSide) {
        return false;
    }
    if (from.x === to.x && from.y === to.y) {
        return false;
    }
    const denormalizedBoard = chunk(field, BOARD_SIZE);
    if (!isValidDestination(side, denormalizedBoard, to)) {
        return false;
    }
    const availableMotions = getAvailableMotions(gameState, from, false);
    if (!availableMotions.find(({ x, y }) => x === to.x && y === to.y)) {
        return false;
    }
    return true;
}