const rooms = {
  hotshot: {
    color: "red",
    roomName: "Hotshot Room",
    rules:
      "Chosen players need to knock down a row of bottles from across the room.",
  },
  balance: {
    color: "yellow",
    roomName: "Balance Room",
    rules:
      "Chosen players must balance 3 balls on a plate while walking in a straight line.",
  },
  smoothie: {
    color: "blue",
    roomName: "Smoothie Room",
    rules:
      "Chosen players will drink an unconventionally flavored smoothie, what could it be…?",
  },
  memory: {
    color: "green",
    roomName: "Energy Room",
    rules: "Players will match Pokemon Energy Cards, Memory style",
  },
  "dead-end": {
    color: "black",
    room: "DEAD END!",
    rules:
      "Oh no! You reached a dead end, go back to where you came. <br> CAUTION! If you enter this exact room again, the game will be over!",
  },
  "reentered-dead-end": {
    color: "black",
    room: "GAME OVER!",
    rules:
      "Oh no! You entered this dead end room again! I am afraid that this is the end of the road for you!",
  },
  "out-of-time": {
    color: "black",
    room: "GAME OVER!",
    rules:
      "Oh no! You ran out of time! I am afraid that this is the end of the road for you!",
  },
  victory: {
    color: "White",
    room: "CONGRATULATIONS",
    rules: "You escaped with a time of...",
  },
};

//Buttons
const newGameBtn = document.getElementById("start-new-game");
const upButton = document.getElementById("up");
const downButton = document.getElementById("down");
const leftButton = document.getElementById("left");
const rightButton = document.getElementById("right");
const completedButton = document.getElementById("completed");

//Room Screens-Selectors
const introductionScreen = document.getElementById("intro");
const selectDirectionScreen = document.getElementById("direction");
const roomScreen = document.getElementById("room");

//Timer Functions
let timer = 1800000;
let timeElapsed = 0;
let timerRunning = false;

function countdown(timer) {
  return timer - 1000;
}

function stopWatch(timeElapsed) {
  return timeElapsed + 1000;
}

function startTimer() {
  timerRunning = true;
  while (timerRunning) {
    setTimeout(() => {
      countdown(timer);
      stopWatch(timeElapsed);
      if (timer === 0) {
        stopTimer();
        enterRoom(rooms["out-of-time"], "Try Again");
      }
      updateTime();
    }, 1000);
  }
}

function stopTimer() {
  timerRunning = false;
}

function resetTimer() {
  timer = 180000;
}

function updateTime() {
  let seconds = Math.floor(timer / 1000);
  let minutes = Math.floor(seconds / 60);
  timer.innerHTML = `
    <h1>${minutes}:${seconds}</h1>`;
}

startTimer();

function enterRoom(room, group) {
  console.log("Entering room", room);
  let { color, roomName, rules } = room;
  let textColor = color === "yellow" ? "color:black" : "color:white";
  roomScreen.style.backgroundColor = color;
  roomScreen.innerHTML = `
    <h1 style=${textColor}>${roomName}</h1>
    <p style=${textColor}>${rules}</p>
    <h1 style=${textColor}>${group}</h1>
    <button id="completed">Task Complete</button>
    `;
}

enterRoom(rooms.smoothie, "Smirthies");
