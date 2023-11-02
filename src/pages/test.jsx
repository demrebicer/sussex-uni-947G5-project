import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FiRotateCw } from 'react-icons/fi';
import { LuFlipHorizontal } from 'react-icons/lu';
import { toast } from 'react-hot-toast';

export const initialPieces = [
  {
    id: 1,
    color: 'bg-red-500',
    isOnBoard: false,
    shape: [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 1, col: 0 },
      { row: 1, col: 2 },
    ],
  },
  {
    id: 2,
    color: 'bg-pink-600',
    isOnBoard: false,
    shape: [
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 0, col: 2 },
      { row: 0, col: 3 },
    ],
  },
  {
    id: 3,
    color: 'bg-pink-400',
    isOnBoard: false,
    shape: [
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 2, col: 1 },
      { row: 2, col: 2 },
    ],
  },
  {
    id: 4,
    color: 'bg-blue-600',
    isOnBoard: false,
    shape: [
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
    ],
  },
  {
    id: 5,
    color: 'bg-yellow-300',
    isOnBoard: false,
    shape: [
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 1, col: 3 },
    ],
  },
  {
    id: 6,
    color: 'bg-purple-400',
    isOnBoard: false,
    shape: [
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
    ],
  },
  {
    id: 7,
    color: 'bg-purple-700',
    isOnBoard: false,
    shape: [
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
    ],
  },
  {
    id: 8,
    color: 'bg-green-400',
    isOnBoard: false,
    shape: [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 2, col: 0 },
    ],
  },
  {
    id: 9,
    color: 'bg-orange-600',
    isOnBoard: false,
    shape: [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 1, col: 2 },
      { row: 2, col: 2 },
    ],
  },
  {
    id: 10,
    color: 'bg-green-600',
    isOnBoard: false,
    shape: [
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 1, col: 3 },
    ],
  },
  {
    id: 11,
    color: 'bg-amber-400',
    isOnBoard: false,
    shape: [
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
    ],
  },
  {
    id: 12,
    color: 'bg-cyan-400',
    isOnBoard: false,
    shape: [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 2, col: 2 },
    ],
  },
];

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

      if (!canPlacePiece(boardState, itemShape, squareRow - offsetRow, squareCol - offsetCol, item.id)) {
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

      if (!canPlacePiece(boardState, itemShape, squareRow - offsetRow, squareCol - offsetCol, item.id)) {
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
      className={`w-12 h-12 border-r border-t border-gray-400 flex justify-center items-center ${
        highlightedSquares.includes(index) ? `bg-opacity-50 ${highlightColor}` : ''
      }`}
      style={{
        position: 'relative',
        zIndex: 1,
        transform: 'translate(0,0)',
        border: '2px solid rgba(255, 255, 255, 0.2)',
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
        border: '2px solid rgba(255, 255, 255, 0.2)',
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

function Test() {
  const [boardState, setBoardState] = useState(Array(5 * 11).fill(null));
  const [pieces, setPieces] = useState(initialPieces);
  const [highlightedSquares, setHighlightedSquares] = useState([]);

  function canPlacePiece(internalBoardState, itemShape, targetRow, targetCol, itemId) {
    return itemShape.every((cell) => {
      const { row: cellRow, col: cellCol } = cell;
      const finalRow = targetRow + cellRow;
      const finalCol = targetCol + cellCol;

      if (finalRow < 0 || finalRow >= 5 || finalCol < 0 || finalCol >= 11) {
        return false;
      }

      const existingPieceId = internalBoardState[finalRow * 11 + finalCol];
      if (existingPieceId && existingPieceId !== itemId) {
        return false;
      }

      return true;
    });
  }

  const handleDropPiece = (id, isOnBoard) => {
    setPieces((prev) => prev.map((piece) => (piece.id === id ? { ...piece, isOnBoard } : piece)));
    console.log(`Parça ${id} tahtaya bırakıldı.`);
  };

  const handleRotate = (id) => {
    return new Promise((resolve) => {
      setPieces((prevPieces) => {
        return prevPieces.map((piece) => {
          if (piece.id !== id) {
            return piece;
          }

          const rotatedShape = piece.shape.map((coord) => ({
            row: coord.col,
            col: -coord.row,
          }));

          const minRow = Math.min(...rotatedShape.map((coord) => coord.row));
          const minCol = Math.min(...rotatedShape.map((coord) => coord.col));

          const normalizedShape = rotatedShape.map((coord) => ({
            row: coord.row - minRow,
            col: coord.col - minCol,
          }));

          const sortedShape = normalizedShape.sort((a, b) => {
            if (a.row !== b.row) {
              return a.row - b.row;
            }
            return a.col - b.col;
          });

          const updatedPiece = {
            ...piece,
            shape: sortedShape,
          };

          resolve(updatedPiece);

          return updatedPiece;
        });
      });
    });
  };

  const handleFlip = (id) => {
    return new Promise((resolve) => {
      setPieces((prevPieces) => {
        return prevPieces.map((piece) => {
          if (piece.id !== id) {
            return piece;
          }

          const maxCol = Math.max(...piece.shape.map((coord) => coord.col));
          const minCol = Math.min(...piece.shape.map((coord) => coord.col));
          const width = maxCol - minCol + 1;

          const flippedShape = piece.shape.map((coord) => ({
            row: coord.row,
            col: minCol + (width - 1) - (coord.col - minCol),
          }));

          const sortedShape = flippedShape.sort((a, b) => {
            if (a.row !== b.row) {
              return a.row - b.row;
            }
            return a.col - b.col;
          });

          const updatedPiece = {
            ...piece,
            shape: sortedShape,
          };

          resolve(updatedPiece);

          return updatedPiece;
        });
      });
    });
  };

  const handlePutRandomPiece = () => {
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
    const randomRow = Math.floor(Math.random() * 5);
    const randomCol = Math.floor(Math.random() * 11);

    if (canPlacePiece(boardState, randomPiece.shape, randomRow, randomCol, randomPiece.id)) {
      const squaresToUpdate = randomPiece.shape.map((cell) => {
        const { row: cellRow, col: cellCol } = cell;
        return (randomRow + cellRow) * 11 + randomCol + cellCol;
      });

      const cleanedBoardState = boardState.map((pieceId) => (pieceId === randomPiece.id ? null : pieceId));

      const newBoardState = [...cleanedBoardState];
      squaresToUpdate.forEach((squareIndex) => {
        newBoardState[squareIndex] = randomPiece.id;
      });

      setBoardState(newBoardState);
      handleDropPiece(randomPiece.id, true);
    } else {
      // toast.error("This piece can't fit here!");
    }
  };

  const simplePutPiece = () => {
    let updatedBoardState;

    let piece1 = pieces[0];
    const row1 = 0;
    const col1 = 0;

    let piece2 = pieces[2];
    const row2 = 1;
    const col2 = 5;

    const placePiece = (piece, row, col, currentBoardState) => {
      const squaresToUpdate = piece.shape.map((cell) => {
        const { row: cellRow, col: cellCol } = cell;
        return (row + cellRow) * 11 + col + cellCol;
      });

      const cleanedBoardState = currentBoardState.map((pieceId) => (pieceId === piece.id ? null : pieceId));

      const newBoardState = [...cleanedBoardState];
      squaresToUpdate.forEach((squareIndex) => {
        newBoardState[squareIndex] = piece.id;
      });

      handleDropPiece(piece.id, true);
      return newBoardState;
    };

    updatedBoardState = placePiece(piece1, row1, col1, boardState);
    updatedBoardState = placePiece(piece2, row2, col2, updatedBoardState);

    setBoardState(updatedBoardState);
  };

  const transformPiece = async (piece, transformations) => {
    for (const transform of transformations) {
      if (transform === 'rotate') {
        piece = await handleRotate(piece.id);
      } else if (transform === 'flip') {
        piece = await handleFlip(piece.id);
      }
    }
    return piece;
  };

  const placePiece = (piece, row, col, currentBoardState) => {
    let offsetRow, offsetCol;

    const { row: itemRow, col: itemCol } = piece.shape[0];
    offsetRow = itemRow;
    offsetCol = itemCol;

    console.log(piece.shape, row - offsetRow, col - offsetCol, piece.id);
    if (!canPlacePiece(currentBoardState, piece.shape, row - offsetRow, col - offsetCol, piece.id)) {
      return currentBoardState;
    }

    const squaresToUpdate = piece.shape.map((cell) => {
      const { row: cellRow, col: cellCol } = cell;
      return (row + cellRow - offsetRow) * 11 + col + cellCol - offsetCol;
    });

    const cleanedBoardState = currentBoardState.map((pieceId) => (pieceId === piece.id ? null : pieceId));

    const newBoardState = [...cleanedBoardState];
    squaresToUpdate.forEach((squareIndex) => {
      newBoardState[squareIndex] = piece.id;
    });

    handleDropPiece(piece.id, true);
    return newBoardState;
  };

  function generateRandomPiecesTransformations() {
    const piecesTransformations = [];
    const transformations = ['rotate', 'flip'];

    for (let i = 0; i < 12; i++) {
      const randomTransformations = [];
      const numberOfTransformations = Math.floor(Math.random() * 3);

      for (let j = 0; j < numberOfTransformations; j++) {
        const transformation = transformations[Math.floor(Math.random() * transformations.length)];
        if (!randomTransformations.includes(transformation)) {
          randomTransformations.push(transformation);
        }
      }

      piecesTransformations.push({
        pieceIndex: i,
        transformations: randomTransformations,
        row: Math.floor(Math.random() * 5),
        col: Math.floor(Math.random() * 11),
      });
    }

    return piecesTransformations;
  }

  const enhancedPutPieces = async () => {
    let updatedBoardState = [...boardState];

    const transformPiece = async (piece, transformations) => {
      for (const transform of transformations) {
        if (transform === 'rotate') {
          piece = await handleRotate(piece.id);
        } else if (transform === 'flip') {
          piece = await handleFlip(piece.id);
        }
      }
      return piece;
    };

    const piecesTransformations = [
      { pieceIndex: 0, transformations: ['rotate'], row: 0, col: 2 },
      { pieceIndex: 1, transformations: ['rotate'], row: 1, col: 6 },
      { pieceIndex: 2, transformations: ['rotate', 'rotate'], row: 0, col: 0 },
      { pieceIndex: 3, transformations: [], row: 3, col: 5 },
      { pieceIndex: 4, transformations: ['flip', 'rotate'], row: 0, col: 4 },
      { pieceIndex: 5, transformations: [], row: 3, col: 9 },
      { pieceIndex: 6, transformations: ['rotate'], row: 1, col: 7 },
      { pieceIndex: 7, transformations: ['flip'], row: 0, col: 9 },
      { pieceIndex: 8, transformations: ['rotate', 'rotate'], row: 1, col: 0 },
      { pieceIndex: 9, transformations: ['flip'], row: 3, col: 3 },
      { pieceIndex: 10, transformations: ['rotate'], row: 0, col: 5 },
      { pieceIndex: 11, transformations: [], row: 0, col: 7 },
    ];

    for (const pieceTransform of piecesTransformations) {
      let piece = pieces[pieceTransform.pieceIndex];
      piece = await transformPiece(piece, pieceTransform.transformations);
      updatedBoardState = placePiece(piece, pieceTransform.row, pieceTransform.col, updatedBoardState);
    }

    setBoardState(updatedBoardState);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col justify-start items-center min-h-screen bg-gray-800 py-8">
        <div className="flex flex-wrap justify-center mb-4">
          {pieces.map((piece) =>
            !piece.isOnBoard ? (
              <div key={piece.id} className="mt-2 p-1">
                <Piece id={piece.id} color={piece.color} shape={piece.shape} setHighlightedSquares={setHighlightedSquares} />
                {/* Rotate Button */}
                <div className="flex justify-center items-center gap-2 ">
                  <button
                    className="bg-gray-700 hover:bg-gray-600 rounded-full w-8 h-8 flex justify-center items-center"
                    onClick={() => handleRotate(piece.id)}
                  >
                    <FiRotateCw size={24} className="text-gray-400 cursor-pointer" />
                  </button>

                  {/* Flip Button */}
                  <button
                    className="bg-gray-700 hover:bg-gray-600 rounded-full w-8 h-8 flex justify-center items-center"
                    onClick={() => handleFlip(piece.id)}
                  >
                    <LuFlipHorizontal size={24} className="text-gray-400 cursor-pointer" />
                  </button>
                </div>
              </div>
            ) : null
          )}
        </div>

        <div className="z-10">
          <Board
            onDropPiece={handleDropPiece}
            highlightedSquares={highlightedSquares}
            setHighlightedSquares={setHighlightedSquares}
            pieces={pieces}
            boardState={boardState}
            setBoardState={setBoardState}
            canPlacePiece={canPlacePiece}
          />
        </div>

        <button
          className="bg-gray-700 hover:bg-gray-600 w-32 h-6 flex justify-center items-center mt-5"
          onClick={() => console.log(boardState)}
        >
          Console Log
        </button>

        <button
          className="bg-gray-700 hover:bg-gray-600 w-64 h-12 flex justify-center items-center mt-5"
          onClick={async () => {
            enhancedPutPieces();
          }}
        >
          Hard Coded Solution
        </button>

        <button className="bg-gray-700 hover:bg-gray-600 w-64 h-12 flex justify-center items-center mt-5" onClick={() => {}}>
          Find a Solution
        </button>
      </div>
    </DndProvider>
  );
}

export default Test;
