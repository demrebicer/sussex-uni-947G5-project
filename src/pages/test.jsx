import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sphere, OrbitControls, Sky } from '@react-three/drei';
import { FaCompress, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Spinner, Button } from '@nextui-org/react';

const pyramidData = [
  [[6]],
  [
    [0, 7],
    [3, 6],
  ],
  [
    [0, 8, 7],
    [8, 8, 8],
    [3, 8, 6],
  ],
  [
    [0, 1, 1, 7],
    [1, 1, 7, 4],
    [1, 3, 6, 4],
    [3, 4, 4, 4],
  ],

  [
    [0, 5, 5, 5, 5],
    [9, 9, 9, 7, 5],
    [11, 11, 9, 2, 2],
    [11, 10, 10, 6, 2],
    [3, 10, 10, 2, 2],
  ],
];

const colors = {
  0: '#2563eb',
  1: '#db2777',
  2: '#fde047',
  3: '#fbbf24',
  4: '#f472b6',
  5: '#22d3ee',
  6: '#7e22ce',
  7: '#16a34a',
  8: '#4ade80',
  9: '#ea580c',
  10: '#c084fc',
  11: '#ef4444',
};

function Pyramid({ spacingY, pyramidData }) {
  const spheres = [];
  const totalHeight = pyramidData.length;
  const sphereRadius = 0.6; // Kürelerin yarıçapını biraz artırdım
  let spacing = 1.2; // Küreler arası boşluğu azalttım
  // let spacingY = 1; // Küreler arası boşluğu azalttım

  console.log('spacingY', spacingY);

  pyramidData.forEach((layer, layerIndex) => {
    const layerSize = layer.length;
    layer.forEach((row, rowIndex) => {
      row.forEach((letter, letterIndex) => {
        // const x = (letterIndex - row.length / 2) * spacing;
        // // Yüksekliği katman sayısına göre ayarla
        // const y = (totalHeight - layerIndex - 1) * spacing * 0.5;
        // const z = (rowIndex - row.length / 2) * spacing;

        const x = (letterIndex - row.length / 2) * spacing * 0.95;
        // Yüksekliği katman sayısına göre ayarla
        const y = (totalHeight - layerIndex - 1) * spacingY;
        const z = (rowIndex - row.length / 2) * spacing * 0.95;
        const color = colors[letter];

        spheres.push(
          <Sphere position={[x, y, z]} args={[sphereRadius, 16, 16]} key={`${layerIndex}-${rowIndex}-${letterIndex}`}>
            <meshStandardMaterial color={color} />
          </Sphere>
        );
      });
    });
  });

  return <>{spheres}</>;
}

//This is for only waiting for solution. Just create 5x5 pyramid you don't have to use real data
function PyramidSkeleton() {
  const spheres = [];
  const totalHeight = 5;
  const sphereRadius = 0.6; // Kürelerin yarıçapını biraz artırdım
  let spacing = 1.2; // Küreler arası boşluğu azalttım
  let spacingY = 1; // Küreler arası boşluğu azalttım

  pyramidData.forEach((layer, layerIndex) => {
    const layerSize = layer.length;
    layer.forEach((row, rowIndex) => {
      row.forEach((letter, letterIndex) => {
        // const x = (letterIndex - row.length / 2) * spacing;
        // // Yüksekliği katman sayısına göre ayarla
        // const y = (totalHeight - layerIndex - 1) * spacing * 0.5;
        // const z = (rowIndex - row.length / 2) * spacing;

        const x = (letterIndex - row.length / 2) * spacing * 0.95;
        // Yüksekliği katman sayısına göre ayarla
        const y = (totalHeight - layerIndex - 1) * spacingY;
        const z = (rowIndex - row.length / 2) * spacing * 0.95;
        const color = colors[letter];

        spheres.push(
          <Sphere
            //wireframe

            position={[x, y, z]}
            args={[sphereRadius, 16, 16]}
            key={`${layerIndex}-${rowIndex}-${letterIndex}`}
          >
            <meshStandardMaterial />
          </Sphere>
        );
      });
    });
  });

  return <>{spheres}</>;
}

