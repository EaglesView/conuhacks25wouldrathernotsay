import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

const LeaderBoard = ({
  players,
}: {
  players: { name: string; reactionTime: number; points: number }[];
}) => {
  return (
    <>
    <p className="text-2xl">🏆 Leader Board</p>
    <ScrollArea className="w-full max-h-[300px] overflow-auto p-1">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="text-center">Time (ms)</TableHead>
            <TableHead className="text-right">Points</TableHead>
          </TableRow>
        </TableHeader>
          <TableBody>
            {players.map((player, index) => (
              <TableRow key={index}>
                <TableCell>{player.name}</TableCell>
                <TableCell className="text-center">{player.reactionTime}</TableCell>
                <TableCell className="text-right">{player.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableCaption>🏆 Leader Board</TableCaption>
      </Table>
    </ScrollArea>
    </>
  );
};

export default LeaderBoard;
