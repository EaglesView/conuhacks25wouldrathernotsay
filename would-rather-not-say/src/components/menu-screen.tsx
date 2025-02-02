"use client";
import { useState, useEffect } from "react";
import Card from "./ui/card";
import GameScreen from "./gameFrame";

const MenuScreen = () => {
    const [gameStatus, setGameStatus] = useState<"idle" | "running" | "over">("idle");
    const [gameResult, setGameResult] = useState<{ score: number; message: string } | null>(null);

    const startGame = async () => {
        setGameStatus("running");

        try {
            const response = await fetch('http://192.168.102.86:8080/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: "start" }),
            });

            if (!response.ok) throw new Error("Failed to start game");

            setGameResult(null); // Reset game result before starting
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        if (gameStatus !== "running") return;

        const interval = setInterval(async () => {
            try {
                const response = await fetch('http://192.168.102.86:8080/');
                
                if (response.status === 200) {
                    const data = await response.json();
                    setGameResult(data);
                    setGameStatus("over");
                    clearInterval(interval);
                }
            } catch (error) {
                console.error('Error fetching game result:', error);
            }
        }, 1000); // Poll every second

        return () => clearInterval(interval);
    }, [gameStatus]);

    return (
        <div className="fixed flex items-center justify-center transition-all duration-500">
            {gameStatus === "running" ? (
                <GameScreen onGameOver={() => setGameStatus("over")} />
            ) : (
                <Card className="min-w-96 min-h-64 flex flex-col gap-10 items-center justify-center mb-60">
                    <img src="/Cowboy Shootout.svg" alt="Logo" className="w-full " />
                    {gameStatus === "over" && gameResult && (
                        <p className="text-lg text-red-500 mb-4">
                            {gameResult.message} - Score: {gameResult.score}
                        </p>
                    )}
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
