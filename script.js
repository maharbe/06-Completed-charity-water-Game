// Game configuration and state variables
const GOAL_CANS = 20;        // Total items needed to collect
let currentCans = 0;         // Current number of items collected
let gameActive = false;      // Tracks if game is currently running
let spawnInterval;          // Holds the interval for spawning items
let timerInterval;           // Holds the interval for the timer
let timeLeft = 30;           // Time left in seconds

// Creates the 3x3 game grid where items will appear
function createGrid() {
  const grid = document.querySelector('.game-grid');
  grid.innerHTML = ''; // Clear any existing grid cells
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell'; // Each cell represents a grid square
    grid.appendChild(cell);
  }
}

// Ensure the grid is created when the page loads
createGrid();

// Spawns a new item in a random grid cell
function spawnWaterCan() {
  if (!gameActive) return; // Stop if the game is not active
  const cells = document.querySelectorAll('.grid-cell');
  
  // Clear all cells before spawning a new water can
  cells.forEach(cell => (cell.innerHTML = ''));

  // Decide randomly if this spawn will be a water can or an obstacle
  const rand = Math.random();
  let obstacleType = null;
  if (rand < 0.18) {
    obstacleType = 1; // 18% chance for -1
  } else if (rand < 0.35) {
    obstacleType = 2; // 17% chance for -2
  }
  // 65% chance for water can

  // Select a random cell from the grid to place the item
  const randomCell = cells[Math.floor(Math.random() * cells.length)];

  if (obstacleType) {
    randomCell.innerHTML = `
      <div class="obstacle-wrapper">
        <div class="obstacle obstacle-${obstacleType}"></div>
      </div>
    `;
    const obstacle = randomCell.querySelector('.obstacle');
    if (obstacle) {
      obstacle.addEventListener('click', function handleObstacleClick() {
        if (!gameActive) return;
        let penalty = 0;
        if (obstacleType === 1) penalty = 1;
        if (obstacleType === 2) penalty = 2;
        currentCans = Math.max(0, currentCans - penalty);
        const cansElem = document.getElementById('current-cans');
        cansElem.textContent = currentCans;
        animateElement(cansElem, 'flash');
        randomCell.innerHTML = '';
      });
    }
  } else {
    randomCell.innerHTML = `
      <div class="water-can-wrapper">
        <div class="water-can"></div>
      </div>
    `;
    const can = randomCell.querySelector('.water-can');
    if (can) {
      can.addEventListener('click', function handleCanClick() {
        if (!gameActive) return;
        currentCans++;
        const cansElem = document.getElementById('current-cans');
        cansElem.textContent = currentCans;
        animateElement(cansElem, 'pop');
        randomCell.innerHTML = '';
        if (currentCans >= GOAL_CANS) {
          endGame();
          document.getElementById('achievements').textContent = 'You win!';
          showConfetti();
        }
      });
    }
  }
}

// Initializes and starts a new game
function startGame() {
  if (gameActive) return; // Prevent starting a new game if one is already active
  gameActive = true;
  document.getElementById('start-game').style.display = 'none';
  document.getElementById('reset-game').style.display = 'inline-block';
  currentCans = 0;
  timeLeft = 30;
  document.getElementById('current-cans').textContent = currentCans;
  document.getElementById('timer').textContent = timeLeft;
  document.getElementById('achievements').textContent = '';
  createGrid(); // Set up the game grid
  spawnInterval = setInterval(spawnWaterCan, 1000); // Spawn water cans every second
  timerInterval = setInterval(updateTimer, 1000); // Start the timer
}

function updateTimer() {
  if (!gameActive) return;
  timeLeft--;
  const timerElem = document.getElementById('timer');
  timerElem.textContent = timeLeft;
  animateElement(timerElem, 'flash');
  if (timeLeft <= 0) {
    endGame();
    document.getElementById('achievements').textContent = 'Time\'s up!';
  }
}

function endGame() {
  gameActive = false; // Mark the game as inactive
  clearInterval(spawnInterval); // Stop spawning water cans
  clearInterval(timerInterval); // Stop the timer
  document.getElementById('start-game').style.display = 'inline-block';
  document.getElementById('reset-game').style.display = 'none';
}

// Reset game state and UI
function resetGame() {
  gameActive = false;
  clearInterval(spawnInterval);
  clearInterval(timerInterval);
  currentCans = 0;
  timeLeft = 30;
  document.getElementById('current-cans').textContent = currentCans;
  document.getElementById('timer').textContent = timeLeft;
  document.getElementById('achievements').textContent = '';
  createGrid();
  document.getElementById('start-game').style.display = 'inline-block';
  document.getElementById('reset-game').style.display = 'none';
}

// Add this function for visual feedback
function animateElement(element, className) {
  element.classList.add(className);
  setTimeout(() => {
    element.classList.remove(className);
  }, 300);
}

// Simple confetti effect using emoji
function showConfetti() {
  const confettiContainer = document.createElement('div');
  confettiContainer.className = 'confetti-container';
  for (let i = 0; i < 40; i++) {
    const conf = document.createElement('span');
    conf.className = 'confetti';
    conf.textContent = ['🎉','✨','💧','🎊','⭐','💦'][Math.floor(Math.random()*6)];
    conf.style.left = Math.random() * 100 + 'vw';
    conf.style.animationDelay = (Math.random() * 1.5) + 's';
    confettiContainer.appendChild(conf);
  }
  document.body.appendChild(confettiContainer);
  setTimeout(() => {
    confettiContainer.remove();
  }, 2500);
}

// Set up click handler for the start button
document.getElementById('start-game').addEventListener('click', startGame);
document.getElementById('reset-game').addEventListener('click', resetGame);
