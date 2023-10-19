import React, { useState, useEffect } from "react";
import { GiQueenCrown } from "react-icons/gi";

const ChessBoard = ({ queens, n, addOrRemoveQueen, isQueen }) => {
  const rows = Array.from({ length: n }, (_, i) => n - i - 1);
  const cols = Array.from({ length: n }, (_, i) => i);

  const cellSize = 480 / n;

  return (
    <div className="flex justify-center items-center">
      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${n}, ${cellSize}px)` }}
      >
        {rows.map((row) =>
          cols.map((col) => {
            const isBlack = (row + col) % 2 === 1;
            return (
              <div
                key={col + row}
                className={`relative ${isBlack ? "bg-black" : "bg-white"}`}
                style={{ width: cellSize, height: cellSize }}
                onClick={() => addOrRemoveQueen(row, col)}
              >
                {isQueen(row, col) && (
                  <GiQueenCrown
                    className={`
                    absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    ${cellSize > 30 ? "text-4xl" : "text-2xl"} 
                    ${isBlack ? "text-white" : "text-black"}
                  `}
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChessBoard;
