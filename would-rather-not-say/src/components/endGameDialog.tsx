"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LeaderBoard from "./leaderBoard";
import { ScrollArea } from "@/components/ui/scroll-area"

export const EndGameDialog = ({ panda,onGameOver }: { panda: string; loser: string;onGameOver?: (theBigWinner: string) => void  }) => {
  const [winnerName, setWinnerName] = useState("");
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Winner's Name:", winnerName);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open</Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center">
        <DialogHeader>
          <DialogTitle className="text-red-700 text-center text-6xl">Game Over</DialogTitle>
        </DialogHeader>


        {/* Main Centered Container */}
        <div className="flex justify-evenly items-center w-full gap-12 mt-4">
          {/* Game Over Section */}
          <div className="text-center flex flex-col gap-12 justify-">
            <p className="text-4xl">
              👑 Winner: <span className="text-yellow-500">{panda}</span>
            </p>
            {/* <p className="text-2xl mt-2">
              😢 Loser: <span className="text-red-500">{loser}</span>
            </p> */}


            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <Input
                type="text"
                placeholder="Winner's Name"
                value={winnerName}
                onChange={(e) => setWinnerName(e.target.value)}
              />y
              <Button onClick={() => onGameOver(panda)} >Submit</Button>
            </form>
          </div>
          {/* Submit Section */}
          <div className="flex flex-col items-center justify-center w-[40%]">

            <LeaderBoard
              players={[
                { name: "TJ", reactionTime: 500, points: 10 },
                { name: "Kim", reactionTime: 420, points: 12 },
                { name: "Alex", reactionTime: 550, points: 8 },
                { name: "Jordan", reactionTime: 390, points: 15 },
                { name: "Chris", reactionTime: 600, points: 6 },
                { name: "Taylor", reactionTime: 480, points: 11 },
                { name: "Morgan", reactionTime: 530, points: 9 },
                { name: "Jamie", reactionTime: 450, points: 13 },
                { name: "Pat", reactionTime: 570, points: 7 },
                { name: "Charlie", reactionTime: 510, points: 10 },
                { name: "Sam", reactionTime: 460, points: 14 },
                { name: "Jesse", reactionTime: 490, points: 12 },
                { name: "Blake", reactionTime: 580, points: 5 },
                { name: "Casey", reactionTime: 400, points: 16 },
                { name: "Drew", reactionTime: 620, points: 4 },
                { name: "Riley", reactionTime: 440, points: 13 },
                { name: "Alexis", reactionTime: 470, points: 11 },
                { name: "Quinn", reactionTime: 590, points: 6 },
                { name: "Dakota", reactionTime: 530, points: 9 },
                { name: "Skylar", reactionTime: 410, points: 15 },
              ]}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
