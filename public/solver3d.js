let running = true;

const STONES = {
  green: [
    [0, 0],
    [1, 0],
    [1, 1],
    [2, 0],
  ],
  pink: [
    [0, 0],
    [1, 0],
    [1, -1],
    [2, -1],
    [3, -1],
  ],
  yellow: [
    [0, 0],
    [1, 0],
    [2, 0],
    [2, 1],
    [3, 0],
  ],
  violet: [
    [0, 0],
    [1, 0],
    [1, -1],
    [2, -1],
    [2, -2],
  ],
  lightred: [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 3],
  ],
  red: [
    [0, 0],
    [0, 1],
    [1, 1],
    [1, 2],
  ],
  orange: [
    [0, 0],
    [1, 0],
    [1, 1],
    [2, 1],
    [1, 2],
  ],
  blue: [
    [0, 0],
    [0, 1],
    [1, 1],
    [2, 1],
  ],
  lightblue: [
    [0, 0],
    [1, 0],
    [2, 0],
    [2, 1],
    [2, 2],
  ],
  cyan: [
    [0, 0],
    [1, 0],
    [1, -1],
  ],
  lightgreen: [
    [0, 0],
    [0, 1],
    [1, 1],
    [2, 1],
    [2, 0],
  ],
  lime: [
    [0, 0],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ],
};

const STONE_SIZES = Object.fromEntries(Object.keys(STONES).map((color) => [color, STONES[color].length]));

const STONE_MARKER = {
  green: ['🟢', 'g'],
  pink: ['🟣', 'p'],
  yellow: ['🟡', 'y'],
  violet: ['🟪', 'v'],
  lightred: ['🔴', 'r'],
  red: ['🔺', 'R'],
  orange: ['🟠', 'o'],
  blue: ['🔵', 'B'],
  lightblue: ['🟦', 'b'],
  cyan: ['🟦', 'c'],
  lightgreen: ['🟩', 'g'],
  lime: ['🟢', 'l'],
  empty: ['⬜', ' '],
};
// const fs = require("fs");
// const path = require("path");

class IqSolverBase {
  // Constructor
  constructor(file_name_text = 'solution.txt', file_name_color = 'solution-color.txt', print_all_boards = true) {
    this.file_name_text = file_name_text;
    this.file_name_color = file_name_color;
    this.print_all_boards = print_all_boards;

    this.BASE_WIDTH = 5; // Set this to the desired width
    this.EMPTY = 'empty'; // Define the empty cell marker
    this.stone_rotations = {}; // dict[StoneColor, StoneShape3d[]] tipi yorum olarak eklenmiştir.
    this.stone_directions = {}; // dict[StoneColor, Direction[]] tipi yorum olarak eklenmiştir.

    this.board = this._init_board(); // Board tipi yorum olarak eklenmiştir.
    this.all_directions = this._init_all_directions(); // Direction[] tipi yorum olarak eklenmiştir.
    this.found_boards = new Set(); // set[str] tipi yorum olarak eklenmiştir.
    this.last_board = null; // str | None tipi yorum olarak eklenmiştir.

    this._init_stone_directions();
  }

  test() {
    // console.log("test");
    // console.log(this.all_directions);
  }

  // Metotlar
  _init_board() {
    // throw new Error('NotImplementedError');
    console.log('NotImplementedError');
  }

  _init_all_directions() {
    // throw new Error('NotImplementedError');
    console.log('NotImplementedError');
  }

  _clone_board(board) {
    return board.map((level) => level.map((line) => [...line]));
  }

  _init_stone_directions() {
    // 'STONES' ve 'rotate_stone' metodu JavaScript'e uygun şekilde tanımlanmalıdır.

    for (const [color, stone] of Object.entries(STONES)) {
      const normalized_shapes = new Set();
      const shapes = [];
      const directions = [];

      for (const direction of this.all_directions) {
        const shape = this.rotate_stone(stone, direction);
        const mins = shape[0].map((_, i) => Math.min(...shape.map((p) => p[i])));
        const normalized_shape = shape
          .map((p) => p.map((c, i) => c - mins[i]).join(':'))
          .sort()
          .join(',');

        if (!normalized_shapes.has(normalized_shape)) {
          shapes.push(shape);
          directions.push(direction);
          normalized_shapes.add(normalized_shape);
        }
      }

      this.stone_rotations[color] = shapes;
      this.stone_directions[color] = directions;
    }
  }

  _board_to_str(board, marker_index = 0) {
    const lines = board[0].map(() => []);

    const _map = (color) => STONE_MARKER[color][marker_index]; // 'STONE_MARKER' sözlüğü tanımlanmalıdır.

    board.forEach((level) => {
      level.forEach((line, y) => {
        lines[y].push(line.map(_map).join(' '));
      });
    });

    return lines.map((line) => line.join('  ')).join('\n');
  }

