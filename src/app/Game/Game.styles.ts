import styled from "styled-components";
import { Aquedux } from "aquedux";
import { BOARD_SIZE } from "src/data/game/domain";

export const CELL_SIZE = 64;
export const LEGEND_SIZE = 30;
export const MAX_GAME_SIZE = BOARD_SIZE * CELL_SIZE + LEGEND_SIZE * 2;

export interface Theme {
    gameSize: number;
}

export const scaleValue = (theme: Theme, value: number, ceil = false) => {
    const scaled = theme.gameSize / MAX_GAME_SIZE * value;
    return ceil ? Math.ceil(scaled) : scaled;
}

const createScaled = (value: number, ceil = false) => ({ theme }: { theme: Theme }) =>
    scaleValue(theme, value, ceil);

const enableOnSize = (condition: (gameSize: number) => boolean) => ({ theme }: { theme: Theme }) =>
    condition(theme.gameSize);


const cellSize = createScaled(CELL_SIZE);
const boardSize = createScaled(BOARD_SIZE * CELL_SIZE);
const legendSize = createScaled(LEGEND_SIZE);
const gameSize = createScaled(MAX_GAME_SIZE);
const figureFontSize = createScaled(50, true);
const enableDrag = enableOnSize(gameSize => gameSize > 400);

export const Game = styled.div`
    max-width: ${gameSize}px;
    display: flex;
    flex-direction: row;
`;

export const GameInner = styled.div`
    display: flex;
    flex-direction: column;
`;

export const Columns = styled.div<{ reverseBoard: boolean }>`
    align-self: center;
    user-select: none;
    flex-wrap: 0;
    flex-shrink: 0;
    width: ${createScaled(CELL_SIZE * BOARD_SIZE - LEGEND_SIZE)}px;
    display: flex;
    height: ${legendSize}px;
    justify-content: space-between;
    flex: 1;
    flex-direction: ${({ reverseBoard }) => reverseBoard ? "row" : "row-reverse"};
`;

export const Rows = styled.div<{ reverseBoard: boolean }>`
    display: flex;
    user-select: none;
    width: ${legendSize}px;
    justify-content: space-evenly;
    flex: 1;
    flex-direction: ${({ reverseBoard }) => reverseBoard ? "column-reverse" : "column"};
`;

export const LegendItem = styled.div`
    width: ${legendSize}px;
    height: ${legendSize}px;
    align-items: center;
    display: flex;
    justify-content: space-around;
`;

export const Board = styled.div`
    position: relative;
    width: ${boardSize};
    height: ${boardSize};
`;

export const Row = styled.div`
    background-color: transparent;
    display: flex;
    flex-direction: row;
`;

export interface CellProps { white?: boolean; highlight?: boolean, enabled: boolean }

export const Cell = styled.div<CellProps>`
    pointer-events: ${({ enabled }) => enabled ? "auto" : "none"};
    width: ${cellSize}px;
    height: ${cellSize}px;
    box-sizing: border-box;
    background-color: ${({ white }) => white === true ? "#AAA" : "#555"};
`;

export const CellHighlight = styled.div<{ highlight?: boolean }>`
    width: ${cellSize}px;
    height: ${cellSize}px;
    box-sizing: border-box;
    background-color: transparent;
    border: ${({ highlight }) => highlight && "3px red solid"};
`;

export const FigureContainer = styled(Aquedux.div)<{  }>`
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: ${createScaled(5)}px;
    position: absolute;
    
`;

export const Palac = styled.div`
    position: absolute;
    left: ${createScaled(CELL_SIZE * 2 - 1)}px;
    top: ${createScaled(CELL_SIZE * 2 - 1)}px;
    width: ${createScaled(CELL_SIZE * 5 + 2)}px;
    height: ${createScaled(CELL_SIZE * 5 + 2)}px;
    border: 2px black solid;
    box-sizing: border-box;
`;

export const Tron = styled.div`
    position: absolute;
    left: ${createScaled(CELL_SIZE * 4)}px;
    top: ${createScaled(CELL_SIZE * 4)}px;
    width: ${cellSize}px;
    height: ${cellSize}px;
    background-color: white;
    display: flex;
    align-items: center;
    font-size: ${createScaled(40)}pt;
    font-weight: bold;
    justify-content: space-around;
    user-select: none;
`;

export const Figure = styled.div<{ white: boolean; enabled: boolean }>`
    pointer-events: ${({ enabled, theme }) => enabled && enableDrag({ theme }) ? "auto" : "none" };
    cursor: pointer;
    user-select: none;
    width: ${createScaled(CELL_SIZE - 10)}px;
    height: ${createScaled(CELL_SIZE - 10)}px;
    border-radius: ${createScaled(CELL_SIZE / 2)}px;
    background-color: ${({ white }) => white ? "white" : "black"};
    display: flex;
    align-items: center;
    justify-content: space-around;
`;

export const FigureIcon = styled.div<{ white: boolean }>`
    color: ${({ white }) => white ? "black" : "white"};
    font-size: ${figureFontSize}pt;
    user-select: none;
    pointer-events: none;
    margin-bottom: ${createScaled(10)}px;
`;

export const Layer = styled.div`
    position: absolute;
    pointer-events: none;
    top: 0;
    left: 0;
    background-color: transparent;
`;