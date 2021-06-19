import React, { useEffect, useState } from 'react';
import { useHandler } from "react-use-handler";
import { ThemeProvider } from "styled-components";
import { Root } from "src/app/Root";
import { MAX_GAME_SIZE } from './utils/scale';
import { Provider } from "react-redux";
import { createApplicationStore, RootState } from './data/store';
import { State as GameState } from './data/game/slice';

const getGameSize = () => {
  const windowMinSize = Math.min(window.innerWidth, window.innerHeight);
  return Math.min(windowMinSize, MAX_GAME_SIZE);
};

const getPreloadedState = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  
  const stateBase64 = urlParams.get("state") as string;
  if (!stateBase64) {
    return undefined;
  }
  const param = decodeURIComponent(atob(stateBase64));
  if (param) {
    return {
      game: { gameState: JSON.parse(param), history: [] }  as GameState,
    };
  }
  return undefined;
}

export const useAppTheme = () => {
  const [gameSize, setGameSize] = useState<number>(getGameSize());
  const onResize = useHandler((ev: UIEvent) => {
    setGameSize(getGameSize());
  });
  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return {
    gameSize,
  }
};
const store = createApplicationStore(getPreloadedState());

function App() {
  const theme = useAppTheme();
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme} >
        <Root />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
