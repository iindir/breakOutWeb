var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 7;
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 0;
var dy = 0;
var paddleHeight = 10;
var paddleWidth = 150;
var paddleX = (canvas.width-paddleWidth)/2;
var running = false;
var ballColor = '#fff';
var brickRowCount = 15;
var brickColumnCount = 7;
var brickWidth = 100;
var brickHeight = 20;
var brickPadding = 1;
var brickOffsetTop = 20;
var brickOffsetLeft = 7;
var score = 0;
var bricks = [];
var randomNumber = 0;
var tileCount = 0;
var deBugGame = false; //Visible hitbox around ball
var hitBoxLf = x - ballRadius //* These don't actually
var hitBoxRt = x + ballRadius //* do anything
var hitBoxTp = y - ballRadius //* just for
var hitBoxBt = y + ballRadius //* convenient copy paste

document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("click", mouseClickHandler, false);

function mouseClickHandler(e){
	if (!running) {
		dx = 0.2
		dy = -0.3
		running = true;
	}
}
function mouseMoveHandler(e) {
	var relativeX = e.clientX - canvas.offsetLeft;
	if(relativeX > 0 && relativeX < canvas.width) {
		paddleX = relativeX - paddleWidth/2;
	}
}

function randomGenerator(){
	randomNumber = Math.floor(Math.random()* 4);
}

for(var c=0; c<brickColumnCount; c++) {
	bricks[c] = [];
	for(var r=0; r<brickRowCount; r++) {
		randomGenerator();
		bricks[c][r] = { x: 0, y: 0, status: randomNumber };
		if (bricks[c][r].status > 0){
			tileCount++
		}
	}
}

function resetGame(){
	for(var c=0; c<brickColumnCount; c++) {
		for(var r=0; r<brickRowCount; r++) {
			randomGenerator();
			bricks[c][r].status = randomNumber;
			if (bricks[c][r].status > 0){
				tileCount++
			}
		}
	}
}

function resetTileCount(){
	tileCount = 0
}

function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status >= 1) {
                if (x - ballRadius < b.x + brickWidth &&
					x + ballRadius > b.x &&
					y - ballRadius < b.y + brickHeight &&
					y + ballRadius > b.y) {
					if (x + ballRadius-1 < b.x ||
						x - ballRadius+1 > b.x + brickWidth
						){
						dx = -dx
					} else {
						dy = -dy
						b.status--;
					}
					if (b.status < 1){
						score++;
					}
					if(score >= tileCount){
						resetTileCount();
						resetGame();
						score = 0;
					}
                }
            }
        }
	}
}

function collision(){
	if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
		dx = -dx;
	}
	if(y + dy < ballRadius) {
		dy = -dy;
	}
	else if((y+ballRadius) + dy > canvas.height-ballRadius) {
		if(x > paddleX && x < paddleX + paddleWidth) {
			if(x > paddleX && x < paddleX + 50) {
				if (dx > 0){
					dx = -dx
				} 
			}
			if(x > paddleX + 100 && x < paddleX+paddleWidth) {
				if (dx < 0){
					dx = -dx
				}
			}
			dy = -dy;
		}
		else {
			running = false
		}
	}
}

function drawBricks(){
	for(var c=0; c<brickColumnCount; c++){
		for(var r=0; r<brickRowCount; r++){
			if (bricks[c][r].status >= 1){
				var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
				var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
				bricks [c][r].x = brickX;
				bricks [c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				if (bricks[c][r].status >= 3){
					ctx.fillStyle = '#ff0000';
				}
				else if (bricks[c][r].status == 2){
					ctx.fillStyle = '#5500ff';
				}
				else {
					ctx.fillStyle = '#00ffff';
				}
				ctx.closePath();
				ctx.fill();
			}
		}
	}
}


function drawBrickSides(){
	for(var c=0; c<brickColumnCount; c++){
		for(var r=0; r<brickRowCount; r++){
			if (bricks[c][r].status >= 1){
				var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
				var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
				bricks [c][r].x = brickX;
				bricks [c][r].y = brickY;
				ctx.beginPath();
				ctx.moveTo(brickX + 5, brickY + 5);
				ctx.lineTo(brickX + 5, brickY + brickHeight - 5);
				ctx.strokeStyle = "black";
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(brickX + brickWidth - 5, brickY + 5);
				ctx.lineTo(brickX + brickWidth - 5, brickY + brickHeight - 5);
				ctx.strokeStyle = "black";
				ctx.stroke();
			}
		}
	}
}
function drawBall() {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = ballColor;
	ctx.fill();
	ctx.closePath();
}

function drawHitBox(){
	ctx.beginPath();
	ctx.rect(x - ballRadius, y - ballRadius, ballRadius*2, ballRadius*2,);
	ctx.fillStyle = "red";
	ctx.fill();
	ctx.closePath();
}
function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddleX+50, canvas.height-paddleHeight, paddleWidth-100, paddleHeight);
	ctx.fillStyle = "ballColor";
	ctx.fill();
	ctx.closePath();

	ctx.beginPath();
	ctx.moveTo(paddleX+50, canvas.height-paddleHeight);
	ctx.lineTo(paddleX+30, canvas.height-paddleHeight+7);
	ctx.lineTo(paddleX+50, canvas.height-paddleHeight+10);
	ctx.fillStyle = "ballColor";
	ctx.fill();

	ctx.beginPath();
	ctx.moveTo(paddleX+paddleWidth-50, canvas.height-paddleHeight);
	ctx.lineTo(paddleX+paddleWidth-30, canvas.height-paddleHeight+7);
	ctx.lineTo(paddleX+paddleWidth-50, canvas.height-paddleHeight+10);
	ctx.fillStyle = "ballColor";
	ctx.fill();
}

function tripleAGraphics(){
	x += dx;
    y += dy;
}

function drawScore() {
  ctx.font = "12px Arial";
  ctx.fillStyle = "#004d13";
  ctx.fillText("Score: "+score, 8, 13);
}
function drawTileCount() {
  ctx.font = "12px Arial";
  ctx.fillStyle = "#004d13";
  ctx.fillText("Target: "+tileCount, 88, 13);
}

function updateGameLogic(times){
	for (var i = 0; i < times; i++){
		collisionDetection();
		collision();
		if (deBugGame == true){
			drawHitBox();
		}
		if(running == true){
			tripleAGraphics();
		}
		if(running == false){
			x = paddleX + paddleWidth/2
			y = canvas.height-paddleHeight-ballRadius
			dx = 0
			dy = 0
		}
	}
}

function renderMachine(){
	drawBall();
	drawPaddle();
	drawTileCount();
	drawScore();
	drawBricks();
	drawBrickSides();
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	updateGameLogic(10);
	renderMachine();
	requestAnimationFrame(draw);
}

draw();
