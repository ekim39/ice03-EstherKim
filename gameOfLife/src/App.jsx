import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [width, setWidth] = useState(200)
  const [height, setHeight] = useState(200)
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)
  const [grid, setGrid] = useState({x: 20, y: 20})

  function drawBoard() {
    let canvas = document.getElementById('board');
    let context = canvas.getContext('2d');

    // clear board
    context.clearRect(startX, startY, width, height);

    // 0-255 (inclusive)
    let red = 255;
    let green = 255;
    let blue = 255;
    let transparency = 0.7;
    context.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${transparency})`; 


    for (var x = startX; x <= startX + width; x += width/grid.x) {
      context.moveTo(x, startY);
      context.lineTo(x, startY + height);
    }
    
    for (var y = startY; y <= startY + height; y += height/grid.y) {
      context.moveTo(startX, y);
      context.lineTo(startX + width, y);
    }
    context.stroke();
  }

  return (
    <>
      <div>
        <h1>Conway's Game of Life</h1>
      </div>
      <div>
        <canvas id='board' width={width} height={height}>
        </canvas>
      </div>
      <button onClick={() => drawBoard()}>
        Generate Board
      </button>
    </>
  )
}

export default App
