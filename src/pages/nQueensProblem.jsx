import { useEffect, useState } from 'react';
import mainMenuBackground from '../assets/images/mainMenuBackground.svg';
import { useNavigate } from 'react-router-dom';
import ChessBoard from '../components/chessBoard';
import { FiArrowLeft } from 'react-icons/fi';
import { Tooltip, Button } from '@nextui-org/react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { toast } from 'react-hot-toast';

import { BsArrow90DegDown } from 'react-icons/bs';

const NQueensProblem = () => {
  const [n, setN] = useState(4);
  const [queens, setQueens] = useState([]);
  const [currentSolutionIndex, setCurrentSolutionIndex] = useState(0);
  const [showTip, setShowTip] = useState(true);

  useEffect(() => {
    setCurrentSolutionIndex(0);
    setQueens([]);
  }, [n]);

  const goToPreviousSolution = () => {
    setCurrentSolutionIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNextSolution = () => {
    setCurrentSolutionIndex((prev) => Math.min(queens.length - 1, prev + 1));
  };

  const navigate = useNavigate();

  const goBack = () => {
    navigate('/tasks');
  };

  const backtrack = (res, n, board = [], r = 0) => {
    if (r === n) {
      res.push(board.slice());
      return;
    }
    for (let c = 0; c < n; c++) {
      if (!board.some((bc, br) => bc === c || bc === c + r - br || bc === c - r + br)) {
        board.push(c);
        backtrack(res, n, board, r + 1);
        board.pop();
      }
    }
  };

  const filterSolutionsByUserQueens = (solutions, userQueens) => {
    return solutions.filter((solution) => userQueens.every((uq) => solution.some((sq) => sq.row === uq.row && sq.col === uq.col)));
  };

  const solveNQueens = (n) => {
    const res = [];
    backtrack(res, n);
    const solutions = res.map((solution) => solution.map((c, r) => ({ row: r, col: c })));

    setQueens(solutions);
    const filteredSolutions = filterSolutionsByUserQueens(solutions, userQueens);

    if (filteredSolutions.length === 0) {
      toast.error('No solutions found with the selected queens!');
      setQueens([]);
      setUserQueens([]);
    } else {
      setQueens(filteredSolutions);
    }
  };

  const [userQueens, setUserQueens] = useState([]);

  const isQueen = (row, col) => {
    if (!calculated) {
      return userQueens.some((pos) => pos.row === row && pos.col === col);
    } else {
      const currentSolution = queens[currentSolutionIndex];
      return currentSolution && currentSolution.some((pos) => pos.row === row && pos.col === col);
    }
  };

  const [calculated, setCalculated] = useState(false);

  const addOrRemoveQueen = (row, col) => {
    if (isQueen(row, col)) {
      setUserQueens(userQueens.filter((q) => !(q.row === row && q.col === col)));
    } else {
      setUserQueens([...userQueens, { row, col }]);
    }
    setCalculated(false);
    setQueens([]);
    setShowTip(false);
  };

  const calculateNQueens = (n) => {
    solveNQueens(Number(n));
    setCalculated(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black relative overflow-hidden z-0">
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-75"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-black opacity-50"></div>
        <div className="absolute inset-0 pointer-events-none -z-20">
          <img src={mainMenuBackground} alt="Main Menu Background" />
        </div>
      </div>

      <div className=" flex w-full h-full z-10">
        <div className="flex-1 flex flex-col items-center justify-center p-10">
          <div className="flex items-center w-1/2 mb-4">
            <input
              type="number"
              value={n}
              onChange={(e) => setN(e.target.value)}
              className="p-2 text-black text-lg border-2 rounded w-full bg-white border-gray-300"
              min="4"
              max="12"
              placeholder="Enter n value"
            />
            <div className="ml-2">
              <Tooltip
                content="
                The minimum solution is 4x4. No solutions below 4. Maximum can be 12. Higher numbers create millions of solutions, so we set a limit. But in theory, no limit exists."
                placement="top"
                showArrow={true}
                classNames={{
                  base: 'py-2 px-4 text-black from-white to-neutral-400 z-30 w-64',
                  arrow: 'bg-neutral-400 bg-white',
                }}
                style={{
                  zIndex: 30,
                }}
              >
                <Button auto isIconOnly color="default" variant="bordered" className="text-white flex items-center border-none">
                  <AiOutlineQuestionCircle size={32} className="text-lg cursor-pointer" />
                </Button>
              </Tooltip>
            </div>
          </div>
          <button
            onClick={() => calculateNQueens(Number(n))}
            className="px-6 py-2 border-2 border-white rounded text-white hover:bg-white hover:text-black transition duration-300"
            style={{ fontFamily: 'Roboto' }}
          >
            Calculate
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center">
          {showTip && (
            <div className=" ml-5 mt-5">
              <div className="flex items-center p-2 rounded-full">
                <BsArrow90DegDown size={24} className="mr-2 text-white" />
                {/* //Make sure Roboto font */}
                <p className="text-md mb-4" style={{ fontFamily: 'Roboto', color: 'white' }}>
                  You can manually place a queen by clicking on the squares!
                </p>
              </div>
            </div>
          )}
          <ChessBoard
            queens={calculated ? queens[currentSolutionIndex] : userQueens}
            n={n}
            addOrRemoveQueen={addOrRemoveQueen}
            isQueen={isQueen}
          />

          <div className="mt-4">
            {' '}
            <div className="flex items-center">
              <button
                onClick={goToPreviousSolution}
                disabled={queens.length === 0 || currentSolutionIndex === 0}
                className="mr-2 icon-button"
                style={{
                  opacity: queens.length === 0 || currentSolutionIndex === 0 ? 0.5 : 1,
                }}
              >
                <FaArrowLeft size={20} className="text-white" />
              </button>

              {queens.length !== 0 && (
                <div className="flex items-center justify-center mx-2 text-white text-lg">
                  <span>
                    {currentSolutionIndex + 1}/{queens.length}
                  </span>
                </div>
              )}

              <button
                onClick={goToNextSolution}
                disabled={queens.length === 0 || currentSolutionIndex === queens.length - 1}
                className="icon-button"
                style={{
                  opacity: queens.length === 0 || currentSolutionIndex === queens.length - 1 ? 0.5 : 1,
                }}
              >
                <FaArrowRight size={20} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-0 p-4 z-10">
        <Button auto isIconOnly color="default" onClick={goBack} variant="bordered" className="text-white flex items-center border-none">
          <FiArrowLeft size={32} />
        </Button>
      </div>
    </div>
  );
};

export default NQueensProblem;
