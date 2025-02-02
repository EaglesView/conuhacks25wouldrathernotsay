import React from 'react';
import Image from 'next/image';

interface PlayerHealthProps {
  player: number; // Number of health points remaining
  reverse?: boolean; // Whether to reverse the order
  name: string; // Player name
  position: 'left' | 'right'; // Positioning of the HUD
}

const PlayerHealthHud = ({ player, reverse = false, name, position }: PlayerHealthProps) => {
  const maxHealth = 3;
  const healthArray = [...Array(maxHealth)].map((_, index) => index); // Create an array [0,1,2]

  return (
    <div
      className={`absolute top-4 ${position === 'left' ? 'left-4 text-left' : 'right-4 text-right'}`}
    >
      <p className="text-black text-4xl mb-2">{name}</p>
      <div className={`flex gap-2 ${reverse ? 'flex-row-reverse' : ''}`}>
        {healthArray.map((index) => (
          <Image
            key={index}
            src={index < player ? '/start_light.svg' : '/start_dark.svg'}
            alt="Health Icon"
            width={75}
            height={75}
          />
        ))}
      </div>
    </div>
  );
};

export const GameHUD = ({ player1Health, player2Health }: { player1Health: number; player2Health: number }) => {
  return (
    <div className="relative w-screen">
      <PlayerHealthHud player={player1Health} name="User1" position="left" />
      <PlayerHealthHud player={player2Health} name="User2" position="right" reverse />
    </div>
  );
};
