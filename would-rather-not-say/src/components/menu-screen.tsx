"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "./ui/card";
import GameScreen from "./gameFrame";
import Background from "./background";
import { Star } from "lucide-react";
import { GameHUD } from "./gameHUD";
interface MenuScreenProps {
    buttonTitle?:string;
}
const MenuScreen:React.FC<MenuScreenProps> = ({buttonTitle}) => {
    const [gameStatus, setGameStatus] = useState<"idle" | "running" | "over">("idle");
    const [gameResult, setGameResult] = useState<{ winner: string } | null>(null);
    const [animateBackground, setAnimateBackground] = useState(false);
    let panda;
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

    const handleRoundEnd = (winner: string) => {
        setGameStatus("over");
        console.log(winner)
        panda = winner;
        if (winner === "Player 1") {
            setPlayer2Health((prevHealth) => {
                const newHealth = Math.max(0, prevHealth - 1);
                if (newHealth === 0) {
                    console.log("GAME OVER - Player 2 lost!");
                }
                return newHealth;
            });
        } else if (winner === "Player 2") {
            setPlayer1Health((prevHealth) => {
                const newHealth = Math.max(0, prevHealth - 1);
                if (newHealth === 0) {
                    console.log("GAME OVER - Player 1 lost!");
                }
                return newHealth;
            });
        }
    };
    

    return (
        <Background animateDown={animateBackground}>
            <div className="fixed flex items-center justify-center transition-all duration-500">
                {gameStatus === "running" ? (
                    <>
                        <GameScreen onGameOver={handleRoundEnd} />
                        <GameHUD
                            player1={{ name: "Cristie", health: player1Health }}
                            player2={{ name: "Opponent", health: player2Health }}
                        />
                    </>
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
                            {buttonTitle ? buttonTitle : "Start Game"}
                        </motion.button>
                    </Card>
                )}
            </div>
        </Background>
    );
};

export default MenuScreen;