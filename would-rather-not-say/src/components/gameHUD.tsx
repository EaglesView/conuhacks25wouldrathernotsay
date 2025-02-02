import React from 'react';
import Image from 'next/image';

interface PlayerHealthProps {
  playerPts: number; // Number of health points remaining
  reverse?: boolean; // Whether to reverse the order
  name: string; // Player name
  position: 'left' | 'right'; // Positioning of the HUD
}

const PlayerHealthHud = ({ playerPts, reverse = false, name, position }: PlayerHealthProps) => {
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
            src={index < playerPts ? '/start_light.svg' : '/start_dark.svg'}
            alt="Health Icon"
            width={75}
            height={75}
          />
        ))}
      </div>
    </div>
  );
};
interface GameHudProps {
  player1:{name:string,health:number};
  player2:{name:string,health:number};
}
export const GameHUD:React.FC<GameHudProps> = ({player1,player2}) => {
  return (
    <div className="absolute w-screen top-6">
      <PlayerHealthHud playerPts={player1.health} name={player1.name} position="left" />
      <PlayerHealthHud playerPts={player2.health} name={player2.name} position="right" reverse />
    </div>
  );
};
