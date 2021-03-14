import React, { ChangeEvent, useState } from "react";
import { useHandler } from "react-use-handler";
import { useDispatch, useSelector } from "react-redux";
import { resetGame, initialState, State as AppGameState } from "src/data/game/slice";
import { RootState } from "src/data/store";
import { GameStateSnapshot, Side } from "src/data/game/domain";
import { Game } from "../Game";

export const Root = () => {
    const dispatch = useDispatch();
    const state = useSelector(({ game }: RootState) => game);
    const { gameState } = state;
    const [displaySide, setDisplaySide] = useState<Side>("w");
    const [loadedState, setLoadedState] = useState<string>("");
    const onLoadedStateChange = useHandler((e: ChangeEvent<HTMLInputElement>) => {
        setLoadedState(e.target.value);
    });
    const loadGame = useHandler(() => {
        try {
            
            dispatch(resetGame({
                history: [],
                gameState: JSON.parse(loadedState!) as GameStateSnapshot
            }));
        } catch(err) {
            dispatch(resetGame(initialState));
        }
    });
    return (
        <div>
            <Game displaySide={displaySide} />
            <div>
                <input
                    onChange={(event) => setDisplaySide(event.target.value as Side)}
                    type="radio"
                    value="w"
                    checked={displaySide === "w"}
                    name="displaySide"
                />
                Bely
                <input
                    onChange={(event) => setDisplaySide(event.target.value as Side)}
                    type="radio"
                    value="b"
                    checked={displaySide === "b"}
                    name="displaySide"
                />
                Čorny
            </div>
            <div>
                LOAD GAME
                <input onChange={onLoadedStateChange} value={loadedState} />
                <button onClick={() => { loadGame(); }} >RESET</button>
            </div>
            <button onClick={() => {
                const gameStateJson = JSON.stringify(gameState);
                console.log(`GAME STATE: ${gameStateJson}`);
                const gameStateEncoded = encodeURIComponent(gameStateJson);
                const base64 = btoa(gameStateEncoded);
                console.log(`base64: ${base64}`);
                console.log(`uri: https://kniazhych.herokuapp.com?state=${base64}`);
            }} >PRINT</button>
        </div>
    )
};
