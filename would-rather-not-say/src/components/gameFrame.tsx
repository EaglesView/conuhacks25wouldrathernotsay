"use client";

import { useState, useEffect } from "react";
import { EndGameDialog } from "./endGameDialog";
import { useRouter } from "next/navigation";

const GameScreen = ({ onGameOver }: { onGameOver: (theBigWinner: string) => void }) => {
  const [status, setStatus] = useState("Waiting for game data...");
  const [imageData, setImageData] = useState<boolean>(false);
  const [winner, setWinner] = useState<any>(null);
  const router = useRouter();

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
        const response = await fetch("http://192.168.102.86:8080/");
        if (response.status === 200) {
          const data = await response.json();
          console.log(data);
          if (data && data.message) {
            setWinner(data.message);
            router.push(`/lol?message=${encodeURIComponent(data.message)}`);
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
