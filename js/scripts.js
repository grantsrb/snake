function SnakeBit(x,y, context){
  this.xc = x;
  this.yc = y;
  this.squareSize = 9;
  this.context = context;
}
SnakeBit.prototype.updateBit = function() {
  this.context.fillRect(this.xc, this.yc, this.squareSize, this.squareSize);
}
function Snake(context) {
  var initialX = 100;
  var initialY = 300;
  var headBit = new SnakeBit(initialX,initialY, context);
  this.bits = [headBit];
  for (var i = 1; i < 4; i++) {
    var tailBit = new SnakeBit(initialX-(10*i),initialY, context);
    this.bits.push(tailBit);
  }
  this.gameOver = false;
}
Snake.prototype.updateBits = function() {
  this.bits[0].updateBit();
  for (var count = this.bits.length-1; count > 0; count--) {
    this.bits[count].xc = this.bits[count-1].xc;
    this.bits[count].yc = this.bits[count-1].yc;
    this.bits[count].updateBit();
  }
}
$(document).ready(function() {
  $(document.body).on('keydown', onkeypress);

  var c = document.getElementById('canvas');
  var ctx = c.getContext('2d');
  var up = false;
  var down = false;
  var left = false;
  var right = true;

  function onkeypress(key) {
    switch(key.keyCode) {
      case 40:
        down = true;
        up = false;
        right = false;
        left = false;
        break;
      case 37:
        left = true;
        up = false;
        right = false;
        down = false;
        break;
      case 38:
        up = true;
        right = false;
        left = false;
        down = false;
        break;
      case 39:
        right = true;
        up = false;
        left = false;
        down = false;
        break;
    }
  }

  var xCoord = null;
  var yCoord = null;
  var gameSpeed = 100;
  var prevTimestamp = null;
  var snakeGuy = new Snake(ctx);

  var startTime = null;
  window.requestAnimationFrame(function step(timestamp) {
    if(timestamp > prevTimestamp + gameSpeed) {
      prevTimestamp = timestamp;
      ctx.fillStyle = 'white';
      ctx.fillRect(0,0,c.clientWidth,c.clientHeight);

      ctx.beginPath();
      ctx.fillStyle = "black";
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
    console.log(timestamp);
    window.requestAnimationFrame(step);
  });
});
