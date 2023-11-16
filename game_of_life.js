//Variables globales
const cellSize = 20;
const neighbors = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1], [1, 0], [1, 1]
];
let grid = createEmptyGrid();
let running = false;
let intervalId;
let generationCount = 0;
let startTime;
let interval = 100;
let rows = 15;
let cols = 15;

//Fonction pour créer une grille
function createEmptyGrid() {
    return Array.from({ length: 15 }, () => Array(15).fill(false));
}

//Fonction pour afficher la grille sur le canvas
function initializeGrid() {
    const test = document.getElementById('time-slider');
    interval = test.value;
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';

    let gridColumnValue, gridRowValue;

    // Adapter la grille en fonction de l'écran
    if (window.innerWidth <= 480) {
        gridColumnValue = gridRowValue = 'repeat(15, 15px)';
    } else {
        gridColumnValue = `repeat(${cols}, 20px)`;
        gridRowValue = `repeat(${rows}, 20px)`;
    }

    gridContainer.style.gridTemplateColumns = gridColumnValue;
    gridContainer.style.gridTemplateRows = gridRowValue;

    for (let i = 0; i < (window.innerWidth <= 480 ? 15 : rows); i++) {
        for (let j = 0; j < (window.innerWidth <= 480 ? 15 : cols); j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.onclick = () => toggleCell(i, j);
            gridContainer.appendChild(cell);
        }
    }
}

//Fonction pour mettre à jour les cellules de la grille
function updateGridDisplay() {
    const gridContainer = document.getElementById('grid-container');
    const cells = gridContainer.getElementsByClassName('cell');
    const gridSize = window.innerWidth <= 480 ? 15 : rows;

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const index = i * cols + j;
            const cell = cells[index];
            cell.style.backgroundColor = grid[i][j] ? '#4CAF50' : 'white';
        }
    }
}

//Fonction pour selectionner ou deselectionner une cellule
function toggleCell(row, col) {
    grid[row][col] = !grid[row][col];
    updateGridDisplay();
}

//Fonction pour démarrer le jeu
function startGame() {
    if(startTime == undefined)
        startTime = new Date();
    if (!running) {
        intervalId = setInterval(updateGame, interval);
        running = true;
    }
}

//Fonction pour passer à la génération suivante manuellement
function nextGeneration() {
    if(startTime == undefined)
        startTime = new Date();
    updateGame();
    running = true;
}

//Fonction pour arrêter le jeu
function stopGame() {
    if (running) {
        clearInterval(intervalId);
        running = false;
    }
}

//Fonction pour effacer la grille
function clearGrid() {
    startTime = undefined;
    grid = createEmptyGrid();
    generationCount = 0;
    const timer = document.getElementById('time-counter');
    timer.textContent = `Temps écoulé: 0s`;
    updateGenerationCounter();
    stopGame();
    const gridContainer = document.getElementById('grid-container');
    const cells = gridContainer.getElementsByClassName('cell');
    const gridSize = window.innerWidth <= 480 ? 15 : rows;

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const index = i * cols + j;
            const cell = cells[index];
            cell.style.backgroundColor = grid[i][j] ? '#ddd' : '#eee';
        }
    }
}

//Fonction pour remplir la grille avec des cellules aléatoires
function randomSeed() {
    clearGrid();
    const gridContainer = document.getElementById('grid-container');
    const cells = gridContainer.getElementsByClassName('cell');
    const gridSize = window.innerWidth <= 480 ? 15 : rows;

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const index = i * cols + j;
            const cell = cells[index];
            if (Math.random() > 0.7) {
                toggleCell(i, j);
            }
        }
    }
}

//Fonction pour mettre à jour la grille
function updateGame() {
    const newGrid = createEmptyGrid();

    const gridSize = window.innerWidth <= 480 ? 15 : rows;

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const countedNeighbors = countNeighbors(i, j);
            if (grid[i][j]) {
                //conserve sa vie si elle a 2 ou 3 voisins
                newGrid[i][j] = countedNeighbors === 2 || countedNeighbors === 3;
            } else {
                //devient vivante uniquement si elle a exactement 3 voisins
                newGrid[i][j] = countedNeighbors === 3;
            }
        }
    }

    grid = newGrid;
    generationCount++;
    updateGenerationCounter();
    updateGridDisplay();
    updateTimer();
}

//Fonction pour mettre à jour le temps écoulé
function updateTimer() {
    const currentTime = new Date();
    const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
    const timer = document.getElementById('time-counter');
    timer.textContent = `Temps écoulé: ${elapsedSeconds}s`;
}

//Fonction pour compter le nombre de voisins d'une cellule
function countNeighbors(row, col) {
    const countedNeighbors = neighbors.reduce((count, [i, j]) => {
        const newRow = row + i;
        const newCol = col + j;

        if (isValidCell(newRow, newCol)) {
            count += grid[newRow][newCol] ? 1 : 0;
        }

        return count;
    }, 0);
    return countedNeighbors;
}

//Fonction pour verifier si la cellule appartient à la grille
function isValidCell(i, j) {
    return i >= 0 && i < rows && j >= 0 && j < cols;
}

//Fonction pour mettre à jour le nombre de générations
function updateGenerationCounter() {
    const counter = document.getElementById('generation-counter');
    counter.textContent = `Générations: ${generationCount}`;
}

//Fonction pour changer la vitesse du jeu
function updateInterval(value) {
    interval = 200 - parseInt(value);
    if (running) {
        stopGame();
        startGame();
    }
}

//Fonction pour changer la taille de la grille
function updateGridSize(value) {
    cols = parseInt(value);
    rows = cols;
    initializeGrid();
}

//Initialisation d'une nouvelle grille
initializeGrid();