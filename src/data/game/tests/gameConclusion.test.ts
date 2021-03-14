import { computeNewGameState, GameStateSnapshot, getAvailableMotions, getGameConclusion } from "../domain";

describe("game conclusion", () => {
    it("tron when maintained", () => {
        const gameState: GameStateSnapshot = {"karanacyjaHappened":false,"field":["wl-1","wv-1","wg-1","wgt",0,"wkc","wv-2",0,"wl-2","wr-1","wr-2","wr-3",0,"wr-5","wr-6","wr-7","wr-8","wg-2",0,0,0,"bv-1",0,0,0,0,"wr-9",0,0,0,"wr-4",0,0,0,0,0,"br-1",0,0,0,"wkz",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"br-2","br-3","br-4","br-5","br-6","br-7","br-8","br-9","bl-1","bg-1",0,"bkc","bkz","bgt","bg-2","bv-2","bl-2"],"figuresMoved":{"wr-4":true,"br-1":true,"wkz":true,"bv-1":true,"wr-9":true,"wg-2":true},"activeSide":"w"};
        const from = { x: 4, y: 1};
        const to = { x: 3, y: 2 };
        const motions = getAvailableMotions(gameState, from, false);
        expect(motions).toEqual([to]);
        const newGameState = computeNewGameState(
            gameState,
            { motions: [{ from, to }], beatenFields: [], promotions: [] },
        );
        newGameState.conclusion = getGameConclusion(
            newGameState,
            gameState,
            "w"
        );
        expect(newGameState.conclusion).toEqual({ type: "tron", winner: "w" });
    });
})