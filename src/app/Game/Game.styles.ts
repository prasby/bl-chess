import styled from "styled-components";
import { Aquedux } from "aquedux";
import { BOARD_SIZE } from "src/data/game/domain";

export const CELL_SIZE = 64;

export const Board = styled.div`
    position: relative;
    width: ${CELL_SIZE * BOARD_SIZE};
    height: ${CELL_SIZE * BOARD_SIZE};
`;

export const Row = styled.div`
    background-color: transparent;
    display: flex;
    flex-direction: row;
`;

export interface CellProps { white?: boolean; highlight?: boolean }

export const Cell = styled.div<CellProps>`
    width: ${CELL_SIZE}px;
    height: ${CELL_SIZE}px;
    box-sizing: border-box;
    background-color: ${({ white }) => white === true ? "#AAA" : "#555"};
`;

export const CellHighlight = styled.div<{ highlight?: boolean }>`
    width: ${CELL_SIZE}px;
    height: ${CELL_SIZE}px;
    box-sizing: border-box;
    background-color: transparent;
    border: ${({ highlight }) => highlight && "3px red solid"};
`;

export const FigureContainer = styled(Aquedux.div)<{  }>`
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 5px;
    position: absolute;
    
`;

export const Palac = styled.div`
    position: absolute;
    left: ${CELL_SIZE * 2 - 1}px;
    top: ${CELL_SIZE * 2 - 1}px;
    width: ${CELL_SIZE * 5 + 2}px;
    height: ${CELL_SIZE * 5 + 2}px;
    border: 2px black solid;
    box-sizing: border-box;
`;

export const Tron = styled.div`
    position: absolute;
    left: ${CELL_SIZE * 4}px;
    top: ${CELL_SIZE * 4}px;
    width: ${CELL_SIZE}px;
    height: ${CELL_SIZE}px;
    background-color: white;
    display: flex;
    align-items: center;
    font-size: 40pt;
    font-weight: bold;
    justify-content: space-around;
    user-select: none;
`;

export const Figure = styled.div<{ white: boolean; enabled: boolean }>`
    pointer-events: ${({ enabled }) => enabled ? "auto" : "none" };
    cursor: pointer;
    user-select: none;
    width: ${CELL_SIZE - 10}px;
    height: ${CELL_SIZE - 10}px;
    border-radius: ${CELL_SIZE / 2}px;
    background-color: ${({ white }) => white ? "white" : "black"};
    display: flex;
    align-items: center;
    justify-content: space-around;
`;

export const FigureIcon = styled.div<{ white: boolean }>`
    color: ${({ white }) => white ? "black" : "white"};
    font-size: 60px;
    user-select: none;
    margin-bottom: 10px;
`;

export const Layer = styled.div`
    position: absolute;
    pointer-events: none;
    top: 0;
    left: 0;
    background-color: transparent;
`;