export default function App() {
  const [isSpacingY, setIsSpacingY] = useState(false);
  const [spacingY, setSpacingY] = useState(1);

  const [worker, setWorker] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [isWorkerStart, setIsWorkerStart] = useState(false);
  const [isWorkerTerminated, setIsWorkerTerminated] = useState(false);
  const [solutionsCount, setSolutionsCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  let isInit = true;

  useEffect(() => {
    const newWorker = new Worker('solver3d.js');
    setWorker(newWorker);
  }, []);

  useEffect(() => {
    let solutionsNew = [];

    if (worker) {
      worker.onmessage = (e) => {
        if (e.data.type === 'SOLUTION') {
          console.log('Solution', e.data.data);
          const reversedSolution = e.data.data.reverse();
          solutionsNew.push(reversedSolution);

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

  useEffect(() => {
    console.log('spacingY', spacingY);
    if (isSpacingY === true) {
      setSpacingY(2);
    } else {
      setSpacingY(1);
    }
  }, [isSpacingY]);

  const handleStart = () => {
    // setPieces((prevPieces) => prevPieces.map((piece) => ({ ...piece, isOnBoard: true })));
    setIsWorkerStart(true);
    // worker.postMessage({ command: 'START', data: { solutions } });
    worker.postMessage({ command: 'START' });
  };

  const handleStop = () => {
    worker.postMessage({ command: 'STOP' });

    setIsWorkerTerminated(true);

    worker.terminate();
  };

  // function handleResetAndStartOver() {
  //   setBoardState(Array(5 * 11).fill(null));
  //   setPieces(initialPieces);
  //   setSolutions([]);
  //   setSolutionsCount(0);
  //   setIsWorkerStart(false);
  //   setIsWorkerTerminated(false);
  //   setWorker(new Worker('worker.js'));
  // }

  const handleResetAndStartOver = () => {
    setSolutions([]);
    setSolutionsCount(0);
    setIsWorkerStart(false);
    setIsWorkerTerminated(false);
    setWorker(new Worker('solver3d.js'));
  };

  const handleNext = () => {
    if (currentPage < solutionsCount) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <button
        className="absolute top-8 left-8 z-10 p-2 bg-white rounded shadow hover:bg-gray-100 focus:outline-none"
        onClick={() => {
          console.log('Tıklandı');
          setIsSpacingY((prev) => !prev);
        }}
      >
        <FaCompress className="text-2xl" /> {/* İkon boyutu */}
      </button>

      <div className="absolute bottom-10 z-10 p-3 bg-white rounded-2xl shadow hover:bg-gray-100 focus:outline-none">
        {isWorkerTerminated == false ? (
          <div className="flex justify-center items-center space-x-8">
            <button
              id="start-solution-finder"
              className="w-64 h-12 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transform transition-colors duration-300 ease-in-out focus:outline-none focus:shadow-outline"
              onClick={() => {
                handleStart();
              }}
            >
              {isWorkerStart == false ? 'Start Solution Finder' : <Spinner size="large" color="white" />}
            </button>

            <button
              id="stop-solution-finder"
              className="w-64 h-12 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transform transition-colors duration-300 ease-in-out focus:outline-none focus:shadow-outline"
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

        {solutionsCount > 0 ? (
          <span className="d-flex justify-center mt-2 xt-black font-bold">
            {currentPage} / {solutionsCount} Solutions
          </span>
        ) : null}

        {solutionsCount > 0 ? (
          <div className="flex justify-center items-center space-x-8 mt-4">
            <button
              id="prev-solution"
              className="w-32 h-12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transform transition-colors duration-300 ease-in-out focus:outline-none focus:shadow-outline"
              onClick={() => {
                handlePrev();
              }}
            >
              <FaArrowLeft className="text-2xl" />
            </button>

            <button
              id="next-solution"
              className="w-32 h-12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transform transition-colors duration-300 ease-in-out focus:outline-none focus:shadow-outline"
              onClick={() => {
                handleNext();
              }}
            >
              <FaArrowRight className="text-2xl" />
            </button>
          </div>
        ) : null}
      </div>

      <Canvas style={{ height: '100%', width: '100%' }} camera={{ position: [6, 3, 5], fov: 75 }}>
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} />

        {solutionsCount > 0 ? <Pyramid spacingY={spacingY} pyramidData={solutions[currentPage - 1]} /> : <PyramidSkeleton />}
        {solutionsCount > 0 ? <OrbitControls /> : null}
        <Sky />
      </Canvas>
    </div>
  );
}
