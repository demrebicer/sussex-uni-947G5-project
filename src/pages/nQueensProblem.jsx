
import { useState } from "react";
import mainMenuBackground from "../assets/images/mainMenuBackground.svg";
import { useNavigate } from "react-router-dom";
import ChessBoard from "../components/chessBoard";
import { FiArrowLeft } from "react-icons/fi";
import { Button } from "@nextui-org/react";

const NQueensProblem = () => {
    const [n, setN] = useState(4);
    const [queens, setQueens] = useState([]);
  
    const navigate = useNavigate();
  
    const goBack = () => {
      navigate(-1);
    };
  
    const solveNQueens = (n) => {
        const res = [];
        backtrack(res, n);
        setQueens(res.map(solution => solution.map((c, r) => ({ row: r, col: c }))));
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
    
      const calculateNQueens = (n) => {
        if (n < 4 || n > 9) {
          alert('Please enter a value of n between 4 and 9');
          return;
        }
        solveNQueens(Number(n));
      };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-75"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-black opacity-50"></div>
        <div className="absolute inset-0 z-10 pointer-events-none">
          <img src={mainMenuBackground} alt="Main Menu Background" />
        </div>
      </div>

      <div className="z-20 flex w-full h-full">
        <div className="flex-1 flex flex-col items-center justify-center bg-red-500 opacity-50 p-10">
          <input
            type="number"
            value={n}
            onChange={(e) => setN(e.target.value)}
            className="p-2 text-black text-lg border-2 rounded w-1/2 mb-4 bg-white border-gray-300"
            min="4"
            max="9"
            placeholder="Enter n value"
          />
          <button
            onClick={() => calculateNQueens(Number(n))}
            className="px-6 py-2 border-2 border-white rounded text-white hover:bg-white hover:text-black transition duration-300"
          >
            Calculate
          </button>
        </div>
        <div className="flex-1 bg-green-500 opacity-50">
          <ChessBoard queens={queens} n={n}/>
        </div>
      </div>

      <div className="absolute top-0 left-0 z-30 p-4">
        <Button
          auto
          isIconOnly
          color="default"
          onClick={goBack}
          variant="bordered"
          className="text-white flex items-center border-none"
        >
          <FiArrowLeft size={32} />
        </Button>
      </div>
    </div>
  );
};

export default NQueensProblem;