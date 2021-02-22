import React, { useEffect, useMemo, useRef, useState } from "react";
import { useHandler } from "react-use-handler";
import * as Styles from "./Game.styles";
import { times, chunk } from "lodash";
import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import { BOARD_SIZE, Coordinate, defaultGameField, defaultMovedFigures, figuresToIcons, figuresToRules, getOppositeSide, getSide, isValidDestination, RAKIROUKA_STEP, Side } from "src/data/game/domain";

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

const normalizeCoord = ({ x, y }: Coordinate) =>
    y * BOARD_SIZE + x

const denormalizeCoord = (pos: number): Coordinate => ({
    x: pos % BOARD_SIZE,
    y: Math.floor(pos / BOARD_SIZE),
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
            {times(BOARD_SIZE, (row) => (
                <Styles.Row key={row}>
                    {times(BOARD_SIZE, (col) => (
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