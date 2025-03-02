import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Define obstacles for the level (a vertical barrier with a gap)
const obstacles = [
  { x: 250, y: 0, width: 20, height: 150 },
  { x: 250, y: 200, width: 20, height: 300 },
];

// Simple collision detection between two rectangles
function isColliding(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

function Game() {
  const [fireboyPos, setFireboyPos] = useState({ x: 400, y: 400 });
  const [watergirlPos, setWatergirlPos] = useState({ x: 50, y: 50 });
  const [gameWon, setGameWon] = useState(false);
  const moveAmount = 10; // Pixels moved per key press

  // Handles movement and prevents collisions with obstacles
  const handleMove = (pos, newX, newY) => {
    const clampedX = Math.max(0, Math.min(newX, 500 - 40));
    const clampedY = Math.max(0, Math.min(newY, 500 - 40));
    const candidateRect = { x: clampedX, y: clampedY, width: 40, height: 40 };
    for (let obs of obstacles) {
      if (isColliding(candidateRect, obs)) {
        return pos;
      }
    }
    return { x: clampedX, y: clampedY };
  };

  // Listen for key presses to move characters
  const handleKeyDown = (e) => {
    if (gameWon) return;
    // Fireboy (Arrow keys)
    if (e.key === "ArrowUp") {
      setFireboyPos((pos) => handleMove(pos, pos.x, pos.y - moveAmount));
    } else if (e.key === "ArrowDown") {
      setFireboyPos((pos) => handleMove(pos, pos.x, pos.y + moveAmount));
    } else if (e.key === "ArrowLeft") {
      setFireboyPos((pos) => handleMove(pos, pos.x - moveAmount, pos.y));
    } else if (e.key === "ArrowRight") {
      setFireboyPos((pos) => handleMove(pos, pos.x + moveAmount, pos.y));
    }
    // Watergirl (WASD keys)
    else if (e.key.toLowerCase() === "w") {
      setWatergirlPos((pos) => handleMove(pos, pos.x, pos.y - moveAmount));
    } else if (e.key.toLowerCase() === "s") {
      setWatergirlPos((pos) => handleMove(pos, pos.x, pos.y + moveAmount));
    } else if (e.key.toLowerCase() === "a") {
      setWatergirlPos((pos) => handleMove(pos, pos.x - moveAmount, pos.y));
    } else if (e.key.toLowerCase() === "d") {
      setWatergirlPos((pos) => handleMove(pos, pos.x + moveAmount, pos.y));
    }
  };

  // Check win condition: both characters must be in the door area
  useEffect(() => {
    const doorArea = { x: 400, y: 400, width: 50, height: 50 };
    const isInsideDoor = (pos) =>
      pos.x >= doorArea.x &&
      pos.x <= doorArea.x + doorArea.width - 40 &&
      pos.y >= doorArea.y &&
      pos.y <= doorArea.y + doorArea.height - 40;
    if (isInsideDoor(fireboyPos) && isInsideDoor(watergirlPos)) {
      setGameWon(true);
    }
  }, [fireboyPos, watergirlPos]);

  // Attach keydown event listener
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameWon]);

  return (
    <div className="text-center mt-5">
      <h1 className="text-3xl font-bold">Fireboy and Watergirl for Jannu</h1>

      {/* Only show game board if game is not won */}
      {!gameWon && (
        <div className="relative w-[500px] h-[500px] border-2 border-black mx-auto bg-gray-200 mt-5">
          {/* Door Area */}
          <div className="absolute left-[400px] top-[400px] w-[50px] h-[50px] bg-green-500 opacity-50"></div>
          {/* Obstacles */}
          {obstacles.map((obs, index) => (
            <div
              key={index}
              className="absolute bg-gray-600"
              style={{
                left: obs.x,
                top: obs.y,
                width: obs.width,
                height: obs.height,
              }}
            ></div>
          ))}
          {/* Fireboy */}
          <div
            className="absolute w-[40px] h-[40px] bg-red-500"
            style={{ left: fireboyPos.x, top: fireboyPos.y }}
          ></div>
          {/* Watergirl */}
          <div
            className="absolute w-[40px] h-[40px] bg-blue-500"
            style={{ left: watergirlPos.x, top: watergirlPos.y }}
          ></div>
        </div>
      )}

      {/* Win Message with Shake Animation */}
      {gameWon && (
        <motion.h2
          className="text-2xl text-gray-500 font-semibold mt-4"
          animate={{ x: [0, -10, 10, -10, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          I am proud of you mi amor! You are the best and together we will be
          the best team. In some things I am already there, in some stuff I am
          still getting there. But whatever it is, the important part is to wait
          while the other gets there. Thanks for being my water girl in life. I
          am sorry, I can't do pixel art that moves properly so I made pixels
        </motion.h2>
      )}

      {/* Only show controls when the game is active */}
      {!gameWon && (
        <div className="max-w-md mx-auto mt-4 text-left">
          <p className="font-bold">Controls de Jannu</p>
          <ul className="list-disc pl-5">
            <li>Fireboy (red): Arrow keys ( I am already there )</li>
            <li>Watergirl (blue): WASD keys</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Game;
