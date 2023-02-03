const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 400;

document.body.append(canvas);

ctx.fillRect(0, 0, canvas.width, canvas.height);

let images = [];
function create_images() {
  for (let i = 0; i < 15; i++) {
    images.push(new Image());
    if (i <= 4) {
      images[i].src = `/images_minigame/hunter/hunter_${i}.jpg`;
    }
    if (i == 4) images[i].src = "/images_minigame/mouse.jpg";
    if (i == 5) images[i].src = "/images_minigame/snake.jpg";
    if (i == 6) images[i].src = "/images_minigame/fox.jpg";
    if (i == 7) images[i].src = "/images_minigame/wolf.jpg";
    if (i == 8) images[i].src = "/images_minigame/bear.jpg";
    if (i == 9) images[i].src = "/images_minigame/background/background_0.jpg";
    if (i == 10) images[i].src = "/images_minigame/background/background_1.jpg";
    if (i == 11) images[i].src = "/images_minigame/background/background_2.jpg";
    if (i == 12) images[i].src = "/images_minigame/background/background_3.jpg";
    if (i == 13) images[i].src = "/images_minigame/background/background_4.jpg";
    if (i == 14) images[i].src = "/images_minigame/merchant.jpg";
  }
}
create_images();
var audio = document.getElementById("0");
window.addEventListener("DOMContentLoaded", (event) => {
  audio.volume = 1;
  audio.play();
});

const mouse = {
  animation: false,
  posX: null,
  posY: null,
  init: () => {
    addEventListener("click", (e) => {
      mouse.posX = e.clientX;
      mouse.posY = e.clientY;

      if (mouse.animation) return;
      if (game_state.chest) choosing_menu();
      if (player.choosing) return player_choosing();
      checkClick();
    });
  },
};
mouse.init();

const game_state = {
  battle: false,
  chest: false,
  merchant: false,
};

const player = {
  choosing: false,
  stats: {
    hp: 10,
    attack: 1,
  },
  init: (color) => {
    ctx.fillStyle = color || "white";
    ctx.fillRect(50, 50, 50, 50);
  },
};

const enemy = {
  init: (color) => {
    ctx.fillStyle = color || "red";
    ctx.fillRect(300, 300, 50, 50);
  },
};

const chest = {
  reward: () => {},
  init: () => {
    ctx.fillStyle = "gold";
    ctx.fillRect(300, 50, 50, 50);
  },
};

const merchant = {
  available: false,
  effect: () => {
    player.stats.hp += 16;
    info_text(player);
    merchant.available = false;
  },
  init: (color) => {
    ctx.fillStyle = color || "blue";
    ctx.fillRect(50, 300, 50, 50);
  },
};

const game_info = ["mouse", "snake", "fox", "wolf", "bear"];
const game_enemies_stats = [
  { hp: 3, attack: 1 },
  { hp: 5, attack: 2 },
  { hp: 7, attack: 3 },
  { hp: 10, attack: 3 },
  { hp: 20, attack: 5 },
];
function checkClick() {
  if (
    mouse.posX > 25 &&
    mouse.posX < 125 &&
    mouse.posY > 25 &&
    mouse.posY < 125
  )
    return (action = "player");
  if (
    mouse.posX > 275 &&
    mouse.posX < 375 &&
    mouse.posY > 25 &&
    mouse.posY < 125
  ) {
    if (!player.choosing) return;
    else {
      action = "chest";
      chest.reward();
    }
  }
  if (
    mouse.posX > 275 &&
    mouse.posX < 375 &&
    mouse.posY > 275 &&
    mouse.posY < 375
  ) {
    action = "enemy";
    attack();
  }
  if (
    mouse.posX > 25 &&
    mouse.posX < 125 &&
    mouse.posY > 275 &&
    mouse.posY < 375
  ) {
    if (merchant.available) {
      action = "merchant";
      merchant.effect();
    }
  }
}

let action;
const board = function (game_state) {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  player.init();

  if (game_state.battle) enemy.init("red");
  if (game_state.chest) chest.init("gold");
  if (game_state.merchant) merchant.init("blue");
};

function player_animation() {
  // animation
  for (let i = 1; i < 5; i++) {
    setTimeout(() => {
      player.init("green");
    }, i * 500);

    setTimeout(() => {
      player.init();
    }, i * 600);
  }
}
function enemy_animation() {
  // animation
  for (let i = 1; i < 5; i++) {
    setTimeout(() => {
      enemy.init("green");
    }, i * 500);

    setTimeout(() => {
      enemy.init();
    }, i * 600);
  }
}
function attack() {
  audio.play();
  // block input
  mouse.animation = true;

  // damage calc
  enemy.stats.hp -= player.stats.attack;

  // enemy hp check
  if (enemy.stats.hp <= 0) {
    mouse.animation = false;
    battle_over();
    return alert(`${game_info[stage]} hid away !`);
  }
  // animation
  enemy_animation();

  //damage text
  /* text(player.stats.attack); */

  console.log(enemy.stats);
  setTimeout(ai_turn, 3200);
}
function ai_turn() {
  info_text(enemy);
  // damage calc
  player.stats.hp -= enemy.stats.attack;

  // animation
  player_animation();

  //damage text
  /* text(enemy.stats.attack); */

  // player hp check
  if (player.stats.hp <= 0) {
    info_text(player);
    return alert(`GG ! ${game_info[stage]} scared you away !`);
  }

  console.log(player.stats);

  setTimeout(() => {
    mouse.animation = false;
    info_text(player);
  }, 3200);
}

