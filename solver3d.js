let running = true;

const pieces_s = `
..
 ..
  .

 .
..
 ..  

 ..
...

 .
...

...
. .

  ..
...

 .
....

...
  .
  .

.
....

 ..
..

..
.
.

.
..
`

function makePiece(p) {
  // make piece (w, d, h, [(z, x, y)]) -- with extra spaces for lattice
  const rows = p.split('\n');
  const d = (rows.length - 1) * 2 + 1;
  let mx = 0;
  let sparse = [];
  rows.forEach((r, y) => {
    for (let x = 0; x < r.length; x++) {
      if (r[x] === '.') {
        if (x > mx) {
          mx = x;
        }
        sparse.push([0, x * 2, y * 2]);
      }
    }
  });
  // sparse.sort();
  sparse = sorted(sparse);

  return [(mx * 2) + 1, d, 1, sparse];
}

const pieces = pieces_s.slice(1, -1).split('\n\n').map(makePiece);

function rotateRight(p) {
  const [w, d, h, s] = p;
  let wo = w;
  if (wo & 1) {
    wo -= 1;
  }
  let rs = s.map(([z, x, y]) => [z, y, wo - x]);
  // rs.sort();
  rs = sorted(rs);
  return [d, w, h, rs];
}


function rotateXY_Z(b) {
  // assuming z == 0
  const [z, x, y] = b;
  const x2 = Math.floor(x / 2);
  const y2 = Math.floor(y / 2);
  const xy = x2 + y2;
  const z_ = x2 - y2;
  return [z_, xy, xy];
}


function rotateUp(p) {
  // rotate 90 degrees around x = y, z = 0
  const [w, d, h, s] = p;
  let rs = s.map(b => rotateXY_Z(b)); // _rotate_xy_z fonksiyonunun JavaScript versiyonunu rotateXY_Z olarak varsayıyorum
  // rs.sort();
  rs = sorted(rs);

  const minZ = rs[0][0];
  const minXY = Math.min(...rs.map(([z, x, y]) => x));
  let xyo = -(minZ & 1);
  if (minXY + xyo < 0) {
    xyo += 2;
  }

  const rsa = rs.map(([z, x, y]) => [z - minZ, x + xyo, y + xyo]);
  const maxZ = rs[rs.length - 1][0];
  const wd = Math.max(...rsa.map(([z, x, y]) => x)) + 1;

  return [wd, wd, maxZ - minZ + 1, rsa];
}

function* allRotations(p) {
  let c = p;
  for (let r = 0; r < 4; r++) {
    yield c;
    const ru = rotateUp(c);
    yield ru;
    yield rotateRight(ru);
    c = rotateRight(c);
  }
}

function sorted(items, kwargs={}) {
  const key = kwargs.key === undefined ? x => x : kwargs.key;
  const reverse = kwargs.reverse === undefined ? false : kwargs.reverse;
  let sortKeys = items.map((item, pos) => [key(item), pos]);
  const comparator =
      Array.isArray(sortKeys[0][0])
      ? ((left, right) => {
          for (var n = 0; n < Math.min(left.length, right.length); n++) {
              const vLeft = left[n], vRight = right[n];
              const order = vLeft == vRight ? 0 : (vLeft > vRight ? 1 : -1);
              if (order != 0) return order;
          }
          return left.length - right.length;
      })
      : ((left, right) => {
          const vLeft = left[0], vRight = right[0];
          const order = vLeft == vRight ? 0 : (vLeft > vRight ? 1 : -1);
          return order;
      });
  // sortKeys.sort(comparator);
  sortKeys = sortKeys.sort(comparator);
  if (reverse) sortKeys.reverse();
  return sortKeys.map((order) => items[order[1]]);
}

function rotations(p) {
  let a = Array.from(allRotations(p)); // _all_rotations generator fonksiyonunun JavaScript versiyonu
  
  a=sorted(a)

  const ret = [a[0]];
  let c = a[0];
  for (const r of a.slice(1)) {
      if (!array_compare(c, r)) {
          ret.push(r);
          c = r;
      }
  }
  return ret;
}
function array_compare(a1, a2) {
  if(a1.length != a2.length) {
   return false;
  }
  for(var i in a1) {
   // Don't forget to check for arrays in our arrays.
   if(a1[i] instanceof Array && a2[i] instanceof Array) {
    if(!array_compare(a1[i], a2[i])) {
     return false;
    }
   }
   else if(a1[i] != a2[i]) {
    return false;
   }
  }
  return true;
 }

const BASE = 5
const LIMIT = BASE * 2 - 1

function inLattice(z, x, y) {
  // check if a point is in the lattice
  const layers = BASE;  // BASE sabitinin JavaScript'e tanımlanmış olması gerekiyor
  const minXY = z;
  const limitXY = LIMIT - z;  // LIMIT sabitinin JavaScript'e tanımlanmış olması gerekiyor
  const odd = z & 1;
  return (z >= 0 && z < layers) &&
    (odd === (x & 1) && odd === (y & 1)) &&
    (x >= minXY && x <= limitXY) &&
    (y >= minXY && y <= limitXY);
}


function validPieceOffset(zo, xo, yo, piece) {
  // check a piece at that place in the lattice is valid
  const [w, d, h, ps] = piece;
  for (const [z, x, y] of ps) {
    if (!inLattice(z + zo, x + xo, y + yo)) {
      return false;
    }
  }
  return true;
}

