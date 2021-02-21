import styled from "styled-components";
import { Aquedux } from "aquedux";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
export const CELL_SIZE = 64;
export const BOARD_SIZE = 9;

export const Board = styled.div`
    position: relative;
    width: ${CELL_SIZE * BOARD_SIZE};
    height: ${CELL_SIZE * BOARD_SIZE};
`;

export const Row = styled.div`
    display: flex;
    flex-direction: row;
`;

export const Cell = styled.div<{ white?: boolean, highlight?: boolean }>`
    width: ${CELL_SIZE}px;
    height: ${CELL_SIZE}px;
    box-sizing: border-box;
    border: ${({ highlight }) => highlight && "3px black solid"};
    background-color: ${({ white }) => white === true ? "#AAA" : "#555"};
`;

export const FigureContainer = styled(Aquedux.div)<{ enabled: boolean }>`
    pointer-events: ${({ enabled }) => enabled ? "auto" : "none" };
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 5px;
    position: absolute;
    
`;

export const Figure = styled.div<{ white: boolean }>`
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
    margin-bottom: 10px;
`;

export const FiguresLayer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
`;