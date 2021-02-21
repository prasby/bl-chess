import React, { useEffect, useMemo, useRef, useState } from "react";
import { useHandler } from "react-use-handler";
import * as Styles from "./Game.styles";
import { times, flatMap, chunk } from "lodash";
import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";

const figuresToIcons: { [key: string]: string } = {
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

const defaultGameField = flatMap([
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

const RAKIROUKA_STEP = 3;

const defaultMovedFigures: { [key: string]: boolean } = {};

interface Coordinate {
    x: number;
    y: number;
}

type Side = "b" | "w";

const getSide = (figure: string): Side => {
  return figure.charAt(0) as Side;
};

const getOppositeSide = (figure: Side): Side => {
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

const isValidDestination = (side: Side, board: (number | string)[][], { x, y }: Coordinate) => {
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
        if (typeof leftLaddziaId === "string" && !figuresMoved[leftLaddziaId]) {
            moveMotions.push({ x: coord.x - RAKIROUKA_STEP, y: coord.y });
        }
        const rightLaddziaId = board[coord.y][BOARD_SIZE - 1];
        if (typeof rightLaddziaId === "string" && !figuresMoved[rightLaddziaId]) {
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

const figuresToRules: { [key: string]: FigureStrategy } = {
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

interface FigureProps extends Coordinate {
    cell: string;
    enabled: boolean;
    onSuggestRequest(from: Coordinate): void;
    onMotionRequest(from: Coordinate, to: Coordinate): boolean;
}

const useDragHandler = (
    coordinates: { x: number; y: number },
    positions: { x: BehaviorSubject<number>; y: BehaviorSubject<number>, zIndex: BehaviorSubject<number> },
    onMotionRequest: (from: Coordinate, to: Coordinate) => boolean,
    onSuggestRequest: (from: Coordinate) => void,
) => {
    const isDown = useRef<boolean>(false);
    const movePosition = useRef<Coordinate>({ x: 0, y: 0});
    useEffect(() => {
        const setMouseUp = () => {
            if (isDown.current) {
                isDown.current = false;
                positions.zIndex.next(0);
                if (!onMotionRequest(coordinates, movePosition.current)) {
                    positions.x.next(coordinates.x);
                    positions.y.next(coordinates.y);
                }
            }
        };
        const move = (e: MouseEvent) => {
            if (isDown.current) {
                const motionX = (e.clientX) / Styles.CELL_SIZE;
                const motionY = (e.clientY) / Styles.CELL_SIZE;
                movePosition.current = {
                    x: Math.floor(motionX),
                    y: Math.floor(motionY),
                }
                positions.x.next(motionX - 0.5);
                positions.y.next(motionY - 0.5);
            }
        };
        document.addEventListener("mouseup", setMouseUp);
        document.addEventListener("mousemove", move);
        return () => {
            document.removeEventListener("mousemove", move);
            document.removeEventListener("mouseup", setMouseUp);
        }
    }, [coordinates]);
    return useHandler(() => {
        onSuggestRequest(coordinates);
        isDown.current = true;
        positions.zIndex.next(1000);
        movePosition.current = {
            x: Math.floor(coordinates.x),
            y: Math.floor(coordinates.y),
        }
    });
};

const Figure = ({ x, y, enabled, cell, onMotionRequest, onSuggestRequest }: FigureProps) => {
    const white = (cell as string).charAt(0) === "w";
    const positions = useMemo(() => ({
        x: new BehaviorSubject(x),
        y: new BehaviorSubject(y),
        zIndex: new BehaviorSubject(0),
    }), []);
    useEffect(() => {
        positions.x.next(x);
        positions.y.next(y);
    }, [x, y]);
    const coordinates = useMemo(() => ({ x, y }), [x, y]);
    const onMouseDown = useDragHandler(coordinates, positions, onMotionRequest, onSuggestRequest);
    return (
        <Styles.FigureContainer
            enabled={enabled}
            style={{
                top: positions.y.pipe(map(v => `${v * Styles.CELL_SIZE}px`)),
                left: positions.x.pipe(map(v => `${v * Styles.CELL_SIZE}px`)),
                zIndex: positions.zIndex,
            }}
            onMouseDown={onMouseDown}
        >
            <Styles.Figure
                white={white}
            >
                <Styles.FigureIcon white={white}>
                    {figuresToIcons[cell.split("-")[0]]}
                </Styles.FigureIcon>
            </Styles.Figure>
        </Styles.FigureContainer>
    )
}

type FigureStrategy = (
    board: (number | string)[][],
    figuresMoved: { [key: string]: boolean },
    from: Coordinate
) => Coordinate[];

const { BOARD_SIZE } = Styles;

const normalizeCoord = ({ x, y }: Coordinate) =>
    y * Styles.BOARD_SIZE + x

const denormalizeCoord = (pos: number): Coordinate => ({
    x: pos % Styles.BOARD_SIZE,
    y: Math.floor(pos / Styles.BOARD_SIZE),
});

const gameRules = (board: (number | string)[], activeSide: Side, figuresMoved: { [key: string]: boolean }, from: Coordinate, to: Coordinate) => {
    const figureId = board[normalizeCoord(from)] as string;
    const side = getSide(figureId);
    if (side !== activeSide) {
        return false;
    }
    const denormalizedBoard = chunk(board, BOARD_SIZE);
    if (!isValidDestination(side, denormalizedBoard, to)) {
        return false;
    }
    if (from.x === to.x && from.y === to.y) {
        return false;
    }
    const [figureType] = figureId.split("-");
    const rules = figuresToRules[figureType];
    const availableMotions = rules(denormalizedBoard, figuresMoved, from);
    if (!availableMotions.find(({ x, y }) => x === to.x && y === to.y)) {
        return false;
    }
    const motions = [{ from, to }];
    const dx = to.x - from.x;
    // rakirouka
    if (["bkz", "wkz"].includes(figureType) && Math.abs(dx) === RAKIROUKA_STEP) {
        const laddziaX = dx > 0 ? BOARD_SIZE - 1 : 0;
        motions.push({
            from: { x: laddziaX, y: from.y },
            to: { x: laddziaX + (dx > 0 ? -2 : 2), y: from.y },
        });
    }
    return { move: motions };
}

export const Game = () => {
    const [gameField, setGameField] = useState(defaultGameField);
    const [activeSide, setActiveSide] = useState<Side>("w");
    const [figuresMoved, setFiguresMoved] = useState(defaultMovedFigures);
    const [highlights, setHighlights] = useState<number[]>([]);
    const onSuggestRequest = useHandler((from: Coordinate) => {
        const figureId = gameField[normalizeCoord(from)] as string;
        if (getSide(figureId) !== activeSide) {
            return;
        }
        const [figureType] = figureId.split("-");
        const rules = figuresToRules[figureType];
        const suggestions = rules(chunk(gameField, BOARD_SIZE), figuresMoved, from);
        setHighlights(suggestions.map(normalizeCoord));
    })
    const onMotionRequest = useHandler((from: Coordinate, to: Coordinate) => {
        setHighlights([]);
        const result = gameRules(gameField, activeSide, figuresMoved, from, to);
        if (!result) {
            return false;
        }
        const newGameField = [...gameField];
        const justMovedFigures: { [key: string]: boolean } = {};
        result.move.forEach((motion) => {
            const prevPos = normalizeCoord(motion.from);
            const newPos = normalizeCoord(motion.to);
            justMovedFigures[gameField[prevPos]] = true;
            newGameField[newPos] = newGameField[prevPos];
            newGameField[prevPos] = 0;
        });
        setGameField(newGameField);
        setActiveSide(getOppositeSide(activeSide));
        setFiguresMoved({ ...figuresMoved, ...justMovedFigures });
        return true;
    });
    return (
        <Styles.Board>
            {times(Styles.BOARD_SIZE, (row) => (
                <Styles.Row key={row}>
                    {times(Styles.BOARD_SIZE, (col) => (
                        <Styles.Cell
                            key={row + col}
                            highlight={highlights.includes(normalizeCoord({ x: col, y: row }))}
                            white={(row + col) % 2 === 0}
                        />
                    ))}
                </Styles.Row>
            ))}
            <Styles.FiguresLayer>
                {gameField.map((cell, i) => {
                    if (typeof cell === "string") {
                        return (
                            <Figure
                              enabled={getSide(cell) === activeSide}
                              onSuggestRequest={onSuggestRequest}
                              onMotionRequest={onMotionRequest}
                              key={cell}
                              cell={cell}
                              {...denormalizeCoord(i)}
                            />
                        )
                        
                    }
                    return null;
                })}
            </Styles.FiguresLayer>
        </Styles.Board>
    )
}