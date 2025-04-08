const rooms = {
  hotshot: {
    color: "red",
    room: "Hotshot Room",
    rules:
      "Chosen players need to knock down a row of bottles from across the room.",
  },
  balance: {
    color: "yellow",
    room: "Balance Room",
    rules:
      "Chosen players must balance 3 balls on a plate while walking in a straight line.",
  },
  smoothie: {
    color: "blue",
    room: "Smoothie Room",
    rules:
      "Chosen players will drink an unconventionally flavored smoothie, what could it be…?",
  },
  memory: {
    color: "green",
    room: "Energy Room",
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
};

const newGameBtn = document.getElementById("start-new-game");
const upButton = document.getElementById("up");
const downButton = document.getElementById("down");
