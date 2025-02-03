"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "./ui/card";
import GameScreen from "./gameFrame";
import Background from "./background";
import { Star } from "lucide-react";
import { GameHUD } from "./gameHUD";

const MenuScreen = () => {
    const [gameStatus, setGameStatus] = useState<"idle" | "running" | "over">("idle");
    const [gameResult, setGameResult] = useState<{ winner: string } | null>(null);
    const [animateBackground, setAnimateBackground] = useState(false);
    
    // Health state
    const [player1Health, setPlayer1Health] = useState(3);
    const [player2Health, setPlayer2Health] = useState(3);

    // Function to play sound
    const playSound = (soundFile: string) => {
        const audio = new Audio(`/${soundFile}`);
        audio.play();
    };

    // Start game logic
    const startGame = async () => {
        setGameStatus("running");

        try {
            const response = await fetch('http://192.168.102.86:8080/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: "start" }),
            });

            if (!response.ok) throw new Error("Failed to start game");

            setGameResult(null);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Handle round results from GameScreen
    const handleRoundEnd = (winner: string) => {
        if (winner === "Player 1") {
            setPlayer2Health((prev) => Math.max(0, prev - 1));
        } else if (winner === "Player 2") {
            setPlayer1Health((prev) => Math.max(0, prev - 1));
        }

        if (player1Health === 1 && winner === "Player 2") {
            console.log("GAME OVER - Player 1 lost!");
        } else if (player2Health === 1 && winner === "Player 1") {
            console.log("GAME OVER - Player 2 lost!");
        }

        setGameStatus("over");
        setAnimateBackground(false);
    };

    return (
        <Background animateDown={animateBackground}>
            <div className="fixed flex items-center justify-center transition-all duration-500">
                {gameStatus === "running" ? (
                    <div className="flex items-center justify-center">
                        <GameScreen onGameOver={handleRoundEnd} />
                        <GameHUD
                            player1={{ name: "Cristie", health: player1Health }}
                            player2={{ name: "Opponent", health: player2Health }}
                        />
                    </div>
                ) : (
                    <Card className="min-w-96 min-h-64 flex flex-col gap-10 items-center justify-center mb-60">
                        <motion.img
                            src="/Cowboy Shootout.svg"
                            alt="Logo"
                            className="w-full"
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
                        />

                        {gameStatus === "over" && gameResult && (
                            <p className="text-lg text-red-500 mb-4">
                                {gameResult.winner} won the round!
                            </p>
                        )}
                        <motion.button
                            onClick={startGame}
                            className="button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Star className="svg-icon" />
                            {gameStatus === "over" ? "Restart Game" : "Start Game"}
                        </motion.button>
                    </Card>
                )}
            </div>
        </Background>
    );
};

export default MenuScreen;