  save_board(board) {
    function convertMatrix(matrix) {
      return matrix.map((row) => row.map((color) => STONE_MARKER[color][1]));
    }

    const board_str = this._board_to_str(board);
    this.found_boards.add(board_str);

    if (this.file_name_color !== null) {
      // fs.appendFileSync(this.file_name_color, `${board_str}\n\n`, "utf-8");
    }
    if (this.file_name_text !== null) {
      const convertedMatrices = board.map(convertMatrix);
      console.log(convertedMatrices);

      self.postMessage({ type: 'SOLUTION', data: convertedMatrices });

      // fs.appendFileSync(
      //   this.file_name_text,
      //   JSON.stringify(convertedMatrices, null, 2) + ",\n\n",
      //   "utf-8"
      // );
    }
  }

  // load_board() {
  //   if (this.file_name_text !== null && fs.existsSync(this.file_name_text)) {
  //     const fileContent = fs.readFileSync(this.file_name_text, "utf-8");
  //     const last_boards = fileContent.split("\n\n").filter((board) => board);

  //     if (last_boards.length > 0) {
  //       this.last_board = last_boards[last_boards.length - 1];
  //     }
  //   }
  // }

  print_board(board = null, no_dups = false) {
    if (board === null) {
      board = this.board;
    }
    const board_str = this._board_to_str(board);

    if (no_dups && this.found_boards.has(board_str)) {
      return;
    }

    console.log(board_str);
    console.log();
  }

  transform(p, direction) {
    // const [level, orientation, rotation] = direction;
    const level = direction.level;
    const orientation = direction.orientation;
    const rotation = direction.rotation;

    let dx, dy;

    if (level === 1) {
      dx = [orientation === 0 || orientation === 1 ? 0 : -1, orientation === 0 || orientation === 3 ? 0 : -1, level];

      dy = [rotation * (-dx[0] - 1), rotation * (-dx[1] - 1), rotation];
    } else if (level === 0) {
      dx = [orientation === 0 ? 1 : orientation === 2 ? -1 : 0, orientation === 1 ? 1 : orientation === 3 ? -1 : 0, 0];

      dy = [-dx[1] * rotation, dx[0] * rotation, 0];
    } else {
      // level === -1
      dx = [orientation === 0 || orientation === 1 ? 1 : 0, orientation === 0 || orientation === 3 ? 1 : 0, level];

      dy = [rotation * (dx[0] - 1), rotation * (dx[1] - 1), rotation];
    }

    return [p[0] * dx[0] + p[1] * dy[0], p[0] * dx[1] + p[1] * dy[1], p[0] * dx[2] + p[1] * dy[2]];
  }

  apply_stone(stone, fn) {
    return stone.map((p) => fn(p));
  }

  rotate_stone(stone, direction) {
    return stone.map((p) => this.transform(p, direction));
  }

  check_coordinates(board, x, y, z) {
    return x >= 0 && y >= 0 && z >= 0 && z < board.length && y < board[z].length && x < board[z][y].length;
  }

  _place_stone(board, stone_color, shape, start) {
    const offsetShape = shape.map((p) => [p[0] + start[0], p[1] + start[1], p[2] + start[2]]);
    let clonedBoard = this._clone_board(board);

    for (let [x, y, z] of offsetShape) {
      if (!this.check_coordinates(clonedBoard, x, y, z) || clonedBoard[z][y][x] !== this.EMPTY) {
        return null;
      }
      clonedBoard[z][y][x] = stone_color;
    }

    return clonedBoard;
  }

  test_board(board, remaining_colors) {
    const checked = new Set();
    const max_size = Math.max(...remaining_colors.map((color) => STONE_SIZES[color]));
    const min_size = Math.min(...remaining_colors.map((color) => STONE_SIZES[color]));

    const test_xy = (x, y, z) => {
      const key = `${x},${y},${z}`;
      if (checked.has(key)) return 0;
      if (!this.check_coordinates(board, x, y, z)) return 0;
      if (board[z][y][x] !== this.EMPTY) return 0;

      checked.add(key);

      let result = 1;
      const deltas = [
        [0, 0, 1],
        [-1, 0, 1],
        [-1, -1, 1],
        [0, -1, 1],
        [-1, 0, 0],
        [1, 0, 0],
        [0, -1, 0],
        [0, 1, 0],
        [0, 0, -1],
        [1, 0, -1],
        [1, 1, -1],
        [0, 1, -1],
      ];

      for (let [dx, dy, dz] of deltas) {
        result += test_xy(x + dx, y + dy, z + dz);
      }
      return result;
    };

    const sizes = new Set();

    board.forEach((level, z) => {
      level.forEach((line, y) => {
        for (let x = 0; x < line.length; x++) {
          const key = `${x},${y},${z}`;
          if (checked.has(key)) continue;
          const t = test_xy(x, y, z);
          if (t > 0) {
            if (t < min_size) return false;
            sizes.add(t);
          }
        }
      });
    });

    return max_size <= Math.max(...sizes);
  }

