let roomsTraveled = 0;
let currentRowOnGameGrid = 0;
let currentColumnOnGameGrid = 0;
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
    this.x = j;
    this.y = i;
  }
}

const rooms = {
  hotshot: {
    color: "red",
    roomName: "Hotshot Room",
    rules:
      "Chosen players need to knock down a row of bottles from across the room.",
    count: Math.ceil(spots / 4),
  },
  balance: {
    color: "yellow",
    roomName: "Balance Room",
    rules:
      "Chosen players must balance 3 balls on a plate while walking in a straight line.",
    count: Math.ceil(spots / 4),
  },
  smoothie: {
    color: "blue",
    roomName: "Smoothie Room",
    rules:
      "Chosen players will drink an unconventionally flavored smoothie, what could it be…?",
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
    count: Math.ceil(spots / 8),
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
    rules:
      "Welcome to the Escape Room <br> Choose the direction that you want to go <br> Complete the task indicated by the assigned group <br> Try to find the exit room before the timer runs out.",
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

//Room Screens-Selectors
const introductionScreen = document.getElementById("intro");
const selectDirectionScreen = document.getElementById("direction");
const roomScreen = document.getElementById("room");

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
      enterRoom(rooms.outOfTime, "Try Again");
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
  let seconds = totalSeconds % 60;
  let formattedMinutes = String(minutes).padStart(2, "0");
  let formattedSeconds = String(seconds).padStart(2, "0");
  let textColor = minutes < 5 ? "color:red" : "color:white";
  timerText.innerHTML = `
    <h1 style=${textColor}>${formattedMinutes}:${formattedSeconds}</h1>`;
}

startTimer(); //TESTING

function buildMap() {
  buildGrid(rows, columns);
  assignStartRoom();
  assignFinishRoom();
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
  let pickRow = Math.floor(Math.random() * rows);
  let pickColumn = Math.floor(Math.random() * columns);
  console.log("Start Coordinates", pickRow, pickColumn);
  gameGrid[pickRow][pickColumn].assignedRoom = "START";
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
  gameGrid[pickRow][pickColumn].assignedRoom = "FINISH";
}

function assignRemainingRooms() {
  const tasks = ["hotshot", "balance", "smoothie", "memory", "deadEnd"];

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
  const roomsToAssignTeamsTo = ["hotshot", "balance", "smoothie", "memory"];

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

buildMap(); //TESTING;

function startNewGame() {
  resetTimer();
  startTimer();
  introductionScreen.classList.add("hidden");
  goToRoomSelection();
}

function enterRoom(room, group) {
  console.log("Entering room", room);
  let { color, roomName, rules } = room;
  let textColor = color === "yellow" ? "color:black" : "color:white";
  roomScreen.style.backgroundColor = color;
  roomScreen.innerHTML = `
    <h1 style=${textColor}>${roomName}</h1>
    <p style=${textColor}>${rules}</p>
    <h1 style=${textColor}>${group}</h1>
    ${
      roomName !== "GAME OVER!"
        ? `<button id="completed">Task Complete</button>`
        : `<button id="retry">New Game</button>`
    }`;
  selectDirectionScreen.classList.add("hidden");
  roomScreen.classList.remove("hidden");
  roomName !== "GAME OVER!"
    ? addCompletedButtonEventListener()
    : addRetryButtonEventListener();
}

function goToRoomSelection() {
  roomScreen.classList.add("hidden");
  selectDirectionScreen.classList.remove("hidden");
}

enterRoom(rooms.memory, teams.oneForAll.teamName); //TESTING

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

upButton.addEventListener("click", () => {
  enterRoom(rooms.smoothie, teams.smirthies.teamName); //TESTING
});
