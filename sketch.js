let gameState = "START";
let level = 1;
let score = 0;
let shotsLeft = 3;
let slingshotBase;
let orb;
let isDragging = false;
let isFired = false;
let orbRadius = 12;
let maxPullDist = 100;
let ghost;
let ghostRadius = 28;
let ghostAngle = 0;
let stars = [];
let fireflies = [];
let pumpkins = [];
let osc, ambientPlaying = false;



function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent(document.body);
   let fontLink = document.createElement('link');
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Creepster&family=Poppins:wght@500;700&display=swap';
  fontLink.rel = 'stylesheet';
  document.head.appendChild(fontLink);
slingshotBase = createVector(150, 360);
 for (let i = 0; i < 80; i++) {stars.push({
      x: random(width),
      y: random(height * 0.6),
      size: random(1, 3.5),
      alpha: random(100, 255),
      speed: random(0.02, 0.06)});}
for (let i = 0; i < 30; i++) {
    fireflies.push({
      x: random(width),
      y: random(height * 0.4, height * 0.9),
      size: random(2, 5),
      speedX: random(-0.6, 0.6),
      speedY: random(-0.4, 0.4),
      alpha: random(120, 255)}); }
 pumpkins.push(
    {x: 280, y: 395, size: 28}, 
    {x: 320, y: 402, size: 22}, 
    {x: 620, y: 398, size: 34}, 
    {x: 670, y: 405, size: 25} );

  resetOrb();
  spawnGhost();}

function startMusic() {
  if (!ambientPlaying) {
    try {
      userStartAudio();
      osc = new p5.Oscillator('triangle');
      osc.freq(110);
      osc.amp(0.03);
      osc.start();
      ambientPlaying = true;
    } catch(e) {}}}

function draw() {
  drawSpookyBackground();
if (gameState === "START") {
    drawStartScreen();
 } else if (gameState === "PLAYING") {
    updateGhost();
    updateOrb();
    checkCollision();
  drawSlingshotBandBack();
    drawGhost();
    drawOrb();
    drawSlingshotBandFront();
    drawSlingshotFrame();
    drawHUD();
  } else if (gameState === "LEVEL_CLEAR") {
    drawGhost();
    drawSlingshotFrame();
    drawLevelClearScreen();
  } else if (gameState === "GAME_OVER") {
    drawGameOverScreen();}}

function drawSpookyBackground() {
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(15, 4, 30), color(45, 12, 72), inter);
    stroke(c);
    line(0, y, width, y); }

  noStroke();
  for (let s of stars) {
    s.alpha += sin(frameCount * s.speed) * 4;
    fill(255, 255, 240, constrain(s.alpha, 70, 255));
    ellipse(s.x, s.y, s.size);}
 let moonX = 350;
  let moonY = 100;
  fill(255, 240, 255, 12);
  ellipse(moonX, moonY, 190);
  fill(255, 240, 255, 25);
  ellipse(moonX, moonY, 150);
  fill(255, 250, 240);
 ellipse(moonX, moonY, 110);

  fill(230, 215, 230, 130);
  ellipse(moonX - 18, moonY - 12, 22);
  ellipse(moonX + 20, moonY + 14, 16);
  ellipse(moonX - 6, moonY + 24, 12);
//castl
  drawCastle(530, 245);
fill(18, 5, 32);
  noStroke();
  rect(0, 385, width, 115);
 fill(55, 22, 82, 200);
  beginShape();
  vertex(380, 500);
  vertex(450, 435);
  vertex(535, 385);
  vertex(555, 385);
  vertex(470, 455);
  vertex(410, 500);
  endShape(CLOSE);
   for (let p of pumpkins) {
    drawPumpkin(p.x, p.y, p.size);}

  drawTree(35, 415, 1.2);
  drawTree(width - 45, 425, -1.1);
    for (let f of fireflies) {
    f.x += f.speedX;
    f.y += f.speedY;
    if (f.x < 0) f.x = width;
    if (f.x > width) f.x = 0;
    if (f.y < height * 0.3) f.y = height * 0.8;
    if (f.y > height * 0.9) f.y = height * 0.4;

    fill(255, 200, 80, random(100, 230));
    ellipse(f.x, f.y, f.size);}}

function drawPumpkin(x, y, s) {
  push();
  translate(x, y);
  fill(220, 100, 10);
  noStroke();
  ellipse(0, 0, s, s * 0.75);
  ellipse(0, 0, s * 0.8, s * 0.78);
  fill(35, 120, 30);
  rect(-2, -s * 0.42, 4, 8, 2);
  fill(255, 240, 50);
  triangle(-s*0.15, -s*0.05, -s*0.05, -s*0.15, 0, -s*0.05);
  triangle(s*0.05, -s*0.05, s*0.15, -s*0.15, 0, -s*0.05);
  beginShape();
  vertex(-s*0.2, s*0.1);
  vertex(s*0.2, s*0.1);
  vertex(s*0.12, s*0.22);
  vertex(-s*0.12, s*0.22);
  endShape(CLOSE);
  pop();}

