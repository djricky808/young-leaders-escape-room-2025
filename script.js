let roomsTraveled = 0;
let currentRowOnGameGrid = 0;
let currentColumnOnGameGrid = 0;
let previousRowOnGameGrid = 0;
let previousColumnOnGameGrid = 0;
let timeLimit = 30;
const gameGrid = [];
const rows = 5;
const columns = 5;
const squares = rows * columns;
const spots = squares - 5;

class CreateRoom {
  constructor(i, j) {
    this.assignedRoom = null;
    this.assignedTeam = null;
    this.hasRoomBeenEntered = false;
    this.row = i;
    this.column = j;
  }
}

const rooms = {
  hotshot: {
    color: "#BE3D2A",
    roomName: "Hotshot Room",
    rules: "Chosen players need to land a plunger dart on the given target",
    count: Math.ceil(spots / 4),
  },
  balance: {
    color: "yellow",
    roomName: "Balance Room",
    rules:
      "Chosen players must balance 3 balls on a plate while walking in a straight line.",
    count: Math.ceil(spots / 4),
  },
  domino: {
    color: "blue",
    roomName: "Domino Room",
    rules:
      "Chosen players must set up 50 dominoes on the table. These dominos must all be knocked down in one run.",
    count: Math.ceil(spots / 4),
  },
  memory: {
    color: "green",
    roomName: "Energy Room",
    rules: "Players will match Pokemon Energy Cards, Memory style",
    count: Math.ceil(spots / 4),
  },
  deadEnd: {
    color: "black",
    roomName: "DEAD END!",
    rules:
      "Oh no! You reached a dead end, go back to where you came. <br> CAUTION! If you enter this exact room again, the game will be over!",
    count: Math.ceil(spots / Math.floor(Math.sqrt(squares))),
  },
  reEnteredDeadEnd: {
    color: "black",
    roomName: "GAME OVER!",
    rules:
      "Oh no! You entered this dead end room again! I am afraid that this is the end of the road for you!",
  },
  outOfTime: {
    color: "black",
    roomName: "GAME OVER!",
    rules:
      "Oh no! You ran out of time! I am afraid that this is the end of the road for you!",
  },
  finish: {
    color: "White",
    roomName: "CONGRATULATIONS",
    rules: "You escaped with a time of...",
  },
  start: {
    color: "Gray",
    roomName: "Starting Room",
    rules: `Are you lost? You're back to where you started!<br>Or maybe you got sent back here after a dead end, oh very well!`,
  },
};

const teams = {
  confidential: {
    id: "confidential",
    teamName: "It's Confidential",
    spaces: spots / 5,
  },
  fryBreads: {
    id: "fryBreads",
    teamName: "FryBreads",
    spaces: spots / 5,
  },
  smirthies: {
    id: "smirthies",
    teamName: "Smirthies",
    spaces: spots / 5,
  },
  oneForAll: {
    id: "oneForAll",
    teamName: "One for All <br> (1 Person from Each Team)",
    spaces: spots / 5,
  },
  allForOne: {
    id: "allForOne",
    teamName: "All for One <br> (Everybody is Playing)",
    spaces: spots / 5,
  },
};

//Buttons
const newGameBtn = document.getElementById("start-new-game");
const upButton = document.getElementById("up");
const downButton = document.getElementById("down");
const leftButton = document.getElementById("left");
const rightButton = document.getElementById("right");
const beginButton = document.getElementById("begin");

//Room Screens-Selectors
const introductionScreen = document.getElementById("intro");
const selectDirectionScreen = document.getElementById("direction");
const roomScreen = document.getElementById("room");
const rulesScreen = document.getElementById("rules");

//Timer Functions
let timer = 1800000;
let timeElapsed = 0;
let timerRunning = false;
let intervalID = null;

const timerText = document.getElementById("timer");

function countdown() {
  return (timer -= 1000);
}

function stopWatch() {
  return (timeElapsed += 1000);
}

function startTimer() {
  if (timerRunning) return;
  timerRunning = true;
  intervalID = setInterval(() => {
    countdown();
    stopWatch();
    if (timer <= 0) {
      stopTimer();
      gameOver("outOfTime");
    }
    updateTime();
  }, 1000);
}

function stopTimer() {
  timerRunning = false;
  clearInterval(intervalID);
}

function resetTimer() {
  timer = 1800000;
  timeElapsed = 0;
  updateTime();
}

function updateTime() {
  let totalSeconds = Math.floor(timer / 1000);
  let minutes = Math.floor(totalSeconds / 60);
  timeLimit = minutes;
  let seconds = totalSeconds % 60;
  let formattedMinutes = String(minutes).padStart(2, "0");
  let formattedSeconds = String(seconds).padStart(2, "0");
  let textColor = minutes < 5 ? "color:red" : "color:white";
  timerText.innerHTML = `
    <h1 style=${textColor}>${formattedMinutes}:${formattedSeconds}</h1>`;
}

