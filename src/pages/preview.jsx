import React, { useState, useEffect, useRef } from 'react';
import GridComponent from '../components/previewBoard';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import Grid from 'react-virtualized/dist/commonjs/Grid';
import 'react-virtualized/styles.css';

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

const Preview = () => {
  const [worker, setWorker] = useState(null);
  const [solutions, setSolutions] = useState([]);

  useEffect(() => {
    const newWorker = new Worker('worker.js');
    setWorker(newWorker);

    newWorker.onmessage = (e) => {
      if (e.data.type === 'SOLUTION') {
        setSolutions((prevSolutions) => [...prevSolutions, e.data.data]);
      }
    };

    return () => newWorker.terminate();
  }, []);

  const handleStart = () => {
    worker.postMessage({ command: 'START' });
  };

  const handleStop = () => {
    worker.postMessage({ command: 'STOP' });
  };

  return (
    <div className="container mx-auto p-4 h-full w-full" style={{ minHeight: '100vh' }}>
      <div className="flex justify-between mb-4" style={{ minHeight: '5vh' }}>
        <button onClick={handleStart} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Start
        </button>
        <span className="text-white">{solutions.length} solutions found</span>
        <button onClick={handleStop} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Stop
        </button>
      </div>

      <div className="flex flex-wrap -m-1 h-full w-full" style={{ minHeight: '85vh' }}>
        <AutoSizer>
          {({ height, width }) => {
            return (
              <Grid
                cellRenderer={({ rowIndex, columnIndex, key, style }) => {
                  const itemsPerRow = Math.floor(width / 154);

                  const index = rowIndex * itemsPerRow + columnIndex;

                  if (index >= solutions.length) {
                    return null;
                  }

                  const paddedStyle = {
                    ...style,
                    padding: 10,
                  };

                  return (
                    <div key={key} style={paddedStyle}>
                      <GridComponent colors={colors} data={solutions[index]} />
                    </div>
                  );
                }}
                height={height}
                width={width}
                rowCount={Math.ceil(solutions.length / Math.floor(width / 154))}
                columnCount={Math.floor(width / 154)}
                rowHeight={90}
                columnWidth={154}
              />
            );
          }}
        </AutoSizer>
      </div>
    </div>
  );
};

export default Preview;
