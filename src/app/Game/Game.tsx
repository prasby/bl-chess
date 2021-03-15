import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useHandler } from "react-use-handler";
import { useDispatch, useSelector } from "react-redux";
import * as Styles from "./Game.styles";
import { range } from "lodash";
import { resetGame, initialState, State as AppGameState, requestMotion, selectFigure, startPromotion } from "src/data/game/slice";
import { RootState } from "src/data/store";
import { BOARD_SIZE, Coordinate, getAvailableMotions, denormalizeCoord, getSide, normalizeCoord, Side, isMotionValid, getMissingFiguresToPromote, getMissingFigures } from "src/data/game/domain";
import { SelectFigure } from "./components";
import { Figure } from "./components/Figure";

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

interface Props {
    displaySide: Side;
}

export const Game = ({ displaySide }: Props) => {
    const dispatch = useDispatch();
    const state = useSelector(({ game }: RootState) => game);
    const { gameState } = state;
    const [highlights, setHighlights] = useState<number[]>([]);
    const selectedCell = useRef<number>(-1);
    const onSuggestRequest = useHandler((from: Coordinate) => {
        selectedCell.current = -1;
        const figureCell = normalizeCoord(from);
        const figureId = gameState.field[figureCell] as string;
        const whitePromotion = from.y === BOARD_SIZE - 1 && figureId.startsWith("wr");
        const blackPromotion = from.y === 0 && figureId.startsWith("br");

        if (whitePromotion || blackPromotion) {
            const figureSide = getSide(figureId);
            if (gameState.activeSide === figureSide && getMissingFigures(gameState.field, figureSide).length > 0) {
                dispatch(startPromotion({ position: figureCell }));
                return;
            }
        }
        if (getSide(figureId) !== gameState.activeSide) {
            return;
        }
        const suggestions = getAvailableMotions(gameState, from, false);
        setHighlights([figureCell, ...suggestions.map(normalizeCoord)]);
    })
    const onMotionRequest = useHandler((from: Coordinate, to: Coordinate) => {
        selectedCell.current = -1;
        setHighlights([]);
        const result = isMotionValid(gameState, from, to);
        if (!result) {
            return false;
        }
        dispatch(requestMotion({ from, to }));
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
        if (gameState.field[position] !== 0) {
            onSuggestRequest(denormalizeCoord(position));
            selectedCell.current = position;
        } else {
            selectedCell.current = -1;
            setHighlights([]);
        }
    });
    const onFigureSelected = useHandler((figureId: string) => {
        dispatch(selectFigure({
          position: state.gameState.promotion?.position!,
          figureId,
        }));
    });
    const reverseBoard = displaySide === "w";
    const cellNumeration = range(0, BOARD_SIZE);
    const rotatedCellNumeration = reverseBoard ?
        cellNumeration.concat().reverse() :
        cellNumeration;
    const getEnabled = (cell: string) => {
        return getSide(cell) === gameState.activeSide && !gameState.conclusion;
    };
    useEffect(() => {
        setHighlights([]);
    }, [gameState]);
    return (
        <Styles.Game>
            <Styles.Rows reverseBoard={reverseBoard}>
                {rows.map(c => <Styles.LegendItem key={c}>{c}</Styles.LegendItem>)}
            </Styles.Rows>
            <Styles.GameInner>
                <Styles.Columns reverseBoard={reverseBoard}>
                    {collumns.map(c => <Styles.LegendItem key={c}>{c}</Styles.LegendItem>)}
                </Styles.Columns>
                <Styles.Board>
                    {rotatedCellNumeration.map((row) => (
                    <Styles.Row key={row}>
                            {rotatedCellNumeration.map((col) => (
                                <Cell
                                    enabled={!gameState.conclusion}
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
                        {gameState.field.map((cell, i) => {
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
                    {gameState.promotion && (
                        <Styles.NotificationsLayer isEnabled>
                            <SelectFigure
                                onFigureSelected={onFigureSelected}
                                selectingFigures={getMissingFiguresToPromote(gameState, gameState.promotion.position, gameState.promotion.side)}
                            />
                        </Styles.NotificationsLayer>
                    )}
                </Styles.Board>
                <Styles.Columns reverseBoard={reverseBoard}>
                    {collumns.map(c => <Styles.LegendItem key={c}>{c}</Styles.LegendItem>)}
                </Styles.Columns>
            </Styles.GameInner>
            <Styles.Rows reverseBoard={reverseBoard}>
                {rows.map(c => <Styles.LegendItem key={c}>{c}</Styles.LegendItem>)}
            </Styles.Rows>
        </Styles.Game>
    )
}