//startTimer(); //TESTING

function buildMap() {
  buildGrid(rows, columns);
  assignStartRoom();
  assignFinishRoom();
  assignDeadEndRooms();
  assignRemainingRooms();
  assignTeamToRooms();
  console.log(gameGrid);
}

function buildGrid(rows, columns) {
  for (let i = 0; i < rows; i++) {
    gameGrid.push([]);
    for (let j = 0; j < columns; j++) {
      gameGrid[i].push(new CreateRoom(i, j));
    }
  }
}

function assignStartRoom() {
  let notTheMiddleRows = [0, 1, rows - 2, rows - 1];
  let pickRow =
    notTheMiddleRows[Math.floor(Math.random() * notTheMiddleRows.length)];
  let notTheMiddleColumns = [0, 1, columns - 2, columns - 1];
  let pickColumn =
    notTheMiddleColumns[Math.floor(Math.random() * notTheMiddleColumns.length)];
  console.log("Start Coordinates", pickRow, pickColumn);
  gameGrid[pickRow][pickColumn].assignedRoom = "start";
  currentRowOnGameGrid = pickRow;
  currentColumnOnGameGrid = pickColumn;
}

function assignFinishRoom() {
  let pickRow =
    currentRowOnGameGrid >= rows / 2
      ? Math.floor(Math.random() * (rows / 2))
      : Math.floor(Math.random() * (rows / 2) + rows / 2);
  let pickColumn =
    currentColumnOnGameGrid >= columns / 2
      ? Math.floor(Math.random() * (columns / 2))
      : Math.floor(Math.random() * (columns / 2) + columns / 2);
  console.log("Finish coordinates", pickRow, pickColumn);
  gameGrid[pickRow][pickColumn].assignedRoom = "finish";
}

function assignDeadEndRooms() {
  let chosenRow = 0;
  let chosenColumn = 0;

  function reRoll() {
    chosenRow = Math.floor(Math.random() * rows);
    chosenColumn = Math.floor(Math.random() * columns);
  }
  while (rooms.deadEnd.count >= 0) {
    if (!gameGrid[chosenRow][chosenColumn].assignedRoom) {
      gameGrid[chosenRow][chosenColumn].assignedRoom = "deadEnd";
      rooms.deadEnd.count--;
      reRoll();
    } else {
      console.log("cannot find match");
      reRoll();
    }
  }
}

function assignRemainingRooms() {
  const tasks = ["hotshot", "balance", "domino", "memory"];

  let randomValue = 0;

  function reRollRoomAssignment() {
    randomValue = Math.floor(Math.random() * tasks.length);
    //console.log("Random Value", randomValue);
    let selectedTask = tasks[randomValue];
    //console.log(selectedTask);
    //console.log(rooms[selectedTask].count);
    if (rooms[selectedTask].count > 0) {
      rooms[selectedTask].count--;
      return tasks[randomValue];
    } else {
      return reRollRoomAssignment();
    }
  }

  function pickTaskToAssignRoom(room) {
    let chosenTask = reRollRoomAssignment();
    console.log(chosenTask);
    room.assignedRoom = chosenTask;
  }

  gameGrid.forEach((row) => {
    for (const room of row) {
      if (!room.assignedRoom) {
        pickTaskToAssignRoom(room);
      }
    }
  });
}

function assignTeamToRooms() {
  const teamsPool = Object.keys(teams);
  const roomsToAssignTeamsTo = ["hotshot", "balance", "domino", "memory"];

  function reRollTeamAssignment() {
    randomValue = Math.floor(Math.random() * teamsPool.length);
    let selectedTeam = teamsPool[randomValue];
    if (teams[selectedTeam].spaces > 0) {
      teams[selectedTeam].count--;
      return teams[selectedTeam].id;
    } else {
      return reRollTeamAssignment();
    }
  }

  function pickTeamToAssignToRoom(room) {
    let chosenTeam = reRollTeamAssignment();
    room.assignedTeam = chosenTeam;
  }

  gameGrid.forEach((row) => {
    for (const room of row) {
      if (roomsToAssignTeamsTo.includes(room.assignedRoom)) {
        pickTeamToAssignToRoom(room);
      }
    }
  });
}

//buildMap(); //TESTING;

function startNewGame() {
  buildMap();
  resetTimer();
  updateTime();
  introductionScreen.classList.add("hidden");
  rulesScreen.classList.remove("hidden");
}

newGameBtn.addEventListener("click", () => startNewGame());
beginButton.addEventListener("click", () => {
  rulesScreen.classList.add("hidden");
  selectDirectionScreen.classList.remove("hidden");
  disableOrEnableDirectionButtons();
  startTimer();
});

