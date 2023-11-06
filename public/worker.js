let running = true;

const piecesData = [
  {
    piece: 'A',
    coordinates: [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 1, col: 0 },
      { row: 1, col: 2 },
    ],
    id: 1,
  },
  {
    piece: 'B',
    coordinates: [
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 0, col: 2 },
      { row: 0, col: 3 },
    ],
    id: 2,
  },
  {
    piece: 'C',
    coordinates: [
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 2, col: 1 },
      { row: 2, col: 2 },
    ],
    id: 3,
  },
  {
    piece: 'D',
    coordinates: [
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
    ],
    id: 4,
  },
  {
    piece: 'E',
    coordinates: [
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 1, col: 3 },
    ],
    id: 5,
  },
  {
    piece: 'F',
    coordinates: [
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
    ],
    id: 6,
  },
  {
    piece: 'G',
    coordinates: [
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
    ],
    id: 7,
  },
  {
    piece: 'H',
    coordinates: [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 2, col: 0 },
    ],
    id: 8,
  },
  {
    piece: 'I',
    coordinates: [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 1, col: 2 },
      { row: 2, col: 2 },
    ],
    id: 9,
  },
  {
    piece: 'J',
    coordinates: [
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 1, col: 3 },
    ],
    id: 10,
  },
  {
    piece: 'K',
    coordinates: [
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
    ],
    id: 11,
  },
  {
    piece: 'L',
    coordinates: [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 2, col: 2 },
    ],
    id: 12,
  },
];

const W = 11,
  H = 5;


function parseTiles(letters, tiles) {
  return letters.map((letter, index) => {
    return tiles[index].flatMap((row, y) => {
      return row
        .map((cell, x) => {
          if (cell === letter) {
            return [x, y];
          }
          return null;
        })
        .filter(Boolean);
    });
  });
}

function normalize(tile) {
  const dx = Math.min(...tile.map(([x, _]) => x));
  const dy = Math.min(...tile.map(([_, y]) => y));
  return tile.map(([x, y]) => [x - dx, y - dy]).sort();
}

function flip(tile) {
  return tile.map(([x, y]) => [y, x]);
}

function rotate(tile, nRotations) {
  for (let i = 0; i < nRotations; i++) {
    tile = tile.map(([x, y]) => [y, -x]);
  }
  return tile;
}

function allRotationsAndFlips(tile, optimize) {
  const rotations = new Set();
  const addNormalized = (t) => rotations.add(JSON.stringify(normalize(t)));
  if (optimize) {
    addNormalized(rotate(tile, 0));
    addNormalized(rotate(tile, 2));
  } else {
    [tile, flip(tile)].forEach((t) => {
      for (let i = 0; i < 4; i++) {
        addNormalized(rotate(t, i));
      }
    });
  }
  return Array.from(rotations).map((r) => JSON.parse(r));
}

function offset(tile, dx, dy) {
  return tile.map(([x, y]) => [x + dx, y + dy]);
}

function* generateAllPositions(tile, optimize) {
  for (let t of allRotationsAndFlips(tile, optimize)) {
    const tileW = Math.max(...t.map(([x, _]) => x));
    const tileH = Math.max(...t.map(([_, y]) => y));
    for (let dx = 0; dx < W - tileW; dx++) {
      for (let dy = 0; dy < H - tileH; dy++) {
        yield offset(t, dx, dy);
      }
    }
  }
}

function* makeChoices(letter, letters, tile) {
  const letterCols = Array.from(letters, (c) => (letter === c ? 1 : 0));
  for (let t of generateAllPositions(tile, letter === 'A')) {
    const tileCols = Array.from({ length: W * H }, (_, index) => (t.some(([x, y]) => y * W + x === index) ? 1 : 0));
    yield letterCols.concat(tileCols); // Changed from spread to concat
  }
}

function makeAllChoices(letters, tiles) {
  const choices = [];
  letters.forEach((letter, index) => {
    for (let choice of makeChoices(letter, letters, tiles[index])) {
      choices.push([letter, choice]);
    }
  });
  return choices;
}