function eventT(event) {
  Object.keys(game_state).forEach((key) => {
    if (key == event) game_state[key] = true;
    else game_state[key] = false;
  });
}

function battle_over() {
  eventT("chest");
  board(game_state);
}

function fitness_text(any) {
  ctx.font = "42px Ariel";
  ctx.strokeStyle = "white";
  ctx.strokeText(any, 140, 40);
  ctx.stroke();
}

let fitness = 0;

function merchant_text() {
  ctx.strokeStyle = "Yellow";
  ctx.strokeText("merchant", 20, 380);
  ctx.stroke();
}

function text(text) {
  ctx.font = "42px Ariel";
  ctx.strokeStyle = "black";
  ctx.strokeText(text, 140, 205);
  ctx.stroke();
}

function clear_middle() {
  ctx.fillStyle = "black";
  ctx.fillRect(130, 170, 150, 50);
}
function footer_text(any) {
  ctx.font = "42px Ariel";
  ctx.strokeStyle = "white";
  ctx.strokeText(any, 280, 385);
  ctx.stroke();
}

function info_text(who) {
  if (who === enemy) {
    ctx.fillStyle = "black";
    ctx.fillRect(300, 200, 50, 50);
    ctx.strokeStyle = "white";
    ctx.strokeText(`${who.stats.hp}`, 310, 240);
    ctx.stroke();
  } else {
    ctx.fillStyle = "black";
    ctx.fillRect(50, 0, 50, 50);
    ctx.strokeStyle = "white";
    ctx.strokeText(`${who.stats.hp}`, 50, 40);
    ctx.stroke();
  }
}
let stage = -1;
const game_start = function () {
  if (stage === 5) return alert("Wow, that's amazing !");
  if (stage === 4) {
    alert("WP ! You Won !");
    const a = window.prompt("continue?", "yes");
    if (a == "yes") {
      merchant.init();
      merchant.available = true;
    } else alert("done !");
  }
  enemy.stats = game_enemies_stats[stage];
  eventT("battle");
  board(game_state);
  draw_all_images();
  footer_text(game_info[stage]);
  info_text(enemy);
  info_text(player);
  text(`stage ${stage}`);

  audio = document.getElementById(stage);

  if (stage === 4) {
    merchant.init();
    merchant_text();
  }

  console.log(enemy.stats);
  /* setTimeout(clear_middle, 2000); */
};
/* game_start(); */
function draw_all_images() {
  //background
  if (stage == 0) ctx.drawImage(images[9], 0, 0, 400, 400);
  if (stage == 1) ctx.drawImage(images[10], 0, 0, 400, 400);
  if (stage == 2) ctx.drawImage(images[11], 0, 0, 400, 400);
  if (stage == 3) ctx.drawImage(images[12], 0, 0, 400, 400);
  if (stage == 4) ctx.drawImage(images[13], 0, 0, 400, 400);

  // characters
  if (stage == 0) ctx.drawImage(images[4], 250, 250, 120, 100);
  if (stage == 1) ctx.drawImage(images[5], 250, 250, 120, 100);
  if (stage == 2) ctx.drawImage(images[6], 250, 250, 120, 100);
  if (stage == 3) ctx.drawImage(images[7], 250, 250, 120, 100);
  if (stage == 4) ctx.drawImage(images[8], 250, 250, 120, 100);

  // player
  ctx.drawImage(images[3], 50, 50, 120, 100);

  // merchant
  if (stage == 4) ctx.drawImage(images[14], 50, 250, 120, 100);
}

function choosing_menu() {
  ctx.fillStyle = "yellow";
  ctx.fillRect(100, 150, 100, 50);
  ctx.strokeStyle = "white";
  ctx.font = "42px Ariel";
  ctx.strokeText("HP", 120, 140);
  ctx.stroke();

  ctx.fillStyle = "lime";
  ctx.fillRect(250, 150, 100, 50);
  ctx.strokeStyle = "white";
  ctx.font = "42px Ariel";
  ctx.strokeText("Attack", 250, 140);
  ctx.stroke();

  player.choosing = true;
}
choosing_menu();
function player_choosing() {
  if (
    mouse.posX > 100 &&
    mouse.posX < 200 &&
    mouse.posY > 150 &&
    mouse.posY < 200
  ) {
    player.stats.hp++;
    player.choosing = false;

    stage++;
    game_start();
  }

  if (
    mouse.posX > 250 &&
    mouse.posX < 350 &&
    mouse.posY > 150 &&
    mouse.posY < 200
  ) {
    player.stats.attack++;
    player.choosing = false;

    stage++;
    game_start();
  }
}

player_choosing();
