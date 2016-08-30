//game class definitions
//create each snake piece
function SnakeBit(x,y, context, squareSizeIn){
  this.xc = x;
  this.yc = y;
  this.squareSize = squareSizeIn;
  this.context = context;
}
//draws each snake piece
SnakeBit.prototype.updateBit = function() {
  this.context.fillRect(this.xc, this.yc, this.squareSize, this.squareSize);
}
//holds snake body information
function Snake(context, xStart, yStart, squareSizeIn) {
  this.initialX = xStart;
  this.initialY = yStart;
  context.fillStyle = 'black';
  context.beginPath();
  var headBit = new SnakeBit(this.initialX,this.initialY, context, squareSizeIn);
  this.bits = [headBit];
  for (var i = 1; i < 6; i++) {
    var tailBit = new SnakeBit(this.initialX-(10*i),this.initialY, context, squareSizeIn);
    this.bits.push(tailBit);
  }
  context.stroke();
  this.gameEnd = false;
  this.score = 0;
}
//Synchronizes snake movement
Snake.prototype.updateBits = function() {
  this.bits[0].updateBit();
  for (var count = this.bits.length-1; count > 0; count--) {
    this.bits[count].xc = this.bits[count-1].xc;
    this.bits[count].yc = this.bits[count-1].yc;
    this.bits[count].updateBit();
  }
}
//adds additional snake body to snake object
Snake.prototype.snakeBite = function(context, squareSizeIn) {
  var tailBit = new SnakeBit(this.bits[2].xc,this.bits[2].yc, context, squareSizeIn);
  this.bits.push(tailBit);
}
//check for game ending conditions
Snake.prototype.gameOver = function(canvasWidth, canvasHeight) {
  for (var i = 2; i < this.bits.length; i++) {
    if(this.bits[0].xc === this.bits[i].xc && this.bits[0].yc === this.bits[i].yc) {
      this.gameEnd = true;
    }
  }
  if(this.bits[0].xc >= canvasWidth || this.bits[0].xc < 0 || this.bits[0].yc >= canvasHeight || this.bits[0].yc < 0) {
    this.gameEnd = true;
  }
}



$(document).ready(function() {
//receives user input
  $(document.body).on('keydown', function onkeypress(key) {
    console.log(key.keyCode);
    switch(key.keyCode) {
      case 83:
      case 75:
        if (preventKeyChange != 'down')
          lastKey = 'down';
        break;
      case 65:
      case 74:
        if (preventKeyChange != 'left')
          lastKey = 'left';
        break;
      case 87:
      case 73:
        if(preventKeyChange != 'up')
          lastKey = 'up';
        break;
      case 68:
      case 76:
        if (preventKeyChange != 'right')
          lastKey = 'right';
        break;
    }
  });

//declares initial game variables
  var c = document.getElementById('canvas');
  var ctx = c.getContext('2d');
  var canvasWidth = 800;
  var canvasHeight = 600;
  console.log(canvasWidth);
  var lastKey = 'right';
  var gameSpeed = 50;
  var prevTimestamp = null;
  var preventKeyChange = 'left';
  var bitSquareSize = 9;
  var xStart = 100;
  var yStart = 300;

//creates snake object and initial images
  var snakeGuy = new Snake(ctx, xStart, yStart, bitSquareSize);
  snakeGuy.bits[0].xc += 10;
  snakeGuy.updateBits();
  ctx.fillRect(xStart, yStart, bitSquareSize, bitSquareSize);

  //creates initial coordinates for item
  var itemX = Math.floor((Math.random()*canvasWidth)/10)*10;
  var itemY = Math.floor((Math.random()*canvasHeight)/10)*10;
  var itemColor = 'black';
  ctx.fillRect(itemX, itemY, snakeGuy.bits[0].squareSize, snakeGuy.bits[0].squareSize);

//initiates and maintains frame updates
  $("#canvas").click(function() {
    var initialCounter = 0;
    window.requestAnimationFrame(function step(timestamp) {
      $(".showScore").text(snakeGuy.score);
      if(timestamp > prevTimestamp + gameSpeed) {
        initialCounter++;
        prevTimestamp = timestamp;
        // canvas color
        ctx.fillStyle = 'white';
        ctx.fillRect(0,0,c.clientWidth,c.clientHeight);
        // item color
        ctx.fillStyle = itemColor;
        ctx.fillRect(itemX, itemY, snakeGuy.bits[0].squareSize, snakeGuy.bits[0].squareSize);
        // snakebit color
        ctx.fillStyle = "black";
        ctx.beginPath();

        //transforms user input into snake movement direction
        if (lastKey == 'left') {
          preventKeyChange = 'right';
          snakeGuy.bits[0].xc -= 10;
          snakeGuy.updateBits();
          ctx.stroke();
        } else if (lastKey == 'right') {
          preventKeyChange = 'left';
          snakeGuy.bits[0].xc += 10;
          snakeGuy.updateBits();
          ctx.stroke();
        }  else if (lastKey == 'down') {
          preventKeyChange = 'up';
          snakeGuy.bits[0].yc += 10;
          snakeGuy.updateBits();
          ctx.stroke();
        }  else if (lastKey == 'up') {
          preventKeyChange = 'down';
          snakeGuy.bits[0].yc -= 10;
          snakeGuy.updateBits();
          ctx.stroke();
        }
      }
      //generates new item placement when snake consumes item
      if(snakeGuy.bits[0].xc === itemX  && snakeGuy.bits[0].yc === itemY) {
        itemColor = Math.floor(Math.random()*5);
        if (itemColor == 0) {
          itemColor = 'yellow';
        } else if (itemColor == 1) {
          itemColor = 'green';
        } else if (itemColor == 2) {
          itemColor = 'blue';
        } else if (itemColor == 3) {
          itemColor = 'red';
        } else {
          itemColor = 'black';
        }
        itemX = Math.floor((Math.random()*canvasWidth)/10)*10;
        itemY = Math.floor((Math.random()*canvasHeight)/10)*10;

        snakeGuy.snakeBite(ctx, bitSquareSize);
        snakeGuy.score += 10;
      }
      //fixes white space in snake body during the beginning of the game
      if (initialCounter < snakeGuy.bits.length-2) {
        ctx.fillRect(snakeGuy.initialX, snakeGuy.initialY, snakeGuy.bits[0].squareSize, snakeGuy.bits[0].squareSize);
      }
      //ends game if game ending conditions are true
      snakeGuy.gameOver(canvasWidth, canvasHeight);
      if(snakeGuy.gameEnd) {
        ctx.fillStyle = 'red';
        ctx.fillRect(0,0,c.clientWidth,c.clientHeight);
      } else {
        window.requestAnimationFrame(step);
      }
    });
  })
});
