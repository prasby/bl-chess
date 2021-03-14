import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Coordinate, defaultGameState, isMotionValid, GameStateSnapshot, hasRatnikToPromote, normalizeCoord, getMissingFigures, MotionDetails, getMotionsDetails, computeNewGameState, getGameConclusion, needKaranacyja } from "./domain";

export interface State {
    gameState: GameStateSnapshot,
    history: any[],
}

export const initialState = {
    gameState: defaultGameState,
    history: [],
} as State;

export const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        resetGame: (state, { payload }: PayloadAction<State>) => {
            return payload;
        },
        startPromotion: (state, { payload }: PayloadAction<{ position: number }>) => {
            state.gameState.promotion = { side: state.gameState.activeSide, position: payload.position }
        },
        requestMotion: (state, { payload }: PayloadAction<{ from: Coordinate, to: Coordinate }>) => {
            const { from, to } = payload;
            const { gameState } = state;
            const details = getMotionsDetails(gameState.field, from, to);
            const motionInitiator = gameState.activeSide;
            const newGameState = computeNewGameState(gameState, details);
            newGameState.conclusion = getGameConclusion(
                newGameState,
                gameState,
                gameState.activeSide
            );
            const canPromoteInOneStep = hasRatnikToPromote(newGameState.field, motionInitiator) && !hasRatnikToPromote(gameState.field, motionInitiator);
            const hasMissingFigures = getMissingFigures(newGameState.field, gameState.activeSide).length > 0;
            if (canPromoteInOneStep && hasMissingFigures) {
                gameState.promotion = {
                    position: normalizeCoord(to),
                    side: gameState.activeSide,
                };
                gameState.field = newGameState.field;
                gameState.karanacyjaHappened = newGameState.karanacyjaHappened;
            } else {
                state.gameState = newGameState;
            }
        },
        selectFigure: (state, { payload: { position, figureId } }: PayloadAction<{ position: number, figureId: string }>) => {
            const details: MotionDetails = {
                beatenFields: [],
                motions: [],
                promotions: [{ position, figureId }]
            };
            const activeSide = state.gameState.activeSide;
            const newGameState = computeNewGameState(state.gameState, details);
            newGameState.karanacyjaHappened = state.gameState.karanacyjaHappened;
            newGameState.promotion = undefined;
            newGameState.conclusion = getGameConclusion(newGameState, state.gameState, activeSide);
            state.gameState = newGameState;
        }
    }
});

export const { resetGame, requestMotion, selectFigure, startPromotion } = gameSlice.actions;

export const { reducer } = gameSlice;