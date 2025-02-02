"use client";
import { useEffect, useState } from "react";

const GAME_SERVER = "ws://localhost:8765"; // Replace with actual WebSocket URL

const GameScreen = ({ onGameOver }: { onGameOver: () => void }) => {
  const [imageData, setImageData] = useState<string | null>(null);

  useEffect(() => {
    const ws = new WebSocket(GAME_SERVER);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.image) {
          setImageData(`data:image/jpeg;base64,${data.image}`);
        }
        if (data.game_over) {
          onGameOver();
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    return () => ws.close();
  }, [onGameOver]);

  return (
    <div className="flex justify-center items-center">
      {imageData ? (
        <img src={imageData} alt="Game Feed" className="w-full max-w-screen-md rounded-lg shadow-lg" />
      ) : (
        <p>Waiting for game data...</p>
      )}
    </div>
  );
};

export default GameScreen;