function drawCastle(x, y) {
  push();
  translate(x, y);
  fill(10, 2, 18);
  noStroke();
  rect(0, 45, 100, 80);
  rect(-20, 65, 40, 60);
  rect(10, -5, 25, 60); 
  triangle(-2, -5, 22, -45, 47, -5);
  rect(65, 15, 22, 50); 
  triangle(60, 15, 76, -20, 92, 15);
  rect(-25, 35, 18, 40); 
  triangle(-30, 35, -16, 10, -2, 35);
  fill(255, 200, 70, 230);
  rect(18, 8, 8, 14, 3);
  rect(71, 28, 6, 10, 2);
  rect(-20, 45, 6, 10, 2);
  rect(35, 70, 12, 18, 5);
  pop();}

function drawTree(x, y, scaleX) {
  push();
  translate(x, y);
  scale(scaleX, 1);
  stroke(8, 2, 14);
  strokeWeight(14);
  line(0, 0, 0, -120);
  strokeWeight(8);
  line(0, -60, -35, -95);
  line(-35, -95, -50, -90);
  line(0, -85, 30, -115);
  line(30, -115, 45, -110);
  strokeWeight(4);
  line(-35, -95, -30, -125);
  line(30, -115, 20, -140);
  pop();}

function spawnGhost() {
  let gx = random(480, width - 80);
  let gy = random(120, height - 160);
  ghost = {
    basePos: createVector(gx, gy),
    pos: createVector(gx, gy),
    speedX: random(2.0, 3.8) * (random() > 0.5 ? 1 : -1),
    speedY: random(1.8, 3.2) * (random() > 0.5 ? 1 : -1)};}

function updateGhost() {
  ghostAngle += 0.06;
  if (level <= 4) {
    ghost.pos.y = ghost.basePos.y + sin(ghostAngle) * 10;
  } else {
    let speedMult = 1 + (level - 4) * 0.14;
    ghost.pos.x += ghost.speedX * speedMult;
    ghost.pos.y += ghost.speedY * speedMult + sin(ghostAngle) * 3;
     if (ghost.pos.x - ghostRadius < 350 || ghost.pos.x + ghostRadius > width - 20) {
      ghost.speedX *= -1;}
    if (ghost.pos.y - ghostRadius < 50 || ghost.pos.y + ghostRadius > height - 120) {
      ghost.speedY *= -1;
    }}}

function drawGhost() {
  push();
  translate(ghost.pos.x, ghost.pos.y + sin(frameCount * 0.1) * 4);
   noStroke();
  fill(140, 230, 255, 30);
  ellipse(0, 0, ghostRadius * 3.2);
  fill(180, 245, 255, 60);
  ellipse(0, 0, ghostRadius * 2.4);

  fill(245, 250, 255);
  ellipse(0, 0, ghostRadius * 2, ghostRadius * 2);
  fill(15, 10, 30);
  ellipse(-ghostRadius * 0.3, -3, 8, 12);
  ellipse(ghostRadius * 0.3, -3, 8, 12);
  fill(255, 255, 255, 200);
  ellipse(-ghostRadius * 0.3, -5, 2.5, 3.5);
  ellipse(ghostRadius * 0.3, -5, 2.5, 3.5);
  ellipse(0, 7, 8, 11);
  pop();}

function resetOrb() {
  orb = {
    pos: slingshotBase.copy(),
    vel: createVector(0, 0)
  };
  isFired = false;
  isDragging = false;
}

function updateOrb() {
  if (isFired) {
    orb.pos.add(orb.vel);
    orb.vel.y += 0.22; 

    if (orb.pos.x > width + 50 || orb.pos.x < -50 || orb.pos.y > height + 50) {
      shotsLeft--;
      if (shotsLeft > 0) {
        resetOrb();
      } else {
        gameState = "GAME_OVER";
      } }}}

function drawOrb() {
  push();
  noStroke();
  if (isFired) {
    fill(255, 220, 80, 100);
    ellipse(orb.pos.x - orb.vel.x * 0.8, orb.pos.y - orb.vel.y * 0.8, orbRadius * 2);
  }
  fill(255, 240, 120);
  ellipse(orb.pos.x, orb.pos.y, orbRadius * 2);
  fill(255, 255, 240);
  ellipse(orb.pos.x - 3, orb.pos.y - 3, orbRadius * 0.7);
  pop();}

function drawSlingshotFrame() {
  stroke(70, 38, 18);
  strokeWeight(10);
  noFill();
  line(slingshotBase.x, slingshotBase.y + 70, slingshotBase.x, slingshotBase.y + 15);
  line(slingshotBase.x, slingshotBase.y + 15, slingshotBase.x - 20, slingshotBase.y - 25);
  line(slingshotBase.x, slingshotBase.y + 15, slingshotBase.x + 20, slingshotBase.y - 25);}