  _clear_last_board(board, color) {
    if (board === null) {
      return null;
    }
    const marker = STONE_MARKER[color][1];
    const empty = STONE_MARKER[this.EMPTY][1];
    const regex = new RegExp(`[^${empty}${marker}\\n ]`, 'g');
    return board.replace(regex, empty);
  }

  place_next_stone(board, colors) {
    const color = colors[0];
    colors = colors.slice(1);
    const last_stone = colors.length === 0;
    let last_clean_board = this._clear_last_board(this.last_board, color);

    board.forEach((level, z) => {
      level.forEach((line, y) => {
        for (let x = 0; x < line.length; x++) {
          for (const shape of this.stone_rotations[color]) {
            const next_board = this._place_stone(board, color, shape, [x, y, z]);

            if (next_board === null) continue;

            if (last_clean_board !== null) {
              const next_board_str = this._clear_last_board(this._board_to_str(next_board, 1), color);

              if (next_board_str === last_clean_board) {
                last_clean_board = null;
                if (last_stone) {
                  this.last_board = null;
                  this.print_board(next_board);
                  // exit();
                } else {
                  this.place_next_stone(next_board, colors);
                }
              }
              continue;
            }

            if (this.print_all_boards) {
              // this.print_board(next_board);
              // exit();
            }

            // if (!running){
            //   return;
            // }

            if (last_stone) {
              this.save_board(next_board);
              // print_board(true, true);
              // exit();
            } else if (this.test_board(next_board, colors)) {
              this.place_next_stone(next_board, colors);
            }
          }
        }
      });
    });
  }

  place_stone(color, direction, start) {
    const shape = this.rotate_stone(STONES[color], direction);
    // console.log(this.apply_stone(shape, p => [p[0] + start[0], p[1] + start[1], p[2] + start[2]]));
    const next_board = this._place_stone(this.board, color, shape, start);

    if (next_board !== null) {
      this.board = next_board;
    }

    return next_board;
  }

  solve() {
    const used_colors = new Set();
    this.board.forEach((level) => {
      level.forEach((line) => {
        line.forEach((color) => {
          used_colors.add(color);
        });
      });
    });

    const remaining_colors = Object.keys(STONES).filter((c) => !used_colors.has(c));

    this.place_next_stone(this.board, remaining_colors);
  }

  print_solutions() {
    this.found_boards.forEach((b) => {
      console.log(b);
      console.log();
    });
  }

  save_solutions(file_name) {
    const data = Array.from(this.found_boards)
      .map((b) => `${b}\n`)
      .join('\n');
    // fs.writeFileSync(file_name, data, "utf-8");
  }

  print_test_stone_directions(color, start) {
    this.stone_directions[color].forEach((direction) => {
      const next_board = this.place_stone(color, direction, start);
      if (next_board !== null) {
        console.log(direction);
        this.print_board(next_board);
      }
    });
  }
}

class IqSolver3d extends IqSolverBase {
  constructor() {
    super();
  }

  _init_board() {
    const board = [];
    for (let h = 0; h < this.BASE_WIDTH; h++) {
      const row = [];
      for (let i = 0; i < this.BASE_WIDTH - h; i++) {
        const column = new Array(this.BASE_WIDTH - h).fill(this.EMPTY);
        row.push(column);
      }
      board.push(row);
    }
    this.board = board; // Assign the generated board to this.board
    return board;
  }

  _init_all_directions() {
    const directions = [];
    for (let level of [-1, 0, 1]) {
      for (let orientation of [0, 1, 2, 3]) {
        for (let rotation of [1, -1]) {
          directions.push({ level, orientation, rotation });
        }
      }
    }

    return directions;
  }
}

function main() {
  // console.log("Solver Started");
  // Usage
  const solver = new IqSolver3d();

  // solver.place_stone("green", (0, 1, -1), (0, 0, 0))
  // solver.place_stone("pink", (0, 1, 1), (3, 0, 0))
  // solver.place_stone("red", (0, 1, -1), (0, 3, 0))
  // solver.place_stone("lightred", (-1, 1, 1), (0, 4, 0))
  // solver.place_stone("lightgreen", (0, 0, 1), (1, 2, 1))

  // solver.load_board();
  solver.solve();
  solver.print_solutions();

  // solver.test();

  self.postMessage({ type: 'FINISHED' });
}

self.onmessage = function (e) {
  if (e.data.command === 'START') {
    console.log('Worker started');

    main();
  } else if (e.data.command === 'STOP') {
    console.log('Worker stopped');
    running = false;
    self.close();
  }
};
