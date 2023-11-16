const cellSize = 20;

let grid = createEmptyGrid();
let running = false;
let intervalId;
let generationCount = 0;
let startTime;
let interval = 100;
let rows = 15;
let cols = 15;

function createEmptyGrid() {
    return Array.from({ length: 15 }, () => Array(15).fill(false));
}

function initializeGrid() {
    const test = document.getElementById('time-slider');
    interval = test.value;
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';

    const gridColumnValue = `repeat(${cols}, 20px)`;
    const gridRowValue = `repeat(${rows}, 20px)`;

    if (window.innerWidth <= 480) {
        gridContainer.style.gridTemplateColumns = `repeat(15, 15px)`;
        gridContainer.style.gridTemplateRows = `repeat(15, 15px)`;
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 15; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.onclick = () => toggleCell(i, j);
                gridContainer.appendChild(cell);
            }
        }
    } else {
        gridContainer.style.gridTemplateColumns = gridColumnValue;
        gridContainer.style.gridTemplateRows = gridRowValue;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.onclick = () => toggleCell(i, j);
                gridContainer.appendChild(cell);
            }
        }
    }
}

function updateGridDisplay() {
    const gridContainer = document.getElementById('grid-container');
    const cells = gridContainer.getElementsByClassName('cell');

    if (window.innerWidth <= 480) {
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 15; j++) {
                const index = i * cols + j;
                const cell = cells[index];
                cell.style.backgroundColor = grid[i][j] ? '#4CAF50' : 'white';
            }
        }
    }else {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const index = i * cols + j;
                const cell = cells[index];
                cell.style.backgroundColor = grid[i][j] ? '#4CAF50' : 'white';
            }
        }
    }
}

function toggleCell(row, col) {
    grid[row][col] = !grid[row][col];
    updateGridDisplay();
}

function startGame() {
    if (!running) {
        startTime = new Date();
        intervalId = setInterval(updateGame, interval);
        running = true;
    }
}

function nextGeneration() {
    if(!running) startTime = new Date();
    updateGame();
    running = true;
}

function stopGame() {
    if (running) {
        clearInterval(intervalId);
        running = false;
    }
}

function clearGrid() {
    grid = createEmptyGrid();
    generationCount = 0;
    const timer = document.getElementById('time-counter');
    timer.textContent = `Temps écoulé: 0s`;
    updateGenerationCounter();
    stopGame();
    const gridContainer = document.getElementById('grid-container');
    const cells = gridContainer.getElementsByClassName('cell');
    if(window.innerWidth <= 480) {
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 15; j++) {
                const index = i * cols + j;
                const cell = cells[index];
                cell.style.backgroundColor = grid[i][j] ? '#ddd' : '#eee';
            }
        }
    } else {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const index = i * cols + j;
                const cell = cells[index];
                cell.style.backgroundColor = grid[i][j] ? '#ddd' : '#eee';
            }
        }
    }
}

function randomSeed() {
    clearGrid();
    if(window.innerWidth <= 480) {
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 15; j++) {
                if (Math.random() > 0.7) {
                    toggleCell(i, j);
                }
            }
        }
    } else {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (Math.random() > 0.7) {
                    toggleCell(i, j);
                }
            }
        }
    }
}

function updateGame() {
    const newGrid = createEmptyGrid();
    if(window.innerWidth <= 480) {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const neighbors = countNeighbors(i, j);
                if (grid[i][j]) {
                    newGrid[i][j] = neighbors === 2 || neighbors === 3;
                } else {
                    newGrid[i][j] = neighbors === 3;
                }
            }
        }
    } else {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const neighbors = countNeighbors(i, j);
                if (grid[i][j]) {
                    newGrid[i][j] = neighbors === 2 || neighbors === 3;
                } else {
                    newGrid[i][j] = neighbors === 3;
                }
            }
        }
    }

    grid = newGrid;
    generationCount++;
    updateGenerationCounter();
    updateGridDisplay();
    updateTimer();
}

function updateTimer() {
    const currentTime = new Date();
    const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
    const timer = document.getElementById('time-counter');
    timer.textContent = `Temps écoulé: ${elapsedSeconds}s`;
}

function countNeighbors(row, col) {
    const neighbors = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    return neighbors.reduce((count, [i, j]) => {
        const newRow = row + i;
        const newCol = col + j;

        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
            count += grid[newRow][newCol] ? 1 : 0;
        }

        return count;
    }, 0);
}

function updateGenerationCounter() {
    const counter = document.getElementById('generation-counter');
    counter.textContent = `Générations: ${generationCount}`;
}

function updateTimer() {
    const currentTime = new Date();
    const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
    const timer = document.getElementById('time-counter');
    timer.textContent = `Temps écoulé: ${elapsedSeconds}s`;
}

function updateInterval(value) {
    interval = 200 - parseInt(value);
    if (running) {
        stopGame();
        startGame();
    }
}

function updateGridSize(value) {
    cols = parseInt(value);
    rows = cols;
    initializeGrid();
}

initializeGrid();