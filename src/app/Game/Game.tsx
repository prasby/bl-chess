import React, { ChangeEvent, useRef, useState } from "react";
import { useHandler } from "react-use-handler";
import * as Styles from "./Game.styles";
import { chunk, range, uniqBy } from "lodash";
import { BOARD_SIZE, Coordinate, defaultGameField, defaultMovedFigures, denormalizeCoord, FiguresMoved, figuresToRules, GameField, getKniazOf, getKniazychOf, getOppositeSide, getOutcomes, getSide, isValidDestination, MoveOutcomes, normalizeCoord, RAKIROUKA_STEP, Side, TRON_POSITION } from "src/data/game/domain";
import { SelectFigure } from "./components";
import { Figure } from "./components/Figure";

type GameConclusion = { type: "tron" | "mat", winner: Side };

const hasRatnikToPromote = (gameField: GameField, side: Side) => {
    const rowIndex = side === "w" ? BOARD_SIZE - 1 : 0;
    const row = chunk(gameField, BOARD_SIZE)[rowIndex];
    return row.find(f => f.toString().indexOf(`${side}r`) === 0)
};

const checkTronConfirmed = (
    side: Side,
    gameField: GameField,
    oldGameField: GameField
): GameConclusion | undefined => {
    if (onTron(gameField, side) && onTron(oldGameField, side)) {
        return { type: "tron", winner: side };
    }
    return undefined;
}

const getGameConclusion = (
    gameField: GameField,
    oldGameField: GameField,
    figuresMoved: FiguresMoved,
    karanacyjaHappened: boolean,
    side: Side
): GameConclusion | undefined => {
    const oppositeSide = getOppositeSide(side);
    const tron = checkTronConfirmed(side, gameField, oldGameField);
    if (tron) {
        return tron;
    }
    if (karanacyjaHappened && isUnderCheck(gameField, figuresMoved, oppositeSide)) {
        return { type: "mat", winner: side };
    } else {
        const availableOpponentMotions = getAllAvailableMotions(gameField, figuresMoved, oppositeSide);
        return availableOpponentMotions.length === 0 ?
            { type: "mat", winner: side } :
            undefined;
    }
}

const processMotionOutcomes = (gameField: GameField, figuresMoved: FiguresMoved, activeSide: Side, outcomes: MoveOutcomes, checkGameConclusion: boolean) => {
    const newGameField = [...gameField];
    const justMovedFigures: { [key: string]: boolean } = {};
    outcomes.motions.forEach((motion) => {
        const prevPos = normalizeCoord(motion.from);
        const newPos = normalizeCoord(motion.to);
        justMovedFigures[gameField[prevPos]] = true;
        newGameField[newPos] = newGameField[prevPos];
        newGameField[prevPos] = 0;
    });
    const oppositeSide = getOppositeSide(activeSide);
    const kniazPosition = getKniazOf(newGameField, oppositeSide);
    let newActiveSide = oppositeSide;
    let karanacyjaHappened = false;
    if (kniazPosition === -1) {
        karanacyjaHappened = true;
        newActiveSide = activeSide;
        const position = getKniazychOf(newGameField, oppositeSide);
        newGameField[position] = `${oppositeSide}kz`;
    }
    const newFiguresMoved = {
        ...figuresMoved,
        ...justMovedFigures,
    }
    const conclusion = checkGameConclusion ? getGameConclusion(
        newGameField,
        gameField,
        newFiguresMoved,
        karanacyjaHappened,
        activeSide
    ) : undefined;
    return [newGameField, newFiguresMoved, newActiveSide, conclusion] as const;
};

const getFiguresOf = (gameField: GameField, side: Side): number[] => {
    const result = [];
    for (let i = 0; i < gameField.length; i++) {
        const entry = gameField[i];
        if (typeof entry === "string" && getSide(entry) === side) {
            result.push(i);
        }
    }
    return result;
};

