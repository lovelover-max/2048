const boardSize = 4;  
let board = [];  
let score = 0;  

let bestScore = localStorage.getItem("bestScore")  
  ? parseInt(localStorage.getItem("bestScore"))  
  : 0; // 从localStorage获取历史最高分  

document.getElementById("best-score").innerText = bestScore; // 初始化显示历史最高分  

function startGame() {  
  document.getElementById("blur-background").style.display = "none";  
  document.getElementById("start-button").style.display = "none"; // 隐藏开始按钮  

  resetGame();  
  addRandomTile();  
  addRandomTile();  
  updateBoard();  
  document.addEventListener("keydown", handleKeyPress);  
}  

function resetGame() {  
  board = Array.from({ length: boardSize }, () =>  
    Array(boardSize).fill(0)  
  );  
  score = 0;  
  document.getElementById("current-score").innerText = score;  
  updateBoard();  
}  

function addRandomTile() {  
  let emptyTiles = [];  
  for (let r = 0; r < boardSize; r++) {  
    for (let c = 0; c < boardSize; c++) {  
      if (board[r][c] === 0) {  
        emptyTiles.push({ r, c });  
      }  
    }  
  }  
  if (emptyTiles.length > 0) {  
    const { r, c } =  
      emptyTiles[Math.floor(Math.random() * emptyTiles.length)];  
    board[r][c] = Math.random() < 0.9 ? 2 : 4; // 90% chance for 2, 10% for 4  
  }  
}  

function updateBoard() {  
  const tiles = document.querySelectorAll(".tile");  
  tiles.forEach((tile) => {  
    tile.innerText = "";  
    tile.setAttribute("data-value", 0);  
  });  

  for (let r = 0; r < boardSize; r++) {  
    for (let c = 0; c < boardSize; c++) {  
      const value = board[r][c];  
      if (value !== 0) {  
        const tile = tiles[r * boardSize + c];  
        tile.innerText = value;  
        tile.setAttribute("data-value", value);  
      }  
    }  
  }  
  document.getElementById("current-score").innerText = score;  

  // 更新历史最高分  
  if (score > bestScore) {  
    bestScore = score;  
    localStorage.setItem("bestScore", bestScore); // 保存到localStorage  
    document.getElementById("best-score").innerText = bestScore; // 更新显示  
  }  

  // 检查是否游戏结束  
  if (isGameOver()) {  
    document.getElementById("final-score").innerText = score; // 显示最终分数  
    document.getElementById("game-over").style.display = "block"; // 显示游戏结束画面  
    document.removeEventListener("keydown", handleKeyPress); // 移除键盘事件监听  
  }  
}  

function handleKeyPress(event) {  
  // 检查是否按下移动键  
  if (event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "ArrowLeft" || event.key === "ArrowRight") {  
      switch (event.key) {  
          case "ArrowUp":  
              moveUp();  
              break;  
          case "ArrowDown":  
              moveDown();  
              break;  
          case "ArrowLeft":  
              moveLeft();  
              break;  
          case "ArrowRight":  
              moveRight();  
              break;  
      }  
      addRandomTile(); // 只有在移动后才添加一个随机数字  
      updateBoard();  
  }  
}  

function moveUp() {  
  for (let c = 0; c < boardSize; c++) {  
    let stack = [];  
    for (let r = 0; r < boardSize; r++) {  
      if (board[r][c] !== 0) {  
        stack.push(board[r][c]);  
      }  
    }  
    mergeTiles(stack);  
    for (let r = 0; r < boardSize; r++) {  
      board[r][c] = stack[r] || 0;  
    }  
  }  
}  

function moveDown() {  
  for (let c = 0; c < boardSize; c++) {  
    let stack = [];  
    for (let r = boardSize - 1; r >= 0; r--) {  
      if (board[r][c] !== 0) {  
        stack.push(board[r][c]);  
      }  
    }  
    mergeTiles(stack);  
    for (let r = 0; r < boardSize; r++) {  
      board[boardSize - 1 - r][c] = stack[r] || 0;  
    }  
  }  
}  

function moveLeft() {  
  for (let r = 0; r < boardSize; r++) {  
    let stack = [];  
    for (let c = 0; c < boardSize; c++) {  
      if (board[r][c] !== 0) {  
        stack.push(board[r][c]);  
      }  
    }  
    mergeTiles(stack);  
    for (let c = 0; c < boardSize; c++) {  
      board[r][c] = stack[c] || 0;  
    }  
  }  
}  

function moveRight() {  
  for (let r = 0; r < boardSize; r++) {  
    let stack = [];  
    for (let c = boardSize - 1; c >= 0; c--) {  
      if (board[r][c] !== 0) {  
        stack.push(board[r][c]);  
      }  
    }  
    mergeTiles(stack);  
    for (let c = 0; c < boardSize; c++) {  
      board[r][boardSize - 1 - c] = stack[c] || 0;  
    }  
  }  
}  

function mergeTiles(stack) {  
  for (let i = 0; i < stack.length - 1; i++) {  
    if (stack[i] === stack[i + 1]) {  
      stack[i] *= 2;  
      score += stack[i];  
      stack[i + 1] = 0;  
    }  
  }  
  stack = stack.filter((value) => value !== 0);  
  return stack;  
}  

function isGameOver() {  
  // 检查是否有空格  
  for (let r = 0; r < boardSize; r++) {  
    for (let c = 0; c < boardSize; c++) {  
      if (board[r][c] === 0) {  
        return false;  
      }  
    }  
  }  

  // 检查是否可以合并  
  for (let r = 0; r < boardSize; r++) {  
    for (let c = 0; c < boardSize; c++) {  
      if (c < boardSize - 1 && board[r][c] === board[r][c + 1]) {  
        return false;  
      }  
      if (r < boardSize - 1 && board[r][c] === board[r + 1][c]) {  
        return false;  
      }  
    }  
  }  

  return true; // 游戏结束  
}  