import * as PIXI from "pixi.js";
import { Graphics } from "pixi.js/lib/core";

let keys = {};
let ammo = 12;
let damage = 10;
let health = 100;
let enemyHealth = 20;
let points = 0;
let jump = false;
let shoot = false;
let dead = false;

const yVelocity = 5;

const app = new PIXI.Application(window.innerWidth, window.innerHeight, {
  backgroundColor: 0x000000,
});
app.renderer.view.style.position = "absolute";
document.body.appendChild(app.view);

const style = new PIXI.TextStyle({
  fontSize: 32,
  fill: "blue",
});
const hint = new PIXI.Text(
  "Use A or D to get left or right, use Spacebar to shoot and press R to reload",
  style
);
app.stage.addChild(hint);

const ammoCount = new PIXI.Text(`Ammo: ${ammo}`, style);
ammoCount.y = 32;
app.stage.addChild(ammoCount);

const healthText = new PIXI.Text(`Health: ${health}`, style);
app.stage.addChild(healthText);

const pointsText = new PIXI.Text(`Points: ${points}`, style);
pointsText.y = 64;
app.stage.addChild(pointsText);

const enemyHealthBar = new PIXI.Text(`${enemyHealth}`, style);
app.stage.addChild(enemyHealthBar);

const laser = new Graphics();
laser.beginFill(0xaa33bb).drawRect(10, 10, 20, 10).endFill();
laser.x = 140;
laser.y = app.view.height - 100;

app.ticker.add((delta) => loop(delta));

/* Player sprite */
const player = new PIXI.Sprite.from("assets/adventurer-run-00.png");
app.stage.addChild(player);
player.x = 1;
player.y = app.view.height - 200;
player.width = 200;
player.height = 200;

const enemy = new Graphics();
enemy.beginFill(0xaa33bb).drawRect(20, 20, 50, 200).endFill();
enemy.x = app.view.width - 100;
enemy.y = app.view.height - 200;
app.stage.addChild(enemy);

function loop() {
  healthText.y = player.y - 32;
  healthText.x = player.x + 32;
  enemyHealthBar.y = enemy.y - 32;
  enemyHealthBar.x = enemy.x + 20;

  /* Gameover */
  if (dead) app.ticker.stop();
  if (health === 0) {
    dead = truel;
  }

  /* Ammo Count Update */
  if (ammo === 0) {
    shoot = false;
    ammoCount.text = "Ammo: EMPTY!";
  } else ammoCount.text = `Ammo: ${ammo}`;
  if (keys["82"]) {
    ammo = 12;
    ammoCount.text = `Ammo: ...`;
  }

  /* Laser */
  if (shoot && ammo > 0) {
    app.stage.addChild(laser);
    laser.x += 20;
    if (laser.x >= app.view.width - 40) {
      shoot = false;
      laser.x = player.x + 140;
      app.stage.removeChild(laser);
    }
    if (collision(laser, enemy)) {
      enemyHealth -= 5;
      enemyHealthBar.text = `${enemyHealth}`;
      shoot = false;
      laser.x = player.x + 140;
      app.stage.removeChild(laser);
      if (enemyHealth === 0) {
        points += 20;
        pointsText.text = `Points: ${points}`;
        enemy.x = app.view.width - 100;
        enemyHealth = 20;
        enemyHealthBar.text = `${enemyHealth}`;
      }
    }
  }

  if (collision(player, enemy)) {
    enemy.x = app.view.width - 100;
    health -= 20;
    healthText.text = `Health: ${health}`;
  } else enemy.x > 0 ? (enemy.x -= 3) : (enemy.x = app.view.width - 100);

  /* Jumping */
  if (jump) {
    if (player.y != app.view.height - 900) player.y -= yVelocity;
    if (player.y === app.view.height - 900) jump = false;
  }
  if (!jump && player.y != app.view.height - 200) {
    player.y += yVelocity;
  }

  /* Movement */
  if (keys["65"]) {
    if (player.x > 0) {
      player.x -= 10;
      if (!shoot) laser.x -= 10;
    }
  }
  if (keys["68"]) {
    if (player.x < app.view.width - 200) {
      player.x += 10;
      if (!shoot) laser.x += 10;
    }
  }
}

function collision(a, b) {
  /* Collision detection func */
  let aBox = a.getBounds();
  let bBox = b.getBounds();
  return (
    aBox.x + aBox.width > bBox.x &&
    aBox.x < bBox.x + bBox.width &&
    aBox.y + aBox.height > bBox.y &&
    aBox.y < bBox.y + bBox.height
  );
}

function keysDown(e) {
  keys[e.keyCode] = true;
  if (e.keyCode === 32) {
    jump = true;
  }
}

function keysUp(e) {
  keys[e.keyCode] = false;
}

app.stage.interactive = true;
window.addEventListener("keydown", keysDown);
window.addEventListener("keyup", keysUp);
window.addEventListener("click", () => {
  if (ammo > 0) {
    shoot = true;
    ammo -= 1;
  }
});
