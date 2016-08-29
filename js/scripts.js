//game class definitions
//create each snake piece
function SnakeBit(x,y, context){
  this.xc = x;
  this.yc = y;
  this.squareSize = 9;
  this.context = context;
}
//draws each snake piece
SnakeBit.prototype.updateBit = function() {
  this.context.fillRect(this.xc, this.yc, this.squareSize, this.squareSize);
}
//holds snake body information
function Snake(context) {
  this.initialX = 100;
  this.initialY = 300;
  context.fillStyle = 'black';
  context.beginPath();
  var headBit = new SnakeBit(this.initialX,this.initialY, context);
  this.bits = [headBit];
  for (var i = 1; i < 6; i++) {
    var tailBit = new SnakeBit(this.initialX-(10*i),this.initialY, context);
    this.bits.push(tailBit);
  }
  context.stroke();
  this.gameEnd = false;
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
Snake.prototype.snakeBite = function(context) {
  var tailBit = new SnakeBit(this.bits[2].xc,this.bits[2].yc, context);
  this.bits.push(tailBit);
}
//check for game ending conditions
Snake.prototype.gameOver = function() {
  for (var i = 2; i < this.bits.length; i++) {
    if(this.bits[0].xc === this.bits[i].xc && this.bits[0].yc === this.bits[i].yc) {
      this.gameEnd = true;
    }
  }
  if(this.bits[0].xc >= 800 || this.bits[0].xc < 0 || this.bits[0].yc >= 600 || this.bits[0].yc < 0) {
    this.gameEnd = true;
  }
}



$(document).ready(function() {
//receives user input
  $(document.body).on('keydown', function onkeypress(key) {
    switch(key.keyCode) {
      case 40:
        if(!up)
          down = true;
        right = false;
        left = false;
        break;
      case 37:
        if (!right)
          left = true;
        up = false;
        down = false;
        break;
      case 38:
        if (!down)
          up = true;
        right = false;
        left = false;
        break;
      case 39:
        if (!left)
          right = true;
        up = false;
        down = false;
        break;
    }
  });

//declares initial game variables
  var c = document.getElementById('canvas');
  var ctx = c.getContext('2d');
  var up = false;
  var down = false;
  var left = false;
  var right = true;
  var gameSpeed = 100;
  var prevTimestamp = null;

//creates snake object and initial images
  var snakeGuy = new Snake(ctx);
  snakeGuy.bits[0].xc += 10;
  snakeGuy.updateBits();
  ctx.fillRect(100, 300, 9, 9);
  console.log(snakeGuy.bits);
  //creates initial coordinates for item
  var itemX = Math.floor((Math.random()*800)/10)*10;
  var itemY = Math.floor((Math.random()*600)/10)*10;

//initiates and maintains frame updates
  $("#canvas").click(function() {
    var initialCounter = 0;
    window.requestAnimationFrame(function step(timestamp) {
      if(timestamp > prevTimestamp + gameSpeed) {
        initialCounter++;
        prevTimestamp = timestamp;
        ctx.fillStyle = 'white';
        ctx.fillRect(0,0,c.clientWidth,c.clientHeight);

        ctx.fillStyle = "black";
        ctx.beginPath();

        ctx.fillRect(itemX, itemY, snakeGuy.bits[0].squareSize, snakeGuy.bits[0].squareSize);
        //transforms user input into snake movement direction
        if (left == true) {
          snakeGuy.bits[0].xc -= 10;
          snakeGuy.updateBits();
          ctx.stroke();
        } else if (right == true) {
          snakeGuy.bits[0].xc += 10;
          snakeGuy.updateBits();
          ctx.stroke();
        }  else if (down == true) {
          snakeGuy.bits[0].yc += 10;
          snakeGuy.updateBits();
          ctx.stroke();
        }  else if (up == true) {
          snakeGuy.bits[0].yc -= 10;
          snakeGuy.updateBits();
          ctx.stroke();
        }
      }
      //generates new item placement when snake consumes item
      if(snakeGuy.bits[0].xc === itemX  && snakeGuy.bits[0].yc === itemY) {
        itemX = Math.floor((Math.random()*800)/10)*10;
        itemY = Math.floor((Math.random()*600)/10)*10;
        snakeGuy.snakeBite(ctx);
      }
      //takes care of white space in snake body during the beginning of the game
      if (initialCounter < snakeGuy.bits.length-2) {
        ctx.fillRect(snakeGuy.initialX, snakeGuy.initialY, snakeGuy.bits[0].squareSize, snakeGuy.bits[0].squareSize);
      }
      //ends game if game ending conditions are true
      snakeGuy.gameOver();
      if(snakeGuy.gameEnd) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0,0,c.clientWidth,c.clientHeight);
      } else {
        window.requestAnimationFrame(step);
      }
    });
  })
});