function drawSlingshotBandBack() {
  if (!isFired) {
    stroke(180, 45, 35);
    strokeWeight(5);
    line(slingshotBase.x - 20, slingshotBase.y - 25, orb.pos.x, orb.pos.y);}}

function drawSlingshotBandFront() {
  if (!isFired) {
    stroke(210, 60, 45);
    strokeWeight(5);
    line(slingshotBase.x + 20, slingshotBase.y - 25, orb.pos.x, orb.pos.y);}}

function mousePressed() {
  startMusic();
  if (gameState === "PLAYING" && !isFired) {
    let d = dist(mouseX, mouseY, orb.pos.x, orb.pos.y);
    if (d < orbRadius * 3.5) {
      isDragging = true;}}}

function mouseDragged() {
  if (isDragging) {
    let dragVector = createVector(mouseX, mouseY);
    let pull = p5.Vector.sub(dragVector, slingshotBase);
    if (pull.mag() > maxPullDist) {
      pull.setMag(maxPullDist);
    }
    orb.pos = p5.Vector.add(slingshotBase, pull);}}

function mouseReleased() {
  if (isDragging) {
    isDragging = false;
    isFired = true;
    let pull = p5.Vector.sub(slingshotBase, orb.pos);
    orb.vel = pull.mult(0.26);}}

function keyPressed() {
  startMusic();
  if (key === ' ' || key === 'Enter') {
    if (gameState === "START") {
      gameState = "PLAYING";
    } else if (gameState === "LEVEL_CLEAR") {
      nextLevel();
    } else if (gameState === "GAME_OVER") {
      restartGame();}}}
function checkCollision() {
  if (isFired) {
    let d = dist(orb.pos.x, orb.pos.y, ghost.pos.x, ghost.pos.y);
    if (d < orbRadius + ghostRadius) {
      score += 100 * level;
      gameState = "LEVEL_CLEAR";}}}

function nextLevel() {
  level++;
  shotsLeft = 3;
  resetOrb();
  spawnGhost();
  gameState = "PLAYING";}

function restartGame() {
  level = 1;
  score = 0;
  shotsLeft = 3;
  resetOrb();
  spawnGhost();
  gameState = "PLAYING";}

function drawHUD() {
  fill(255);
  textFont('Poppins');
  textSize(18);
  textAlign(LEFT, TOP);
  text(`LEVEL: ${level}`, 25, 20);
  text(`SCORE: ${score}`, 25, 50);
  text(`SHOTS LEFT: ${shotsLeft}`, 25, 80);

  if (level >= 5) {
    fill(255, 110, 110);
    textSize(15);
    text(`⚠️ GHOST IS MOVING!`, 25, 115);}}

function drawStartScreen() {
  fill(0, 0, 0, 170);
  rect(0, 0, width, height);
  textAlign(CENTER, CENTER);
  textFont('Creepster');
  fill(255, 215, 80);
  textSize(64);
  text("GHOST BUSTERS", width / 2, height / 2 - 50);
  textFont('Poppins');
  fill(220);
  textSize(18);
  text("Drag & release the slingshot to hit the ghost!", width / 2, height / 2 + 15);
  text("The ghost starts moving at Level 5! BEWARE !!", width / 2, height / 2 + 45);

  fill(140, 240, 255);
  textSize(20);
  text("Press SPACE, ENTER, or CLICK to Begin da game", width / 2, height / 2 + 105);

  if (mouseIsPressed) {
    gameState = "PLAYING";
  }
}

function drawLevelClearScreen() {
  fill(0, 0, 0, 160);
  rect(0, 0, width, height);

  textAlign(CENTER, CENTER);
  textFont('Creepster');
  fill(120, 255, 160);
  textSize(56);
  text("GHOST BUSTED!", width / 2, height / 2 - 40);

  textFont('Poppins');
  fill(255);
  textSize(20);
  text(`Cleared Level ${level}`, width / 2, height / 2 + 15);

  if (level === 4) {
    fill(255, 200, 80);
    textSize(18);
    text("Watch out! The ghost moves starting on Level 5!", width / 2, height / 2 + 50);
  }

  fill(200);
  textSize(17);
  text("Press SPACE, ENTER, or CLICK to Continue", width / 2, height / 2 + 95);

  if (mouseIsPressed && frameCount % 20 === 0) {
    nextLevel();}}

function drawGameOverScreen() {
  fill(0, 0, 0, 190);
  rect(0, 0, width, height);

  textAlign(CENTER, CENTER);
  textFont('Creepster');
  fill(255, 75, 75);
  textSize(60);
  text("GAME OVER", width / 2, height / 2 - 40);

  textFont('Poppins');
  fill(255);
  textSize(20);
  text(`Final Score: ${score}  |  Reached Level ${level}`, width / 2, height / 2 + 20);

  fill(200);
  textSize(17);
  text("Press SPACE, ENTER, or CLICK to Try Again", width / 2, height / 2 + 80);

  if (mouseIsPressed && frameCount % 20 === 0) {
    restartGame();}}

//kaboom