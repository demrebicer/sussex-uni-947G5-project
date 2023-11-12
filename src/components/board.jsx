import React, { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { toast } from 'react-hot-toast';

const colors = {
  1: 'bg-red-500',
  2: 'bg-pink-600',
  3: 'bg-pink-400',
  4: 'bg-blue-600',
  5: 'bg-yellow-300',
  6: 'bg-purple-400',
  7: 'bg-purple-700',
  8: 'bg-green-400',
  9: 'bg-orange-600',
  10: 'bg-green-600',
  11: 'bg-amber-400',
  12: 'bg-cyan-400',
};

function Square({
  onDropPiece,
  pieces,
  index,
  highlightedSquares,
  setHighlightedSquares,
  boardState,
  setBoardState,
  highlightColor,
  setHighlightColor,
  canPlacePiece,
}) {
  function getRowAndColFromIndex(index) {
    const row = Math.floor(index / 11);
    const col = index % 11;
    return { row, col };
  }

  useEffect(() => {
    return () => {
      setHighlightedSquares([]);
    };
  }, [index]);

  const [, dropRef] = useDrop({
    accept: 'PIECE',
    drop: (item) => {
      const itemShape = pieces.find((piece) => piece.id === item.id).shape;
      const { row: squareRow, col: squareCol } = getRowAndColFromIndex(index);

      let offsetRow, offsetCol;
      if (item.draggingIndex) {
        const { row: draggingRowIndex, col: draggingColIndex } = item.draggingIndex;
        offsetRow = draggingRowIndex;
        offsetCol = draggingColIndex;
      } else {
        const { row: itemRow, col: itemCol } = itemShape[0];
        offsetRow = itemRow;
        offsetCol = itemCol;
      }

      if (!canPlacePiece(itemShape, squareRow - offsetRow, squareCol - offsetCol, item.id)) {
        return;
      }

      const squaresToUpdate = itemShape.map((cell) => {
        const { row: cellRow, col: cellCol } = cell;
        return (squareRow + cellRow - offsetRow) * 11 + squareCol + cellCol - offsetCol;
      });

      const cleanedBoardState = boardState.map((pieceId) => (pieceId === item.id ? null : pieceId));

      const newBoardState = [...cleanedBoardState];
      squaresToUpdate.forEach((squareIndex) => {
        newBoardState[squareIndex] = item.id;
      });

      setBoardState(newBoardState);
      onDropPiece(item.id, true);

      if (!newBoardState.includes(null)) {
        toast.success("Awesome work! You've solved the puzzle. Celebrate your victory! 🎉🏆", {
          duration: 5000,
        });
      }
    },

    hover: (item, monitor) => {
      const itemShape = pieces.find((piece) => piece.id === item.id).shape;
      const color = pieces.find((piece) => piece.id === item.id).color;

      setHighlightColor(color);

      if (!monitor.canDrop()) return;

      const { row: squareRow, col: squareCol } = getRowAndColFromIndex(index);

      let offsetRow, offsetCol;
      if (item.draggingIndex) {
        const { row: draggingRowIndex, col: draggingColIndex } = item.draggingIndex;
        offsetRow = draggingRowIndex;
        offsetCol = draggingColIndex;
      } else {
        const { row: itemRow, col: itemCol } = itemShape[0];
        offsetRow = itemRow;
        offsetCol = itemCol;
      }

      const newHighlightedSquares = itemShape.map((cell) => {
        const { row: cellRow, col: cellCol } = cell;
        return (squareRow + cellRow - offsetRow) * 11 + squareCol + cellCol - offsetCol;
      });

      if (!canPlacePiece(itemShape, squareRow - offsetRow, squareCol - offsetCol, item.id)) {
        return;
      }

      if (JSON.stringify(highlightedSquares) !== JSON.stringify(newHighlightedSquares)) {
        setHighlightedSquares(newHighlightedSquares);
      }
    },
  });

  const [, dragRef] = useDrag({
    type: 'PIECE',
    item: { id: boardState[index] },
    end: (item, monitor) => {
      if (!monitor.didDrop()) {
        const pieceToRemove = item.id;
        const newBoardState = boardState.map((pieceId) => (pieceId === pieceToRemove ? null : pieceId));
        setBoardState(newBoardState);
        onDropPiece(item.id, false);
        setHighlightedSquares([]);
      }
    },
  });

  const ref = (node) => {
    dropRef(node);
    if (boardState[index]) dragRef(node);
  };

  return (
    <div
      ref={ref}
      className={`w-12 h-12 border-r border-t border-white flex justify-center items-center ${
        highlightedSquares.includes(index) ? `bg-opacity-50 ${highlightColor}` : ''
      }`}
      style={{
        position: 'relative',
        zIndex: 1,
        transform: 'translate(0,0)',
        border: '2px solid rgba(255, 255, 255, 0.4)',
      }}
      onClick={() => {
        console.log(getRowAndColFromIndex(index));
      }}
    >
      {boardState[index] && (
        <div
          className={`w-full h-full ${colors[boardState[index]]}`}
          style={{
            height: '3rem',
            width: '3rem',
            position: 'absolute',
            top: '-2px',
            left: '-2px',
            zIndex: 2,
            borderTop: '3px solid rgba(255, 255, 255, 0.1)',
            borderLeft: '3px solid rgba(255, 255, 255, 0.1)',
            borderBottom: '3px solid rgba(0, 0, 0, 0.1)',
            borderRight: '3px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '4px 4px',
          }}
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
      )}
    </div>
  );
}

function Board({ onDropPiece, highlightedSquares, setHighlightedSquares, pieces, boardState, setBoardState, canPlacePiece }) {
  const [highlightColor, setHighlightColor] = useState('bg-yellow-300');

  return (
    <div
      className="grid grid-cols-11 w-full h-full border-l border-b border-gray-400"
      style={{
        border: '2px solid rgba(255, 255, 255, 0.4)',
      }}
    >
      {boardState.map((piece, index) => (
        <Square
          key={index}
          pieces={pieces}
          onDropPiece={onDropPiece}
          index={index}
          highlightedSquares={highlightedSquares}
          setHighlightedSquares={setHighlightedSquares}
          boardState={boardState}
          setBoardState={setBoardState}
          highlightColor={highlightColor}
          setHighlightColor={setHighlightColor}
          canPlacePiece={canPlacePiece}
        />
      ))}
    </div>
  );
}

export default Board;
