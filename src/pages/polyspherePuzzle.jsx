import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FiRotateCw } from 'react-icons/fi';
import { LuFlipHorizontal } from 'react-icons/lu';
import { toast } from 'react-hot-toast';
import GridComponent from '../components/previewBoard';
import { Spinner, Button } from '@nextui-org/react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Tour from 'reactour';
import '../styles/reactour.css';

import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import Grid from 'react-virtualized/dist/commonjs/Grid';
import 'react-virtualized/styles.css';

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

      //if newBoardState does not have null, show congrats toast
      if (!newBoardState.includes(null)) {
        toast.success('Congratulations! You solved the puzzle.');
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

function PolyspherePuzzle() {
  const [boardState, setBoardState] = useState(Array(5 * 11).fill(null));
  const [pieces, setPieces] = useState(initialPieces);
  const [highlightedSquares, setHighlightedSquares] = useState([]);

  const [worker, setWorker] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [isWorkerStart, setIsWorkerStart] = useState(false);
  const [isWorkerTerminated, setIsWorkerTerminated] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(true);

  const navigate = useNavigate();

  const goBack = () => {
    navigate('/tasks');
  };

  useEffect(() => {
    const newWorker = new Worker('worker.js');
    setWorker(newWorker);

    // newWorker.onmessage = (e) => {
    //   if (e.data.type === 'SOLUTION') {
    //     // console.log("Veri geldi")
    //     setSolutions((prevSolutions) => [...prevSolutions, e.data.data]);
    //   }
    // };

    // return () => newWorker.terminate();
  }, []);

  useEffect(() => {
    if (worker) {
      worker.onmessage = (e) => {
        if (e.data.type === 'SOLUTION') {
          // console.log("Veri geldi")
          setSolutions((prevSolutions) => [...prevSolutions, e.data.data]);
        }
      };

      return () => worker.terminate();
    }
  }, [worker]);

  function canPlacePiece(itemShape, targetRow, targetCol, itemId) {
    return itemShape.every((cell) => {
      const { row: cellRow, col: cellCol } = cell;
      const finalRow = targetRow + cellRow;
      const finalCol = targetCol + cellCol;

      if (finalRow < 0 || finalRow >= 5 || finalCol < 0 || finalCol >= 11) {
        return false;
      }

      const existingPieceId = boardState[finalRow * 11 + finalCol];
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

  const handleStart = () => {
    setPieces((prevPieces) => prevPieces.map((piece) => ({ ...piece, isOnBoard: true })));
    setIsWorkerStart(true);
    worker.postMessage({ command: 'START', data: { boardState } });
  };

  const handleStop = () => {
    worker.postMessage({ command: 'STOP' });

    setIsWorkerTerminated(true);

    worker.terminate();
  };

  function handleShowSolutionOnBoard(index) {
    setBoardState(solutions[index]);
  }

  function handleResetAndStartOver() {
    setBoardState(Array(5 * 11).fill(null));
    setPieces(initialPieces);
    setSolutions([]);
    setIsWorkerStart(false);
    setIsWorkerTerminated(false);
    setWorker(new Worker('worker.js'));
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className="flex flex-col justify-start items-center min-h-screen py-8 bg-black"
        style={{
          backgroundImage:
            'linear-gradient(to bottom, rgb(64,54,103,0.6) 45%, rgb(67,85,176,0.6) 45%), linear-gradient(to right, rgb(85,104,185, 0.6) 50%, rgb(43,31,86,0.6) 50%)',
          backgroundBlendMode: 'screen',
        }}
      >
        <div className="flex flex-wrap justify-center mb-4">
          {pieces.map((piece) =>
            !piece.isOnBoard ? (
              <div key={piece.id} className="mt-2 p-1">
                <Piece id={piece.id} color={piece.color} shape={piece.shape} setHighlightedSquares={setHighlightedSquares} />

                <div id="rotate-and-flip" className="flex justify-center items-center gap-3 ">
                  <button
                    className="border-2 border-white text-white hover:bg-white hover:text-gray-700 rounded-full w-8 h-8 flex justify-center items-center"
                    onClick={() => handleRotate(piece.id)}
                  >
                    <FiRotateCw size={20} className="cursor-pointer hover:text-gray-700" />
                  </button>

                  <button
                    className="border-2 border-white text-white hover:bg-white hover:text-gray-700 rounded-full w-8 h-8 flex justify-center items-center"
                    onClick={() => handleFlip(piece.id)}
                  >
                    <LuFlipHorizontal size={20} className="cursor-pointer hover:text-gray-700" />
                  </button>
                </div>
              </div>
            ) : null
          )}
        </div>

        <div id="board" className="z-10"
        style={{
          padding: 30,
          background: 'rgba(255, 255, 255, 0.2)', // White background with transparency
          borderRadius: '16px', // Rounded corners
          border: '1px solid rgba(255, 255, 255, 0.2)', // Light border for glass effect
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Soft shadow for depth
          backdropFilter: 'blur(10px)', // Blur effect for the glassmorphism
          WebkitBackdropFilter: 'blur(10px)' // For Safari compatibility
        }}
        >
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

        <div className="flex flex-col items-center justify-center mt-5 space-y-4">
          {isWorkerTerminated == false ? (
            <div className="flex justify-center items-center space-x-4">
              <button
                id="start-solution-finder"
                className="w-52 h-12 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transform transition-colors duration-300 ease-in-out focus:outline-none focus:shadow-outline"
                onClick={() => {
                  handleStart();
                }}
              >
                {isWorkerStart == false ? 'Start Solution Finder' : <Spinner size="large" color="white" />}
              </button>

              <button
                id="stop-solution-finder"
                className="w-52 h-12 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transform transition-colors duration-300 ease-in-out focus:outline-none focus:shadow-outline"
                onClick={() => {
                  handleStop();
                }}
              >
                Stop Solution Finder
              </button>
            </div>
          ) : null}

          {isWorkerTerminated == true ? (
            <button
              className="w-52 h-12 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transform transition-colors duration-300 ease-in-out focus:outline-none focus:shadow-outline"
              onClick={() => {
                handleResetAndStartOver();
              }}
            >
              Start Over
            </button>
          ) : null}

          <span className="text-white font-bold">{solutions.length} solutions found</span>
        </div>

        <div className="text-xl font-bold p-4 mt-8" style={{ display: solutions.length <= 0 ? 'none' : 'flex' }}>
          Solutions
        </div>

        <div
          className="flex flex-wrap h-full w-full  border-4 rounded-lg border-gray-400 border-opacity-50"
          style={{ minHeight: '83vh', width: '95%', display: solutions.length <= 0 ? 'none' : 'flex' }}
        >
          <AutoSizer>
            {({ height, width }) => {
              let colWidth = 198;
              let rowHeight = 100;
              return (
                <Grid
                  style={{ display: 'flex', justifyContent: 'center' }}
                  cellRenderer={({ rowIndex, columnIndex, key, style }) => {
                    const itemsPerRow = Math.floor(width / colWidth);

                    const index = rowIndex * itemsPerRow + columnIndex;

                    if (index >= solutions.length) {
                      return null;
                    }

                    const paddedStyle = {
                      ...style,
                      paddingRight: 20,
                    };

                    return (
                      <div key={key} style={paddedStyle} onClick={() => handleShowSolutionOnBoard(index)}>
                        <GridComponent colors={colors} data={solutions[index]} />
                      </div>
                    );
                  }}
                  height={height - 20}
                  width={width}
                  rowCount={Math.ceil(solutions.length / Math.floor(width / colWidth))}
                  columnCount={Math.floor(width / colWidth)}
                  rowHeight={rowHeight}
                  columnWidth={colWidth}
                />
              );
            }}
          </AutoSizer>
        </div>
        <div className="absolute top-0 left-0 p-4 z-10">
          <Button auto isIconOnly color="default" onClick={goBack} variant="bordered" className="text-white flex items-center border-none">
            <FiArrowLeft size={32} />
          </Button>
        </div>
      </div>
      <Tour
        steps={steps}
        isOpen={isTourOpen}
        onRequestClose={() => {
          setIsTourOpen(false);
        }}
        // accentColor="rgb(64,54,103,0.6)"
      />
    </DndProvider>
  );
}

const steps = [
  {
    selector: '.first-step',
    content: "Welcome to Polysphere Puzzle Solver! 🌐 Excited to solve puzzles? Let's get started! 🧩 ✨",
  },
  {
    selector: '#rotate-and-flip',
    content: "Rotate or flip pieces to fit them on the board. It's your turn to shine, puzzle master! 🔄 🧩",
  }, 
  {
    selector: '#board',
    content: 'Drag & drop pieces onto the board, or remove them by dropping outside. Simple and slick! 🖱️ 🧩 ➡️ ❌',
  },
  {
    selector: '#start-solution-finder',
    content: 'Tired of guessing? Launch the solution finder and let the magic happen! ✨ 🚀',
  },
  {
    selector: '#stop-solution-finder',
    content: "Need a break? You can stop the solution finder anytime—just hit 'stop'. 🛑✋",
  },
  {
    selector: '.sixth-step',
    content: "You're all set! Embark on your puzzle-solving adventure. 🎮 🌟",
  },
];


export default PolyspherePuzzle;