function createMatrix(data) {
  const tiles = data.map((pieceInfo) => pieceInfo.coordinates.map((coord) => [coord.col, coord.row]));
  const letters = data.map((pieceInfo) => pieceInfo.id);

  return makeAllChoices(letters, tiles);
}

function minNumOnes(matrix, rows, columns) {
  let minColumn = null;
  let minValue = Number.MAX_VALUE;
  columns.forEach((column) => {
    let numOnes = 0;
    for (let row of rows) {
      if (matrix[row][column]) {
        numOnes++;
        if (numOnes >= minValue) {
          break;
        }
      }
    }
    if (numOnes < minValue) {
      minColumn = column;
      minValue = numOnes;
    }
  });
  return [minColumn, minValue];
}

function compareArraysIgnoringNulls(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  function isAllNulls(array) {
    return array.every(element => element === null);
  }

  if (isAllNulls(arr1) || isAllNulls(arr2)) {
    return true;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] === null || arr2[i] === null) {
      continue;
    }
    if (typeof arr1[i] === 'number' && typeof arr2[i] === 'number' && arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}


function recurse(matrix, rows, columns, solutions, partialSolution, choices, fixedPieces) {
  if (columns.size === 0) {

    const partialSolutionFormatted = printSolution(choices, partialSolution);
    if (compareArraysIgnoringNulls(partialSolutionFormatted, fixedPieces.boardState)) {
      // solutions.push(partialSolution);
      // console.log('Solution Found');
      // console.log(partialSolutionFormatted);
      self.postMessage({ type: 'SOLUTION', data: partialSolutionFormatted });
    }

    return;
  }

  // if (solutions.length > 100) {
  //   return;
  // }

  if (!running) {
    return;
  }

  const [selectedCol, minVal] = minNumOnes(matrix, rows, columns);
  if (minVal === 0) {
    return;
  }

  const candidateRows = Array.from(rows).filter((row) => matrix[row][selectedCol]);
  for (let candidateRow of candidateRows) {
    const columnsToRemove = new Set();
    const rowsToRemove = new Set();

    columns.forEach((column) => {
      if (matrix[candidateRow][column]) {
        columnsToRemove.add(column);
      }
    });

    rows.forEach((row) => {
      columnsToRemove.forEach((col) => {
        if (matrix[row][col]) {
          rowsToRemove.add(row);
        }
      });
    });

    const newRows = new Set([...rows].filter((row) => !rowsToRemove.has(row)));
    const newColumns = new Set([...columns].filter((col) => !columnsToRemove.has(col)));

    recurse(matrix, newRows, newColumns, solutions, [...partialSolution, candidateRow], choices, fixedPieces);
  }
}


function printSolution(choices, solution) {
  const solutionArr = [];

  const solutionRows = solution.map((row) => choices[row]);
  const numLetters = choices[0][1].length - W * H;
  const flatMap = Array.from({ length: W * H }, (_, i) => i);

  solutionRows.forEach(([letter, row]) => {
    for (let i = 0; i < W * H; i++) {
      if (row[numLetters + i]) {
        flatMap[i] = letter;
      }
    }
  });

  for (let y = 0; y < H; y++) {
    let line = '';
    for (let x = 0; x < W; x++) {
      line += flatMap[y * W + x];
      solutionArr.push(flatMap[y * W + x]);
    }
  }
  return solutionArr;
}

function solveDlx(fixedPieces) {
  const choices = createMatrix(piecesData);
  const matrix = choices.map((choice) => choice[1]);

  const rows = new Set(Array.from({ length: matrix.length }, (_, i) => i));
  const columns = new Set(Array.from({ length: matrix[0].length }, (_, i) => i));

  const solutions = [];
  recurse(matrix, rows, columns, solutions, [], choices, fixedPieces);

  solutions.forEach((solution) => {
    printSolution(choices, solution);
  });

}


self.onmessage = function (e) {
  if (e.data.command === 'START') {
    console.log('Worker started');

    solveDlx(e.data.data);
  } else if (e.data.command === 'STOP') {
    console.log('Worker stopped');
    running = false;
    self.close();
  }
};
