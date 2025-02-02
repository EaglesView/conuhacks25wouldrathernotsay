"use client";

import { useState, useEffect } from "react";

const GameScreen = ({ onGameOver }: { onGameOver: (winner: string) => void }) => {
  const [status, setStatus] = useState("Waiting for game data...");
  const [imageData, setImageData] = useState<boolean>(false);
  const [winner, setWinner] = useState("");

  useEffect(() => {
    const img = document.getElementById("video_feed") as HTMLImageElement;

    if (img) {
      img.onerror = () => {
        console.log("Connexion perdue. Tentative de reconnexion...");
        setTimeout(() => location.reload(), 3000);
      };
    }

    setTimeout(() => {
      setImageData(true);
      setStatus("Game data received!");
    }, 3000);
  }, []);

  useEffect(() => {
    const checkWinner = async () => {
      try {
        const response = await fetch("http://192.168.102.5:8080/");
        if (response.status === 200) {
          const data = await response.json();
          if (data.winner) {
            setWinner(data.winner);
            onGameOver(data.winner); // Notify MenuScreen
          }
        }
      } catch (error) {
        console.error("Error fetching winner:", error);
      }
    };

    const winnerCheckInterval = setInterval(checkWinner, 2000);
    return () => clearInterval(winnerCheckInterval);
  }, [onGameOver]);

  return (
    <div className="flex justify-center items-center">
      <p className="fixed bottom-0">{status}</p>
      {imageData ? (
        <img
          id="video_feed"
          src="http://192.168.102.5:5000/video_feed"
          className="transform scale-x-[-1] rounded-sm w-auto h-screen"
        />
      ) : (
        <p>Waiting for game data...</p>
      )}
    </div>
  );
};

export default GameScreen;
