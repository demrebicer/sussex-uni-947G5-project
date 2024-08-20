import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FiRotateCw } from 'react-icons/fi';
import { LuFlipHorizontal } from 'react-icons/lu';
import GridComponent from '../components/previewBoard';
import { Spinner, Button } from '@nextui-org/react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Tour from 'reactour';
import '../styles/reactour.css';
import Board from '../components/board';
import Piece from '../components/piece';

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

function PolyspherePuzzle() {
  const [boardState, setBoardState] = useState(Array(5 * 11).fill(null));
  const [pieces, setPieces] = useState(initialPieces);
  const [highlightedSquares, setHighlightedSquares] = useState([]);

  const [worker, setWorker] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [isWorkerStart, setIsWorkerStart] = useState(false);
  const [isWorkerTerminated, setIsWorkerTerminated] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(true);

  const [solutionsCount, setSolutionsCount] = useState(0);
  let isInit = true;

  const navigate = useNavigate();

  const goBack = () => {
    navigate('/tasks');
  };

  useEffect(() => {
    const newWorker = new Worker('worker.js');
    setWorker(newWorker);
  }, []);

  useEffect(() => {
    let solutionsNew = [];

    if (worker) {
      worker.onmessage = (e) => {
        if (e.data.type === 'SOLUTION') {
          solutionsNew.push(e.data.data);

          setSolutionsCount((prev) => prev + 1);

          if (isInit == true) {
            setSolutions(solutionsNew);
            isInit = false;
          }
        } else if (e.data.type === 'FINISHED') {
          console.log('Finished');
          handleStop();
        }
      };

      const interval = setInterval(() => {
        setSolutions(solutionsNew);
      }, 3000);

      return () => {
        worker.terminate();
        clearInterval(interval);
      };
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
    // console.log(`Parça ${id} tahtaya bırakıldı.`);
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
    setSolutionsCount(0);
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

        <div
          id="board"
          className="z-10"
          style={{
            padding: 30,
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
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
                className="w-52 h-12 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-2 rounded-lg shadow-lg transform transition-colors duration-300 ease-in-out focus:outline-none focus:shadow-outline"
                onClick={() => {
                  handleStart();
                }}
              >
                {isWorkerStart == false ? 'Start Solution Finder' : <Spinner size="large" color="white" />}
              </button>

              <button
                id="stop-solution-finder"
                className="w-52 h-12 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded-lg shadow-lg transform transition-colors duration-300 ease-in-out focus:outline-none focus:shadow-outline"
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

          <span className="text-white font-bold">{solutionsCount} solutions found</span>
        </div>

        <div className="text-xl text-white font-bold p-4 mt-8" style={{ display: solutions.length <= 0 ? 'none' : 'flex' }}>
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
