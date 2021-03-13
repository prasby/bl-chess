import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Coordinate, defaultGameState, isMotionValid, GameStateSnapshot, hasRatnikToPromote, normalizeCoord, processMotionDetails, getMissingFigures, MotionDetails, getMotionsDetails } from "./domain";

export interface State {
    gameState: GameStateSnapshot,
    previousState: GameStateSnapshot,
    history: any[],
}

export const initialState = {
    gameState: defaultGameState,
    previousState: defaultGameState,
    history: [],
} as State;

export const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        resetGame: (state, { payload }: PayloadAction<State>) => {
            return payload;
        },
        requestMotion: (state, { payload }: PayloadAction<{ from: Coordinate, to: Coordinate }>) => {
            const { from, to } = payload;
            const { gameState } = state;
            const result = getMotionsDetails(gameState.field, from, to);
            const motionInitiator = gameState.activeSide;
            const newGameState = processMotionDetails(gameState, result, true);
            if (hasRatnikToPromote(newGameState.field, motionInitiator) && !hasRatnikToPromote(gameState.field, motionInitiator)) {
                if (getMissingFigures(newGameState.field, gameState.activeSide).length > 0) {
                    gameState.promotion = {
                        position: normalizeCoord(to),
                        side: gameState.activeSide,
                    };
                    gameState.field = newGameState.field;
                }
            } else {
                state.gameState = newGameState;
            }
        },
        selectFigure: (state) => {

        }
    }
});

export const { resetGame, requestMotion, selectFigure } = gameSlice.actions;

export const { reducer } = gameSlice;