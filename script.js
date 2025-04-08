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
  "game-over": {
    color: "black",
    room: "GAME OVER!",
    rules:
      "Oh no! You entered this dead end room again! I am afraid that this is the end of the road for you!",
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