function enterRoom(selectedRoom) {
  let { assignedRoom, assignedTeam, hasRoomBeenEntered } = selectedRoom;
  let { color, roomName, rules } = rooms[assignedRoom];
  rooms[selectedRoom].hasRoomBeenEntered = true;
  console.log(selectedRoom);
  let textColor =
    (color === "yellow") | (color === "red") ? "color:black" : "color:white";
  roomScreen.style.backgroundColor = color;
  roomScreen.innerHTML = `
    <h1 style=${textColor}>${roomName}</h1>
    <p style=${textColor}>${rules}</p>
    <h1 style=${textColor}>${teams[assignedTeam].teamName}</h1>
    <button id="completed">Task Complete</button>`;
  selectDirectionScreen.classList.add("hidden");
  roomScreen.classList.remove("hidden");
  addCompletedButtonEventListener();
}

function enterDeadEndRoom(selectedRoom) {
  let { color, roomName, rules } = rooms[selectedRoom.assignedRoom];
  selectedRoom.hasRoomBeenEntered = true;
  roomScreen.style.backgroundColor = color;
  roomScreen.innerHTML = `
    <h1>${roomName}</h1>
    <p>${rules}</p>
  <button id="reverse">Continue</button>
    }`;
  selectDirectionScreen.classList.add("hidden");
  roomScreen.classList.remove("hidden");
  addReverseButtonEventListener();
}

function gameOver(losingCondition) {
  let { color, roomName, rules } = rooms[losingCondition];
  roomScreen.style.backgroundColor = color;
  roomScreen.innerHTML = `
    <h1>${roomName}</h1>
    <p>${rules}</p>
  <button id="retry">Retry</button>
    }`;
  selectDirectionScreen.classList.add("hidden");
  roomScreen.classList.remove("hidden");
  addRetryButtonEventListener();
}

function disableOrEnableDirectionButtons() {
  upButton.disabled = currentRowOnGameGrid === 0 ? true : false;
  downButton.disabled = currentRowOnGameGrid === rows - 1 ? true : false;
  leftButton.disabled = currentColumnOnGameGrid === 0 ? true : false;
  rightButton.disabled = currentColumnOnGameGrid === columns - 1 ? true : false;
}

function goToRoomSelection() {
  disableOrEnableDirectionButtons();
  roomScreen.classList.add("hidden");
  selectDirectionScreen.classList.remove("hidden");
}

//enterRoom(rooms.memory, teams.oneForAll.teamName); //TESTING

//Button Event Listeners
function addCompletedButtonEventListener() {
  const completedButton = document.getElementById("completed");
  completedButton.addEventListener("click", () => {
    goToRoomSelection();
  });
}

function addRetryButtonEventListener() {
  const retryButton = document.getElementById("retry");
  retryButton.addEventListener("click", () => {
    startNewGame();
  });
}

function addReverseButtonEventListener() {
  const reverseButton = document.getElementById(reverse);
  reverseButton.addEventListener("click", () => {
    enterRoom(gameGrid[previousRowOnGameGrid][previousColumnOnGameGrid]);
  });
}

upButton.addEventListener("click", () => {
  setCoordinatesToEnterRoom("up");
});

downButton.addEventListener("click", () => {
  setCoordinatesToEnterRoom("down");
});

leftButton.addEventListener("click", () => {
  setCoordinatesToEnterRoom("left");
});

rightButton.addEventListener("click", () => {
  setCoordinatesToEnterRoom("right");
});

function setCoordinatesToEnterRoom(direction) {
  if (direction === "up") {
    previousRowOnGameGrid = currentRowOnGameGrid;
    currentRowOnGameGrid--;
  } else if (direction === "down") {
    previousRowOnGameGrid = currentRowOnGameGrid;
    currentRowOnGameGrid++;
  } else if (direction === "left") {
    previousColumnOnGameGrid = currentColumnOnGameGrid;
    currentColumnOnGameGrid--;
  } else if (direction === "right") {
    previousColumnOnGameGrid = currentColumnOnGameGrid;
    currentColumnOnGameGrid++;
  }

  getAssignedRoom(gameGrid[currentRowOnGameGrid][currentColumnOnGameGrid]);
}

function getAssignedRoom() {
  let assignedRoom = gameGrid[currentColumnOnGameGrid][currentColumnOnGameGrid];
  if (assignedRoom.assignedRoom === "deadEnd") {
    if (assignedRoom.hasRoomBeenEntered === true) {
      gameOver("reEnteredDeadEnd");
    } else {
      enterDeadEndRoom(assignedRoom);
    }
  } else if (assignedRoom === "finish") {
    victory();
  } else {
    enterRoom(assignedRoom);
  }
}

function victory() {}
