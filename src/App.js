import { useCallback, useRef, useState } from "react";
import "./App.css";

const numRows = 40;
const numCols = 70;

const operations = [
  [0, 1],
  [1, 0],
  [1, 1],
  [-1, -1],
  [-1, 0],
  [0, -1],
  [1, -1],
  [-1, 1],
];

const produce = (grid, callback) => {
  const newgrid = JSON.parse(JSON.stringify(grid));
  callback(newgrid);
  return newgrid;
};

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }
  return rows;
};

function App() {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  const [running, SetRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;

  const GameLoop = useCallback(() => {
    if (!runningRef.current) return;

    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols)
                neighbors += g[newI][newJ];
            });
            if (neighbors < 2 || neighbors > 3) gridCopy[i][j] = 0;
            else if (g[i][j] === 0 && neighbors === 3) gridCopy[i][j] = 1;
          }
        }
      });
    });

    setTimeout(GameLoop, 200);
  }, []);

  return (
    <div className="center">
      <div className="btnCenter">
        <button
          className="btn"
          onClick={() => {
            SetRunning(!running);
            if (!running) {
              runningRef.current = true;
              GameLoop();
            }
          }}
        >
          {running ? "Stop" : "Start"}
        </button>
        <button
          className="btn"
          onClick={() => {
            setGrid(generateEmptyGrid());
          }}
        >
          Reset
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((cols, j) => (
            <div
              key={`${i}-${j}`}
              onClick={() => {
                const newgrid = produce(grid, (newgrid) => {
                  newgrid[i][j] = 1 - newgrid[i][j];
                });
                setGrid(newgrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][j] ? "yellow" : "#2e2e2e",
                border: "solid 1px #6d6c6c",
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default App;
