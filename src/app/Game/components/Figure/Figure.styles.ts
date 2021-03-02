import styled from "styled-components";
import { Aquedux } from "aquedux";
import { createScaled, CELL_SIZE, enableOnSize } from "src/utils/scale";

const enableDrag = enableOnSize(gameSize => gameSize > 400);
const figureFontSize = createScaled(50, true);

export const FigureContainer = styled(Aquedux.div)<{  }>`
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: ${createScaled(5)}px;
    position: absolute;
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