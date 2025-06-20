import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
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
  const [aliveRatio, setAliveRatio] = useState(20)
  const [runGame, setRunGame] = useState(false);
  // interactivity (sliders)

  // draws the border of the board
  function drawBorder() {
    const cubeWidth = width/grid.x;
    const cubeHeight = height/grid.y;

    let canvas = document.getElementById('board');
    let context = canvas.getContext('2d');

    const aliveColor = getComputedStyle(document.documentElement).getPropertyValue('color');

    context.strokeStyle = aliveColor; 

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

  // draws the initial board in generating a random board state
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
    const aliveColor = getComputedStyle(document.documentElement).getPropertyValue('color');
    context.fillStyle = aliveColor;

    // fills in the squares within 
    // y is the rows and x is the columns
    for (let i = 0; i < grid.y; i++) {
      currentBoard[i] = [];
      for (let j = 0; j < grid.x; j++) {
        if (Math.random() < (aliveRatio / 100.0)) {
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

  // returns how many of the surrounding tiles of the tile at coordinate x, y are alive
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

  // checks whether the cell is alive or dead using its old state and how many cells around it are alive
  function newCellState(oldState, alive) {
    let newState = oldState;
    if (oldState === 0 && alive === 3) {
      newState = 1;
    } else if (oldState === 1 && (alive < 2 || alive > 3)) {
      newState = 0;
    }
    return newState;
  }

  // runs one step in the simulation of the game of life
  function runSimulation() {
    let newBoard = [];
    const cubeWidth = width/grid.x;
    const cubeHeight = height/grid.y;

    let canvas = document.getElementById('board');
    let context = canvas.getContext('2d');
    const aliveColor = getComputedStyle(document.documentElement).getPropertyValue('color');
    const deadColor = getComputedStyle(document.documentElement).getPropertyValue('background-color');
  
    for (let i = 0; i < grid.y; i++) {
      newBoard[i] = [];
      for (let j = 0; j < grid.x; j++) {
        let alive = checkAlive(j, i);
        let cellState = newCellState(boardState[j][i], alive);
        newBoard[i][j] = cellState;
        if (cellState === 1) {
          context.fillStyle = aliveColor;
          context.fillRect(startX + (cubeWidth * j), startY + (cubeHeight * i), cubeWidth, cubeHeight);
        } else {
          context.fillStyle = deadColor;
          context.fillRect(startX + (cubeWidth * j), startY + (cubeHeight * i), cubeWidth, cubeHeight);
        }
      }
    }
    setBoardState(newBoard);
    drawBorder();

  }

  const handleAliveSliderChange = (event, newValue) => {
    setAliveRatio(newValue);
  };

  const handleWidthSliderChange = (event, newValue) => {
    setWidth(newValue);
    setHeight(newValue);
    setGrid({x: newValue / 10, y: newValue / 10})
  }

  // is called everytime runGame or the boardState is modified, used to run the whole simulation
  useEffect(() => {
    let timer; // timer keeps speed of the simulation
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
      <div>
        <canvas id='board' width={width} height={height}>
        </canvas>
      </div>
      
        <button onClick={() => drawBoard()}>
          Generate Board
        </button>
        <button onClick={() => {runGame ? setRunGame(false) : setRunGame(true)}}>
          {runGame ? 'Stop' : 'Start'}
        </button>
        <div id="sliders">
          <Typography id="aliveRatioSlider" gutterBottom>
            Ratio of Initial Alive Cells
          </Typography>
          <Grid container spacing={2} sx={{ alignItems: 'center' }}>
            <Slider
              value={typeof aliveRatio === 'number' ? aliveRatio : 0}
              onChange={handleAliveSliderChange}
              min={0}
              max={100}
              aria-labelledby="aliveRatioSlider"
              valueLabelDisplay="auto"
              step={1}
            />
          </Grid>
          <Typography id="gridWidthSlider" gutterBottom>
            Grid Width
          </Typography>
            <Slider
              onChange={handleWidthSliderChange}
              min={200}
              max={500}
              shiftStep={40}
              marks
              aria-labelledby="gridWidthSlider"
              valueLabelDisplay="auto"
              step={10}
            />
        </div>
      </div>
    </>
  )
}

export default App