const getAllAvailableMotions = (gameField: GameField, figuresMoved: FiguresMoved, side: Side) => {
    const oppFigures = getFiguresOf(gameField, side);
    return oppFigures.flatMap(
        oppPosition => {
            const oppCoordinate = denormalizeCoord(oppPosition);
            return getAvailableMotions(gameField, figuresMoved, oppCoordinate, false);
        }
    );
};

const isPositionAttacked = (gameField: GameField, figuresMoved: FiguresMoved, side: Side, position: number) => {
    if (position !== -1) {
        const oppFigures = getFiguresOf(gameField, getOppositeSide(side));
        return oppFigures.find(
            oppPosition => {
                const oppCoordinate = denormalizeCoord(oppPosition);
                const oppMotions = getAvailableMotions(gameField, figuresMoved, oppCoordinate, true);
                return oppMotions.find(motion => {
                    return normalizeCoord(motion) === position;
                });
            }
        )
    }
    return false;
}

const isUnderRokash = (gameField: GameField, figuresMoved: FiguresMoved, side: Side) => {
    const tronValue = gameField[TRON_POSITION];
    if (typeof tronValue !== "string") {
        return false;
    }
    return getSide(tronValue) === side &&
        isPositionAttacked(gameField, figuresMoved, side, TRON_POSITION);
};

const isUnderCheck = (gameField: GameField, figuresMoved: FiguresMoved, side: Side) => {
    const kniazhychPosition = getKniazychOf(gameField, side);
    if (kniazhychPosition !== -1) {
        return false;
    }
    const kniazPosition = getKniazOf(gameField, side);
    return isPositionAttacked(gameField, figuresMoved, side, kniazPosition);
};

const onTron = (gameField: GameField, side: Side) => {
    return [`${side}kz`, `${side}kc`].includes(gameField[TRON_POSITION].toString());
};
const onUnattackedTron = (gameField: GameField, figuresMoved: FiguresMoved, side: Side) => {
    if (!onTron(gameField, side)) {
        return false;
    }
    return !isPositionAttacked(gameField, figuresMoved, side, TRON_POSITION);
};

const getAvailableMotions = (board: (number | string)[], figuresMoved: { [key: string]: boolean }, from: Coordinate, checkAttack: boolean) => {
    const figureId = board[normalizeCoord(from)] as string;
    const denormalizedBoard = chunk(board, BOARD_SIZE);
    const [figureType] = figureId.split("-");
    const rules = figuresToRules[figureType];
    const availableMotions = rules(denormalizedBoard, figuresMoved, from, checkAttack);
    return checkAttack ?
        availableMotions :
        availableMotions.filter(to => {
            const outcomes = getOutcomes(board, from, to);
            const invalidRakirouka = outcomes.beatenFields.find((coord) => {
                return isPositionAttacked(board, figuresMoved, getSide(figureId), normalizeCoord(coord));
            });
            if (invalidRakirouka) {
                return false;
            }
            const activeSide = getSide(figureId);
            const [newGameField, newFiguresMoved] = processMotionOutcomes(board, figuresMoved, activeSide, outcomes, false);
            const underCheck = isUnderCheck(newGameField, newFiguresMoved, activeSide);
            const underRokash = isUnderRokash(newGameField, newFiguresMoved, activeSide);
            const opponentOnUnattackedTron = onUnattackedTron(newGameField, newFiguresMoved, getOppositeSide(activeSide));
            // wtf?
            const checkKaranacyja = getKniazOf(newGameField, activeSide) === -1;
            if (underCheck || underRokash || checkKaranacyja || opponentOnUnattackedTron) {
                return false;
            }
            return true;
        });
};

const gameRules = (board: (number | string)[], activeSide: Side, figuresMoved: { [key: string]: boolean }, from: Coordinate, to: Coordinate) => {
    const figureId = board[normalizeCoord(from)] as string;
    const side = getSide(figureId);
    if (side !== activeSide) {
        return false;
    }
    if (from.x === to.x && from.y === to.y) {
        return false;
    }
    const denormalizedBoard = chunk(board, BOARD_SIZE);
    if (!isValidDestination(side, denormalizedBoard, to)) {
        return false;
    }
    const availableMotions = getAvailableMotions(board, figuresMoved, from, false);
    if (!availableMotions.find(({ x, y }) => x === to.x && y === to.y)) {
        return false;
    }
    return getOutcomes(board, from, to);
}

