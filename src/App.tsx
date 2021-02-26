import React, { useEffect, useState } from 'react';
import { useHandler } from "react-use-handler";
import { ThemeProvider } from "styled-components";
import { Game } from "src/app/Game";
import { MAX_GAME_SIZE } from './app/Game/Game.styles';

const getGameSize = () => {
  const windowMinSize = Math.min(window.innerWidth, window.innerHeight);
  return Math.min(windowMinSize, MAX_GAME_SIZE);
};

const useTheme = () => {
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

function App() {
  const theme = useTheme();
  return (
    <ThemeProvider theme={theme} >
      <Game />
    </ThemeProvider>
  );
}

export default App;