function offsetIsUsed(zo, xo, yo, piece, used) {
  // Check if the offset is already used for the piece
  const [w, d, h, ps] = piece;
  for (const [z, x, y] of ps) {
    if (used[zo + z][xo + x][yo + y]) {
      return true;
    }
  }
  return false;
}

function use(zo, xo, yo, piece, used) {
  // Mark the piece's positions as used in the used array
  const [w, d, h, ps] = piece;
  for (const [z, x, y] of ps) {
    used[zo + z][xo + x][yo + y] = true;
  }
}

function unuse(zo, xo, yo, piece, used) {
  // Unmark the piece's positions in the used array
  const [w, d, h, ps] = piece;
  for (const [z, x, y] of ps) {
    used[zo + z][xo + x][yo + y] = false;
  }
}

function isUsed(point, used) {
  // Check if the point is marked as used in the used array
  const [z, x, y] = point;
  return used[z][x][y];
}

const candidates = pieces.map(p => rotations(p));
let p = pieces[pieces.length - 1];
candidates[candidates.length - 1] = [p, rotateUp(p), rotateRight(rotateUp(p))];

// All the positions an item can take
const places = [];
for (let z = 0; z < BASE; z++) {
  for (let x = z; x <= LIMIT - z; x += 2) {
    for (let y = z; y <= LIMIT - z; y += 2) {
      places.push([z, x, y]);
    }
  }
}

function makeEmptyUsed() {
  // Create a dense (ish) used matrix
  return Array.from({ length: BASE }, () =>
    Array.from({ length: LIMIT }, () =>
      Array.from({ length: LIMIT }, () => false)
    )
  );
}

function zOrder(solution) {
  // Make a list of bits of objects in z-order, y-order
  let out = [];
  for (const [pc, p, r] of solution) {
    const [w, d, h, points] = candidates[p][r];
    const [z, x, y] = places[pc];
    const [fz, fx, fy] = points[0];
    const xo = x - fx;
    const yo = y - fy;
    const zo = z - fz;
    for (const [zp, xp, yp] of points) {
      out.push([zp + zo, yp + yo, xp + xo, p]);
    }
  }
  // out.sort();
  out = sorted(out);
  return out;
}

function formatSolution(solution) {
  const out = zOrder(solution);

  const layers = [
    Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => null)),
    Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => null)),
    Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => null)),
    Array.from({ length: 2 }, () => Array.from({ length: 2 }, () => null)),
    Array.from({ length: 1 }, () => Array.from({ length: 1 }, () => null))
  ];

  out.forEach(([z, y, x, p]) => {
    // console.log("Piece index:", p, "x, y, z:", x, y, z);
    const xAdjusted = x - z;
    const yAdjusted = y - z;
    if (0 <= xAdjusted / 2 && xAdjusted / 2 < layers[z].length &&
      0 <= yAdjusted / 2 && yAdjusted / 2 < layers[z][0].length) {
      layers[z][Math.floor(xAdjusted / 2)][Math.floor(yAdjusted / 2)] = p;
    }
  });

  layers.forEach(layer => {
    layer.forEach(row => {
      for (let i = 0; i < row.length; i++) {
        if (row[i] === null) {
          row[i] = '.';
        }
      }
    });
  });

  // console.log(layers);
  self.postMessage({ type: 'SOLUTION', data: layers });
  return layers;
}

function fs(pc, used, placed, result, solutions) {
  // Find a piece to fill place pc
  // NOTE: assumes that places[pc] is not used
  const [z, x, y] = places[pc];
  for (let p = 0; p < candidates.length; p++) {
    const piece = candidates[p];
    if (placed.includes(p)) {
      continue;
    }
    for (let r = 0; r < piece.length; r++) {
      const rotation = piece[r];
      const [w, d, h, points] = rotation;
      const [fz, fx, fy] = points[0];
      const xo = x - fx;
      const yo = y - fy;
      const zo = z - fz;
      if (validPieceOffset(zo, xo, yo, rotation, used) && !offsetIsUsed(zo, xo, yo, rotation, used)) {
        result.push([pc, p, r]);
        if (result.length === candidates.length) {
          formatSolution([...result]);
          solutions.push([...result]); // Array kopyalaması için spread operatörü
          result.pop();
          return;
        }

        // if (result.length === 3) { // Daha fazla log çıktısı için bu sayıyı artırabilirsiniz
        //   console.log(solutions.length, result);
        // }

        use(zo, xo, yo, rotation, used);
        placed.push(p);
        // Bir sonraki kullanılabilir noktayı bul
        let npc = pc + 1;
        while (isUsed(places[npc], used)) {
          npc++;
        }
        fs(npc, used, placed, result, solutions);
        placed.pop();
        unuse(zo, xo, yo, rotation, used);
        result.pop();
      }
    }
  }
}

function main() {
  console.log("Finding solutions...");

  let used = makeEmptyUsed();
  let placed = [];
  let result = [];
  let solutions = [];

  fs(0, used, placed, result, solutions);

  result = solutions[0];

  // solutions.forEach((solution, i) => {
  //     console.log(i);
  //     formatSolution(solution);
  //     console.log("");
  // })

  console.log("Found", solutions.length, "solutions.");


  //duplicate check
  let duplicate = false;
  for (let i = 0; i < solutions.length; i++) {
    for (let j = i + 1; j < solutions.length; j++) {
      if (JSON.stringify(solutions[i]) === JSON.stringify(solutions[j])) {
        duplicate = true;
        break;
      }
    }
  }
  if (duplicate) {
    console.log("Duplicate solution found.");
  } else {
    console.log("No duplicate solutions found.");
  }

  self.postMessage({ type: 'FINISHED' })
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
