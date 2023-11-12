import React, { useState } from 'react';
import { useDrag } from 'react-dnd';

function Piece({ id, color, shape, setHighlightedSquares }) {
  const [draggingIndex, setDraggingIndex] = useState({ row: 0, col: 0 });

  const [{ isDragging }, ref] = useDrag({
    type: 'PIECE',
    item: { id, draggingIndex },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: () => {
      setHighlightedSquares((prev) => []);
    },
  });

  const maxCol = Math.max(...shape.map((cell) => cell.col));
  const maxRow = Math.max(...shape.map((cell) => cell.row));

  return (
    <div
      ref={ref}
      className={`relative ${isDragging ? 'opacity-0' : 'opacity-100'} m-2.5 cursor-pointer`}
      style={{
        width: `${(maxCol + 1) * 48}px`,
        height: `${(maxRow + 1) * 48}px`,
        transform: 'translate(0,0)',
      }}
    >
      {shape.map((cell) => (
        <div
          key={`${cell.row}-${cell.col}`}
          className={`absolute w-12 h-12 ${color}`}
          style={{
            left: `${cell.col * 48}px`,
            top: `${cell.row * 48}px`,

            borderTop: '3px solid rgba(255, 255, 255, 0.1)',
            borderLeft: '3px solid rgba(255, 255, 255, 0.1)',
            borderBottom: '3px solid rgba(0, 0, 0, 0.1)',
            borderRight: '3px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '4px 4px',
          }}
          onClick={() => console.log(shape)}
          onMouseDown={(e) => setDraggingIndex({ row: cell.row, col: cell.col })}
        >
          <div
            className="topleft-circle"
            style={{
              position: 'absolute',
              zIndex: 10,
              width: '8px',
              height: '8px',
              left: '0px',
              top: '0px',
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
              borderRadius: '4px 4px',
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default Piece;
