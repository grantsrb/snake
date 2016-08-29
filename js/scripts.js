function SnakeBit(x,y, head, context){
  this.xc = x;
  this.yc = y;
  this.squareSize = 9;
  this.context = context;
  this.head = head;
}
SnakeBit.prototype.slither = function() {
  this.context.fillRect(this.xc, this.yc, this.squareSize, this.squareSize);
}
function Snake(context) {
  var headBit = new SnakeBit(100,300, true, context);
  this.bits = [headBit];
  this.gameOver = false;
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
  var gameSpeed = 1;
  var snakeGuy = new Snake(ctx);

  var startTime = null;
  window.requestAnimationFrame(function step() {

    ctx.fillStyle = 'white';
    ctx.fillRect(0,0,c.clientWidth,c.clientHeight);

    ctx.beginPath();
    ctx.fillStyle = "black";
    if (left == true) {
      snakeGuy.bits[0].xc -= gameSpeed;
      snakeGuy.bits[0].slither();
      ctx.stroke();
    } else if (right == true) {
      snakeGuy.bits[0].xc += gameSpeed;
      snakeGuy.bits[0].slither();
      ctx.stroke();
    }  else if (down == true) {
      snakeGuy.bits[0].yc += gameSpeed;
      snakeGuy.bits[0].slither();
      ctx.stroke();
    }  else if (up == true) {
      snakeGuy.bits[0].yc -= gameSpeed;
      snakeGuy.bits[0].slither();
      ctx.stroke();
    }

    window.requestAnimationFrame(step);
  });
});
