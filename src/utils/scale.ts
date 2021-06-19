import { BOARD_SIZE } from "src/data/game/domain";

export const CELL_SIZE = 64;
export const BOARD_PX_SIZE = CELL_SIZE * BOARD_SIZE;
export const LEGEND_SIZE = 30;

export const MAX_GAME_SIZE = BOARD_SIZE * CELL_SIZE + LEGEND_SIZE * 2;

export interface Theme {
    gameSize: number;
}

export const scaleValue = (theme: Theme, value: number, ceil = false) => {
    const scaled = theme.gameSize / MAX_GAME_SIZE * value;
    return ceil ? Math.ceil(scaled) : scaled;
}

export const createScaled = (value: number, ceil = false) => ({ theme }: { theme: Theme }) =>
    scaleValue(theme, value, ceil);

export const enableOnSize = (condition: (gameSize: number) => boolean) => ({ theme }: { theme: Theme }) =>
    condition(theme.gameSize);