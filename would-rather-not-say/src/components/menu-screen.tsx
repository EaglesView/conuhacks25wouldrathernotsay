"use client";
import { useState } from "react";
import Card from "./ui/card";
import GameScreen from "./gameFrame";




const MenuScreen = () => {
  const [gameStatus, setGameStatus] = useState<"idle" | "running" | "over">("idle");

  const startGame = async () => {
    setGameStatus("running");
  };



  return (
    <div className="fixed flex items-center justify-center transition-all duration-500">
      {gameStatus === "running" ? (
        <GameScreen onGameOver={() => setGameStatus("over")} />
      ) : (
        <Card className="min-w-96 min-h-64 flex flex-col gap-10 items-center justify-center mb-60">
          <h1 className={`text-6xl mb-6 p-4 text-black `}>Cowboy Shootout</h1>
          {gameStatus === "over" && <p className="text-lg text-red-500 mb-4">Game Over!</p>}
          <button
            onClick={startGame}
            className="px-6 py-2 text-lg bg-green-600 hover:bg-green-700 rounded-lg"
          >
            {gameStatus === "over" ? "Restart Game" : "Start Game"}
          </button>
        </Card>
      )}
    </div>
  );
};

export default MenuScreen;
