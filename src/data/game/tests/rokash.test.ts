import { computeNewGameState, GameStateSnapshot, getAvailableMotions, getGameConclusion } from "../domain";
import { chunk } from "lodash";

const sortMotions = (a, b) => a.y - b.y || a.x - b.x;

describe("rokash", () => {
    it("kniazhych should put rokash when no kniaz in palace", () => {
        const game: GameStateSnapshot = {"field":["wl-1","wv-1","wg-1","wgt",0,"wkc","wv-2","wg-2","wl-2","wr-1","wr-2",0,0,"wr-5","wr-6","wr-7","wr-8","wr-9",0,0,"wr-3",0,0,0,0,0,0,0,0,0,"wr-4",0,0,0,0,0,0,0,0,"br-4","wkz",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"bkc",0,0,0,0,0,"br-1","br-2","br-3",0,"br-5",0,"br-7","br-8","br-9","bl-1","bg-1","bv-1",0,"bkz","bgt","bg-2","bv-2","bl-2"],"activeSide":"b","figuresMoved":{"wr-4":true,"br-4":true,"wkz":true,"bkc":true,"wr-3":true,"br-6":true},"karanacyjaHappened":false};
        const motions = getAvailableMotions(game, { x: 3, y: 6 }, false);
        expect(motions.sort(sortMotions)).toEqual([
            { y: 4, x: 5 },
            { y: 5, x: 3 },
            { y: 5, x: 4 },
            { y: 6, x: 2 },
            { y: 6, x: 4 },
        ]);
    })
})