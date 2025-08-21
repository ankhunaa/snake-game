const WIDTH = 16;
const HEIGHT = 16;
const unitSpace = 40;

const board = document.querySelector(".board");

// RIGHT BOTTOM LEFT TOP
let DIRECTION = "LEFT";

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

// Generate food not on the snake
const generateFood = () => {
  let newFood;
  do {
    newFood = { x: getRandomInt(0, HEIGHT), y: getRandomInt(0, WIDTH) };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  return newFood;
};

let snake = [
  { x: Math.floor(HEIGHT / 2), y: Math.floor(WIDTH / 2) },
  { x: Math.floor(HEIGHT / 2), y: Math.floor(WIDTH / 2) - 1 },
  { x: Math.floor(HEIGHT / 2), y: Math.floor(WIDTH / 2) - 2 },
];

let food = generateFood();

const drawBoard = () => {
  board.innerHTML = "";
  board.style.width = `${unitSpace * WIDTH}px`;
  board.style.height = `${unitSpace * HEIGHT}px`;

  for (let row = 0; row < HEIGHT; row++) {
    for (let col = 0; col < WIDTH; col++) {
      const tileEl = document.createElement("div");
      tileEl.setAttribute("x", row);
      tileEl.setAttribute("y", col);
      tileEl.className = "tile";
      board.appendChild(tileEl);
    }
  }

  const foodEl = document.querySelector(`[x="${food.x}"][y="${food.y}"]`);
  foodEl.classList.add("food");

  snake.forEach((dot, i) => {
    const el = document.querySelector(`[x="${dot.x}"][y="${dot.y}"]`);
    if (i === 0) el.classList.add("head");
    else el.classList.add("body");
  });
};

drawBoard();

const gameLoop = () => {
  const newSnake = [];

  // Move head depending on direction
  if (DIRECTION === "RIGHT") {
    newSnake[0] = { x: snake[0].x, y: (snake[0].y + 1) % WIDTH };
  } else if (DIRECTION === "LEFT") {
    let nextY = snake[0].y - 1;
    if (nextY === -1) nextY = WIDTH - 1;
    newSnake[0] = { x: snake[0].x, y: nextY };
  } else if (DIRECTION === "BOTTOM") {
    newSnake[0] = { x: (snake[0].x + 1) % HEIGHT, y: snake[0].y };
  } else if (DIRECTION === "TOP") {
    let nextX = snake[0].x - 1;
    if (nextX === -1) nextX = HEIGHT - 1;
    newSnake[0] = { x: nextX, y: snake[0].y };
  }

  // Add rest of the body
  for (let i = 0; i < snake.length - 1; i++) {
    newSnake.push(snake[i]);
  }

  const head = newSnake[0];

  // Check if snake eats food
  if (head.x === food.x && head.y === food.y) {
    newSnake.push(snake[snake.length - 1]); // grow snake
    food = generateFood(); // move food
  }

  snake = newSnake;
  drawBoard();
};

setInterval(gameLoop, 200);

// Direction control
window.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if ((key === "arrowup" || key === "w") && DIRECTION !== "BOTTOM") DIRECTION = "TOP";
  else if ((key === "arrowdown" || key === "s") && DIRECTION !== "TOP") DIRECTION = "BOTTOM";
  else if ((key === "arrowright" || key === "d") && DIRECTION !== "LEFT") DIRECTION = "RIGHT";
  else if ((key === "arrowleft" || key === "a") && DIRECTION !== "RIGHT") DIRECTION = "LEFT";
});
