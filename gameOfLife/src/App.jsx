import React, { use, useState, useEffect } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'

function App() {
  //const [count, setCount] = useState(0)
  const [width, setWidth] = useState(400)
  const [height, setHeight] = useState(400)
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)
  const [grid, setGrid] = useState({x: 40, y: 40}) // min should be at least 3
  // keeps track of the current board state
  // is a 2D array, y rows and x cols, with 1 being alive and 0 being dead
  const [boardState, setBoardState] = useState([])
  const [aliveRatio, setAliveRatio] = useState(0.2)
  const [runGame, setRunGame] = useState(false);

  function drawBorder() {
    const cubeWidth = width/grid.x;
    const cubeHeight = height/grid.y;

    let canvas = document.getElementById('board');
    let context = canvas.getContext('2d');

    // 0-255 (inclusive)
    let red = 255;
    let green = 255;
    let blue = 255;
    let transparency = 1.0;
    context.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${transparency})`; 
    context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${transparency})`

    // creates the grid lines around each square in the board
    for (var x = startX; x <= startX + width; x += cubeWidth) {
      context.moveTo(x, startY);
      context.lineTo(x, startY + height);
    }
    
    for (var y = startY; y <= startY + height; y += cubeHeight) {
      context.moveTo(startX, y);
      context.lineTo(startX + width, y);
    }
    context.stroke();
  }

  function drawBoard() {
    // board state that will be set to boardState
    const currentBoard = [];
    const cubeWidth = width/grid.x;
    const cubeHeight = height/grid.y;

    let canvas = document.getElementById('board');
    let context = canvas.getContext('2d');

    // clear board
    context.clearRect(startX, startY, width, height);

    drawBorder();

    // fills in the squares within 
    // y is the rows and x is the columns
    for (let i = 0; i < grid.y; i++) {
      currentBoard[i] = [];
      for (let j = 0; j < grid.x; j++) {
        if (Math.random() < aliveRatio) {
          currentBoard[i][j] = 1;
          context.fillRect(startX + (cubeWidth * j), startY + (cubeHeight * i), cubeWidth, cubeHeight);
        } else {
          currentBoard[i][j] = 0;
        }
      }
    }

    // save current state of board
    setBoardState(currentBoard);
  }

  function checkAlive(x, y) {
    let alive = 0;
    if (x !== 0) {
      // not at leftside
      alive += boardState[y][x - 1];
      if (y !== 0) {
        // not at top left corner
        alive += boardState[y - 1][x - 1];
      }
    }
    if (x !== (grid.x - 1)) {
      // not at rightside
      alive += boardState[y][x + 1];
      if (y !== (grid.y - 1)) {
        // not at bottom right corner
        alive += boardState[y + 1][x + 1];
      }
    }
    if (y !== 0) {
      // not at top
      alive += boardState[y - 1][x];
      if (x !== (grid.x - 1)) {
        // not at top right corner
        alive += boardState[y - 1][x + 1];
      }
    }
    if (y !== (grid.y - 1)) {
      // not at bottom
      alive += boardState[y + 1][x];
      if (x !== 0) {
        // not at bottom left corner
        alive += boardState[y + 1][x - 1];
      }
    }
    return alive;
  }

  function newCellState(oldState, alive) {
    let newState = oldState;
    if (oldState === 0 && alive === 3) {
      newState = 1;
    } else if (oldState === 1 && (alive < 2 || alive > 3)) {
      newState = 0;
    }
    return newState;
  }

  function runSimulation() {
    let newBoard = [];
    const cubeWidth = width/grid.x;
    const cubeHeight = height/grid.y;

    let canvas = document.getElementById('board');
    let context = canvas.getContext('2d');
  
    //while (runGame) {
      for (let i = 0; i < grid.y; i++) {
        newBoard[i] = [];
        for (let j = 0; j < grid.x; j++) {
          let alive = checkAlive(j, i);
          let cellState = newCellState(boardState[j][i], alive);
          newBoard[i][j] = cellState;
          if (cellState === 1) {
            context.fillStyle = "#FFFFFF";
            context.fillRect(startX + (cubeWidth * j), startY + (cubeHeight * i), cubeWidth, cubeHeight);
          } else {
            context.fillStyle = "#242424";
            context.fillRect(startX + (cubeWidth * j), startY + (cubeHeight * i), cubeWidth, cubeHeight);
          }
        }
      }
      setBoardState(newBoard);
      drawBorder();
    //}

  }

  useEffect(() => {
    let timer;
    if (runGame) {
      timer = setTimeout(() => {
        runSimulation();
      }, 1000);
    }

    return () => clearTimeout(timer)
  }, [runGame, boardState])

  return (
    <>
      <div>
        <h1>Conway's Game of Life</h1>
      </div>
      <div>
        <canvas id='board' width={width} height={height}>
        </canvas>
      </div>
      <div>
        <button onClick={() => drawBoard()}>
          Generate Board
        </button>
        <button onClick={() => {runGame ? setRunGame(false) : setRunGame(true)}}>
          {runGame ? 'Stop' : 'Start'}
        </button>
      </div>
    </>
  )
}

/*
<button onClick={runGame ? () => setRunGame(false) : runSimulation}>
*/

export default App