interface CellProps extends Styles.CellProps {
    onCellSelect(value: number): void;
    position: number,
    enabled: boolean,
}

const Cell = React.memo((props: CellProps) => {
    const onClick = useHandler(() => {
        props.onCellSelect(props.position);
    });
    return (
        <Styles.Cell
            enabled={props.enabled}        
            onClickCapture={onClick}
            white={props.white}
            highlight={props.highlight}
        />
    )
});

const collumns =["a", "b", "c", "d", "e", "f", "g", "h", "i"];
const rows = range(0, 9).map(v => (v + 1).toString());

const getMissingFigures = (gameField: GameField, side: Side) => {
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

export const Game = () => {
    const [displaySide, setDisplaySide] = useState<Side>("w");
    const [loadedField, setLoadedField] = useState<string>("");
    const [gameField, setGameField] = useState(defaultGameField);
    const [gameConclusion, setGameConclusion] = useState<GameConclusion | undefined>();
    const [activeSide, setActiveSide] = useState<Side>("w");
    const [promotePosition, setPromotePosition] = useState<number>(0);
    const [figuresMoved, setFiguresMoved] = useState(defaultMovedFigures);
    const [highlights, setHighlights] = useState<number[]>([]);
    const [selectingFigures, setSelectingFigures] = useState<Side | undefined>();
    const onLoadedFieldChange = useHandler((e: ChangeEvent<HTMLInputElement>) => {
        setLoadedField(e.target.value);
    });
    const resetGame = useHandler(() => {
        setHighlights([]);
        setGameConclusion(undefined);
        try {
            setGameField(JSON.parse(loadedField!));
        } catch(err) {
            setGameField(defaultGameField);
        }
        setFiguresMoved({});
        setActiveSide("w");
    });
    const selectedCell = useRef<number>(-1);
    const onSuggestRequest = useHandler((from: Coordinate) => {
        selectedCell.current = -1;
        const figureCell = normalizeCoord(from);
        const figureId = gameField[figureCell] as string;
        if (getSide(figureId) !== activeSide) {
            return;
        }
        const suggestions = getAvailableMotions(gameField, figuresMoved, from, false);
        setHighlights([figureCell, ...suggestions.map(normalizeCoord)]);
    })
    const onMotionRequest = useHandler((from: Coordinate, to: Coordinate) => {
        selectedCell.current = -1;
        setHighlights([]);
        const result = gameRules(gameField, activeSide, figuresMoved, from, to);
        if (!result) {
            return false;
        }
        const figureId = gameField[normalizeCoord(from)];
        const [newGameField, justMovedFigures, newActiveSide, gameConclusion] = processMotionOutcomes(gameField, figuresMoved, activeSide, result, true);
        if (hasRatnikToPromote(newGameField, activeSide) && !hasRatnikToPromote(gameField, activeSide)) {
            if (getMissingFigures(newGameField, activeSide).length > 0) {
                setPromotePosition(normalizeCoord(to));
                setSelectingFigures(activeSide);
                setGameField(newGameField);
                return true;
            }
        }
        setGameConclusion(gameConclusion);
        setGameField(newGameField);
        setActiveSide(newActiveSide);
        setFiguresMoved({ ...figuresMoved, ...justMovedFigures });
        return true;
    });
    const onCellSelect = useHandler((position: number) => {
        if (selectedCell.current !== -1) {
            onMotionRequest(
                denormalizeCoord(selectedCell.current),
                denormalizeCoord(position),
            );
            return;
        }
        if (gameField[position] !== 0) {
            onSuggestRequest(denormalizeCoord(position));
            selectedCell.current = position;
        } else {
            selectedCell.current = -1;
            setHighlights([]);
        }
    });
    const onFigureSelected = useHandler((figureId: string) => {
        // const newGameField = gameField.concat();
        // newGameField[promotePosition] = figureId;
        // setGameField(newGameField);
        // setSelectingFigures(undefined);
        // setActiveSide(getOppositeSide(activeSide));
        // const [newGameField, newFiguresMoved] = processMotionOutcomes(board, figuresMoved, activeSide, outcomes, false);
    });
    const reverseBoard = displaySide === "w";
    const cellNumeration = range(0, BOARD_SIZE);
    const rotatedCellNumeration = reverseBoard ?
        cellNumeration.concat().reverse() :
        cellNumeration;
    const getEnabled = (cell: string) => {
        return getSide(cell) === activeSide && !gameConclusion;
    };
    return (
        <div>
            <Styles.Game>
                <Styles.Rows reverseBoard={reverseBoard}>
                    {rows.map(c => <Styles.LegendItem>{c}</Styles.LegendItem>)}
                </Styles.Rows>
                <Styles.GameInner>
                    <Styles.Columns reverseBoard={reverseBoard}>
                        {collumns.map(c => <Styles.LegendItem>{c}</Styles.LegendItem>)}
                    </Styles.Columns>
                    <Styles.Board>
                        {rotatedCellNumeration.map((row) => (
                        <Styles.Row key={row}>
                                {rotatedCellNumeration.map((col) => (
                                    <Cell
                                        enabled={!gameConclusion}
                                        position={normalizeCoord({ x: col, y: row })}
                                        onCellSelect={onCellSelect}
                                        key={row + col}
                                        white={(row + col) % 2 === 0}
                                    />
                                ))}
                            </Styles.Row>
                        ))}
                        <Styles.Layer>
                            <Styles.Palac />
                            <Styles.Tron>X</Styles.Tron>
                        </Styles.Layer>
                        <Styles.Layer>
                            {rotatedCellNumeration.map((row) => (
                                <Styles.Row key={row}>
                                    {rotatedCellNumeration.map((col) => (
                                        <Styles.CellHighlight
                                            key={row + col}
                                            highlight={highlights.includes(normalizeCoord({ x: col, y: row }))}
                                        />
                                    ))}
                                </Styles.Row>
                            ))} 
                        </Styles.Layer>
                        <Styles.Layer>
                            {gameField.map((cell, i) => {
                                if (typeof cell === "string") {
                                    return (
                                        <Figure
                                            reverseBoard={reverseBoard}
                                            enabled={getEnabled(cell)}
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
                        </Styles.Layer>
                        {selectingFigures && (
                            <Styles.NotificationsLayer isEnabled>
                                <SelectFigure
                                    onFigureSelected={onFigureSelected}
                                    selectingFigures={getMissingFigures(gameField, selectingFigures)}
                                />
                            </Styles.NotificationsLayer>
                        )}
                    </Styles.Board>
                    <Styles.Columns reverseBoard={reverseBoard}>
                        {collumns.map(c => <Styles.LegendItem>{c}</Styles.LegendItem>)}
                    </Styles.Columns>
                </Styles.GameInner>
                <Styles.Rows reverseBoard={reverseBoard}>
                    {rows.map(c => <Styles.LegendItem>{c}</Styles.LegendItem>)}
                </Styles.Rows>
            </Styles.Game>
            <div>
                <input
                    onChange={(event) => setDisplaySide(event.target.value as Side)}
                    type="radio"
                    value="w"
                    checked={displaySide === "w"}
                    name="displaySide"
                />
                Bely
                <input
                    onChange={(event) => setDisplaySide(event.target.value as Side)}
                    type="radio"
                    value="b"
                    checked={displaySide === "b"}
                    name="displaySide"
                />
                Čorny
            </div>
            <div>
                LOAD GAME
                <input onChange={onLoadedFieldChange} value={loadedField} />
                <button onClick={() => { resetGame(); }} >RESET</button>
            </div>
            <button onClick={() => { console.log(`GAMEFIELD: ${JSON.stringify(gameField)}`); }} >PRINT</button>
        </div>
    )
}