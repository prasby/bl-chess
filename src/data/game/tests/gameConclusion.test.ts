import { computeNewGameState, GameStateSnapshot, getAvailableMotions, getGameConclusion } from "../domain";
import { chunk } from "lodash";

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

    // https://kniazhych.herokuapp.com/?state=JTdCJTIya2FyYW5hY3lqYUhhcHBlbmVkJTIyJTNBZmFsc2UlMkMlMjJmaWVsZCUyMiUzQSU1QiUyMndsLTElMjIlMkMlMjJ3di0xJTIyJTJDJTIyd2ctMSUyMiUyQyUyMndndCUyMiUyQzAlMkMlMjJ3a2MlMjIlMkMlMjJ3di0yJTIyJTJDMCUyQyUyMndsLTIlMjIlMkMlMjJ3ci0xJTIyJTJDJTIyd3ItMiUyMiUyQyUyMndyLTMlMjIlMkMwJTJDJTIyd3ItNSUyMiUyQyUyMndyLTYlMjIlMkMlMjJ3ci03JTIyJTJDJTIyd3ItOCUyMiUyQyUyMndnLTIlMjIlMkMwJTJDMCUyQzAlMkMlMjJidi0xJTIyJTJDMCUyQzAlMkMwJTJDMCUyQyUyMndyLTklMjIlMkMwJTJDMCUyQzAlMkMlMjJ3ci00JTIyJTJDMCUyQzAlMkMwJTJDMCUyQzAlMkMlMjJici0xJTIyJTJDMCUyQzAlMkMwJTJDJTIyd2t6JTIyJTJDMCUyQzAlMkMwJTJDMCUyQzAlMkMwJTJDMCUyQzAlMkMwJTJDMCUyQzAlMkMwJTJDMCUyQzAlMkMwJTJDMCUyQzAlMkMwJTJDMCUyQzAlMkMwJTJDMCUyQzAlMkMlMjJici0yJTIyJTJDJTIyYnItMyUyMiUyQyUyMmJyLTQlMjIlMkMlMjJici01JTIyJTJDJTIyYnItNiUyMiUyQyUyMmJyLTclMjIlMkMlMjJici04JTIyJTJDJTIyYnItOSUyMiUyQyUyMmJsLTElMjIlMkMlMjJiZy0xJTIyJTJDMCUyQyUyMmJrYyUyMiUyQyUyMmJreiUyMiUyQyUyMmJndCUyMiUyQyUyMmJnLTIlMjIlMkMlMjJidi0yJTIyJTJDJTIyYmwtMiUyMiU1RCUyQyUyMmZpZ3VyZXNNb3ZlZCUyMiUzQSU3QiUyMndyLTQlMjIlM0F0cnVlJTJDJTIyYnItMSUyMiUzQXRydWUlMkMlMjJ3a3olMjIlM0F0cnVlJTJDJTIyYnYtMSUyMiUzQXRydWUlMkMlMjJ3ci05JTIyJTNBdHJ1ZSUyQyUyMndnLTIlMjIlM0F0cnVlJTdEJTJDJTIyYWN0aXZlU2lkZSUyMiUzQSUyMnclMjIlN0Q=
    it("anti-rokash", () => {
        const gameState: GameStateSnapshot = {"karanacyjaHappened":false,"field":["wl-1","wv-1","wg-1","wgt",0,"wkc","wv-2",0,"wl-2","wr-1","wr-2","wr-3",0,"wr-5","wr-6","wr-7","wr-8","wg-2",0,0,0,"bv-1",0,0,0,0,"wr-9",0,0,0,"wr-4",0,0,0,0,0,"br-1",0,0,0,"wkz",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"br-2","br-3","br-4","br-5","br-6","br-7","br-8","br-9","bl-1","bg-1",0,"bkc","bkz","bgt","bg-2","bv-2","bl-2"],"figuresMoved":{"wr-4":true,"br-1":true,"wkz":true,"bv-1":true,"wr-9":true,"wg-2":true},"activeSide":"w"};
        const from = {
            x: 4,
            y: 1
        };
        const to = {
            x: 3,
            y: 2
        };
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


    // https://kniazhych.herokuapp.com?state=JTdCJTIyZmllbGQlMjIlM0ElNUIwJTJDJTIyd2ctMSUyMiUyQyUyMnd2LTElMjIlMkMlMjJ3a2MlMjIlMkMlMjJ3a3olMjIlMkMwJTJDJTIyd3YtMiUyMiUyQyUyMndnLTIlMjIlMkMlMjJ3bC0yJTIyJTJDJTIyd2wtMSUyMiUyQyUyMndyLTIlMjIlMkMlMjJ3ci0zJTIyJTJDJTIyd3ItNCUyMiUyQzAlMkMlMjJ3ci02JTIyJTJDJTIyd3ItNyUyMiUyQyUyMndyLTglMjIlMkMlMjJ3ci05JTIyJTJDJTIyd3ItMSUyMiUyQzAlMkMwJTJDMCUyQzAlMkMwJTJDMCUyQzAlMkMwJTJDMCUyQzAlMkMlMjJ3Z3QlMjIlMkMwJTJDMCUyQzAlMkMwJTJDMCUyQzAlMkMwJTJDMCUyQzAlMkMwJTJDMCUyQzAlMkMwJTJDMCUyQzAlMkMwJTJDMCUyQzAlMkMwJTJDJTIyd3ItNSUyMiUyQzAlMkMwJTJDMCUyQzAlMkMlMjJici0xJTIyJTJDMCUyQyUyMmJreiUyMiUyQzAlMkMwJTJDMCUyQzAlMkMwJTJDMCUyQyUyMmJsLTElMjIlMkMlMjJici0yJTIyJTJDJTIyYnItMyUyMiUyQzAlMkMlMjJici0yMiUyMiUyQyUyMmJyLTYlMjIlMkMlMjJici03JTIyJTJDJTIyYnItOCUyMiUyQyUyMmJyLTklMjIlMkMwJTJDJTIyYmctMSUyMiUyQyUyMmJyLTI2JTIyJTJDJTIyYnItMjMlMjIlMkMlMjJici0yNCUyMiUyQyUyMmJndCUyMiUyQyUyMmJyLTI1JTIyJTJDJTIyYmctMiUyMiUyQyUyMmJsLTIlMjIlNUQlMkMlMjJmaWd1cmVzTW92ZWQlMjIlM0ElN0IlMjJ3Z3QlMjIlM0F0cnVlJTJDJTIyYmt6JTIyJTNBdHJ1ZSUyQyUyMndyLTUlMjIlM0F0cnVlJTdEJTJDJTIyYWN0aXZlU2lkZSUyMiUzQSUyMmIlMjIlMkMlMjJrYXJhbmFjeWphSGFwcGVuZWQlMjIlM0FmYWxzZSU3RA==
    it("check", () => {
        const gameState: GameStateSnapshot = {"field":[0,"wg-1","wv-1","wkc","wkz",0,"wv-2","wg-2","wl-2","wl-1","wr-2","wr-3","wr-4",0,"wr-6","wr-7","wr-8","wr-9","wr-1",0,0,0,0,0,0,0,0,0,0,"wgt",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"wr-5",0,0,0,0,"br-1",0,"bkz",0,0,0,0,0,0,"bl-1","br-2","br-3",0,"br-22","br-6","br-7","br-8","br-9",0,"bg-1","br-26","br-23","br-24","bgt","br-25","bg-2","bl-2"],"figuresMoved":{"wgt":true,"bkz":true,"wr-5":true},"activeSide":"b","karanacyjaHappened":false};
        const from = {
            x: 2,
            y: 6
        };
        const motions = getAvailableMotions(gameState, from, false);
        motions.forEach((m) => {
            expect(m).not.toEqual({
              x: 2,
              y: 5
            })
        });
    });

    // https://kniazhych.herokuapp.com/?state=JTdCJTIya2FyYW5hY3lqYUhhcHBlbmVkJTIyJTNBZmFsc2UlMkMlMjJmaWVsZCUyMiUzQSU1QiUyMndsLTElMjIlMkMlMjJ3di0xJTIyJTJDJTIyd2ctMSUyMiUyQzAlMkMwJTJDJTIyd2tjJTIyJTJDJTIyd3YtMiUyMiUyQzAlMkMlMjJ3bC0yJTIyJTJDJTIyd3ItMSUyMiUyQyUyMndyLTIlMjIlMkMlMjJ3ci0zJTIyJTJDMCUyQyUyMndyLTUlMjIlMkMwJTJDJTIyd3ItNyUyMiUyQyUyMndyLTglMjIlMkMlMjJ3Zy0yJTIyJTJDMCUyQzAlMkMwJTJDJTIyYnYtMSUyMiUyQzAlMkMwJTJDMCUyQzAlMkMlMjJ3ci05JTIyJTJDMCUyQzAlMkMwJTJDJTIyd3ItNCUyMiUyQyUyMndreiUyMiUyQzAlMkMwJTJDMCUyQzAlMkMlMjJici0xJTIyJTJDMCUyQzAlMkMwJTJDMCUyQzAlMkMwJTJDMCUyQzAlMkMwJTJDJTIyYnItMiUyMiUyQzAlMkMwJTJDMCUyQzAlMkMwJTJDMCUyQzAlMkMwJTJDMCUyQyUyMmJyLTMlMjIlMkMwJTJDMCUyQzAlMkMwJTJDMCUyQzAlMkMwJTJDMCUyQzAlMkMlMjJici00JTIyJTJDMCUyQyUyMndyLTYlMjIlMkMlMjJici03JTIyJTJDJTIyYnItOCUyMiUyQyUyMmJyLTklMjIlMkMlMjJibC0xJTIyJTJDJTIyYmctMSUyMiUyQzAlMkMlMjJia2MlMjIlMkMlMjJia3olMjIlMkMlMjJiZ3QlMjIlMkMlMjJiZy0yJTIyJTJDJTIyYnYtMiUyMiUyQyUyMmJsLTIlMjIlNUQlMkMlMjJmaWd1cmVzTW92ZWQlMjIlM0ElN0IlMjJ3ci00JTIyJTNBdHJ1ZSUyQyUyMmJyLTElMjIlM0F0cnVlJTJDJTIyd2t6JTIyJTNBdHJ1ZSUyQyUyMmJ2LTElMjIlM0F0cnVlJTJDJTIyd3ItOSUyMiUzQXRydWUlMkMlMjJ3Zy0yJTIyJTNBdHJ1ZSUyQyUyMndyLTYlMjIlM0F0cnVlJTJDJTIyYnItNSUyMiUzQXRydWUlMkMlMjJici0zJTIyJTNBdHJ1ZSUyQyUyMmJyLTIlMjIlM0F0cnVlJTJDJTIyd2d0JTIyJTNBdHJ1ZSU3RCUyQyUyMmFjdGl2ZVNpZGUlMjIlM0ElMjJ3JTIyJTdE
    it("promotion + mat", () => {
        const gameState: GameStateSnapshot = {"karanacyjaHappened":false,"field":["wl-1","wv-1","wg-1",0,0,"wkc","wv-2",0,"wl-2","wr-1","wr-2","wr-3",0,"wr-5",0,"wr-7","wr-8","wg-2",0,0,0,"bv-1",0,0,0,0,"wr-9",0,0,0,"wr-4","wkz",0,0,0,0,"br-1",0,0,0,0,0,0,0,0,0,"br-2",0,0,0,0,0,0,0,0,0,"br-3",0,0,0,0,0,0,0,0,0,"br-4",0,"wr-6","br-7","br-8","br-9","bl-1","bg-1",0,"bkc","bkz","bgt","bg-2","bv-2","bl-2"],"figuresMoved":{"wr-4":true,"br-1":true,"wkz":true,"bv-1":true,"wr-9":true,"wg-2":true,"wr-6":true,"br-5":true,"br-3":true,"br-2":true,"wgt":true},"activeSide":"w"};
        const from = {
          x: 5,
          y: 7
        };
        const to = {
          x: 4,
          y: 8
        };
        const newGameState = computeNewGameState(
            gameState,
            { motions: [{ from, to }], beatenFields: [], promotions: [] },
        );
        const newGameState2 = computeNewGameState(
            newGameState,
            { 
                motions: [],
                beatenFields: [],
                promotions: [
                    {
                        position: 76,
                        figureId: 'wgt'
                    }
                ]
            },
        );
        const conclusionW = getGameConclusion(
            newGameState2,
            newGameState,
            "w"
        );
        expect(conclusionW).toEqual({ type: "mat", winner: "w" });
    });

    // https://kniazhych.herokuapp.com/?state=JTdCJTIya2FyYW5hY3lqYUhhcHBlbmVkJTIyJTNBZmFsc2UlMkMlMjJmaWVsZCUyMiUzQSU1QiUyMndsLTElMjIlMkMlMjJ3di0xJTIyJTJDJTIyd2ctMSUyMiUyQzAlMkMwJTJDJTIyd2tjJTIyJTJDJTIyd3YtMiUyMiUyQzAlMkMlMjJ3bC0yJTIyJTJDJTIyd3ItMSUyMiUyQyUyMndyLTIlMjIlMkMlMjJ3ci0zJTIyJTJDMCUyQyUyMndyLTUlMjIlMkMwJTJDJTIyd3ItNyUyMiUyQyUyMndyLTglMjIlMkMlMjJ3Zy0yJTIyJTJDMCUyQzAlMkMwJTJDJTIyYnYtMSUyMiUyQzAlMkMwJTJDMCUyQzAlMkMlMjJ3ci05JTIyJTJDMCUyQzAlMkMwJTJDJTIyd3ItNCUyMiUyQyUyMndreiUyMiUyQzAlMkMwJTJDMCUyQzAlMkMlMjJici0xJTIyJTJDMCUyQzAlMkMwJTJDMCUyQzAlMkMwJTJDMCUyQzAlMkMwJTJDJTIyYnItMiUyMiUyQzAlMkMwJTJDMCUyQzAlMkMwJTJDMCUyQzAlMkMwJTJDMCUyQyUyMmJyLTMlMjIlMkMwJTJDMCUyQzAlMkMwJTJDMCUyQzAlMkMwJTJDMCUyQzAlMkMlMjJici00JTIyJTJDMCUyQyUyMndyLTYlMjIlMkMlMjJici03JTIyJTJDJTIyYnItOCUyMiUyQyUyMmJyLTklMjIlMkMlMjJibC0xJTIyJTJDJTIyYmctMSUyMiUyQzAlMkMlMjJia2MlMjIlMkMlMjJia3olMjIlMkMlMjJiZ3QlMjIlMkMlMjJiZy0yJTIyJTJDJTIyYnYtMiUyMiUyQyUyMmJsLTIlMjIlNUQlMkMlMjJmaWd1cmVzTW92ZWQlMjIlM0ElN0IlMjJ3ci00JTIyJTNBdHJ1ZSUyQyUyMmJyLTElMjIlM0F0cnVlJTJDJTIyd2t6JTIyJTNBdHJ1ZSUyQyUyMmJ2LTElMjIlM0F0cnVlJTJDJTIyd3ItOSUyMiUzQXRydWUlMkMlMjJ3Zy0yJTIyJTNBdHJ1ZSUyQyUyMndyLTYlMjIlM0F0cnVlJTJDJTIyYnItNSUyMiUzQXRydWUlMkMlMjJici0zJTIyJTNBdHJ1ZSUyQyUyMmJyLTIlMjIlM0F0cnVlJTJDJTIyd2d0JTIyJTNBdHJ1ZSU3RCUyQyUyMmFjdGl2ZVNpZGUlMjIlM0ElMjJ3JTIyJTdE
    it("promotion + rokash", () => {
        const gameState: GameStateSnapshot = {"karanacyjaHappened":false,"field":["wl-1","wv-1","wg-1",0,"wkc",0,"wv-2",0,"wl-2",0,"wr-2","wr-3",0,"wr-5",0,"wr-7","wr-8","wg-2","wr-1",0,0,0,"wkz",0,0,0,"wr-9",0,0,0,0,0,0,0,0,0,"br-1",0,"bv-1","wr-4","bkz",0,0,0,0,0,"br-2",0,0,0,0,0,0,0,0,0,"br-3",0,0,0,0,0,0,0,0,0,"br-4",0,"wr-6","br-7","br-8","br-9","bl-1","bg-1",0,"bkc","bgt",0,"bg-2","bv-2","bl-2"],"figuresMoved":{"wr-4":true,"br-1":true,"wkz":true,"bv-1":true,"wr-9":true,"wg-2":true,"wr-6":true,"br-5":true,"br-3":true,"br-2":true,"wgt":true,"bkz":true,"wkc":true,"bgt":true,"wr-1":true},"activeSide":"w"};
        const from = {
            x: 5,
            y: 7
        };
        const to = {
            x: 4,
            y: 8
        };
        const newGameState = computeNewGameState(
            gameState,
            { motions: [{ from, to }], beatenFields: [], promotions: [] },
        );
        const newGameState2 = computeNewGameState(
            newGameState,
            { 
                motions: [],
                beatenFields: [],
                promotions: [
                    {
                        position: 76,
                        figureId: 'wgt'
                    }
                ]
            },
        );
        const conclusionW = getGameConclusion(
            newGameState2,
            newGameState,
            "w"
        );
        expect(conclusionW).toEqual(undefined);
    });

    /// http://localhost:3000/?state=JTdCJTIyZmllbGQlMjIlM0ElNUIlMjJ3bC0xJTIyJTJDMCUyQzAlMkMlMjJ3Z3QlMjIlMkMlMjJici0zJTIyJTJDMCUyQyUyMnd2LTIlMjIlMkMlMjJ3Zy0yJTIyJTJDJTIyd2wtMiUyMiUyQzAlMkMwJTJDJTIyd3ItMyUyMiUyQzAlMkMwJTJDJTIyd3ItNiUyMiUyQyUyMndyLTclMjIlMkMwJTJDJTIyd3ItOSUyMiUyQyUyMndyLTElMjIlMkMlMjJ3ci0yJTIyJTJDMCUyQzAlMkMwJTJDMCUyQzAlMkMwJTJDMCUyQzAlMkMwJTJDMCUyQzAlMkMwJTJDJTIyYnItNiUyMiUyQzAlMkMwJTJDMCUyQzAlMkMwJTJDMCUyQyUyMndreiUyMiUyQzAlMkMwJTJDMCUyQzAlMkMlMjJ3ci04JTIyJTJDJTIyYnItMSUyMiUyQzAlMkMwJTJDJTIyd3YtMSUyMiUyQzAlMkMwJTJDMCUyQzAlMkMwJTJDMCUyQzAlMkMwJTJDMCUyQzAlMkMwJTJDMCUyQyUyMmJ2LTElMjIlMkMwJTJDMCUyQyUyMmJyLTIlMjIlMkMwJTJDMCUyQzAlMkMwJTJDJTIyYnItNyUyMiUyQyUyMmJyLTglMjIlMkMlMjJici05JTIyJTJDJTIyYmwtMSUyMiUyQyUyMmJnLTElMjIlMkMwJTJDJTIyYmtjJTIyJTJDJTIyYmt6JTIyJTJDJTIyd2ctMSUyMiUyQzAlMkMlMjJidi0yJTIyJTJDJTIyYmwtMiUyMiU1RCUyQyUyMmFjdGl2ZVNpZGUlMjIlM0ElMjJ3JTIyJTJDJTIyZmlndXJlc01vdmVkJTIyJTNBJTdCJTIyd3ItNCUyMiUzQXRydWUlMkMlMjJici0zJTIyJTNBdHJ1ZSUyQyUyMndnLTElMjIlM0F0cnVlJTJDJTIyYnYtMSUyMiUzQXRydWUlMkMlMjJ3ci01JTIyJTNBdHJ1ZSUyQyUyMndreiUyMiUzQXRydWUlMkMlMjJ3ci0yJTIyJTNBdHJ1ZSUyQyUyMmJyLTElMjIlM0F0cnVlJTJDJTIyYnItNiUyMiUzQXRydWUlMkMlMjJ3di0xJTIyJTNBdHJ1ZSUyQyUyMmJyLTQlMjIlM0F0cnVlJTJDJTIyYmtjJTIyJTNBdHJ1ZSUyQyUyMndyLTElMjIlM0F0cnVlJTJDJTIyd2wtMSUyMiUzQXRydWUlMkMlMjJiZy0yJTIyJTNBdHJ1ZSUyQyUyMndyLTglMjIlM0F0cnVlJTJDJTIyYmwtMSUyMiUzQXRydWUlN0QlMkMlMjJrYXJhbmFjeWphSGFwcGVuZWQlMjIlM0FmYWxzZSU3RA==
    it('two step promotion + rokash', () => {
        

        const gameState: GameStateSnapshot = {field:['wl-1',0,0,'wgt','br-3',0,'wv-2','wg-2','wl-2',0,0,'wr-3',0,0,'wr-6','wr-7',0,'wr-9','wr-1','wr-2',0,0,0,0,0,0,0,0,0,0,0,0,'br-6',0,0,0,0,0,0,'wkz',0,0,0,0,'wr-8','br-1',0,0,'wv-1',0,0,0,0,0,0,0,0,0,0,0,0,'bv-1',0,0,'br-2',0,0,0,0,'br-7','br-8','br-9','bl-1','bg-1',0,'bkc','bkz','wg-1',0,'bv-2','bl-2'],activeSide:'w',figuresMoved:{'wr-4':true,'br-3':true,'wg-1':true,'bv-1':true,'wr-5':true,wkz:true,'wr-2':true,'br-1':true,'br-6':true,'wv-1':true,'br-4':true,bkc:true,'wr-1':true,'wl-1':true,'bg-2':true,'wr-8':true,'bl-1':true},karanacyjaHappened:false};
        const from = {
            x: 3,
            y: 4
        };
        const to = {
            x: 4,
            y: 4
        };
        const newGameState = computeNewGameState(
            gameState,
            { motions: [{ from, to }], beatenFields: [], promotions: [] },
        );
        const conclusion = getGameConclusion(newGameState, gameState, "w");
        expect(conclusion).toEqual(undefined);
    });
})