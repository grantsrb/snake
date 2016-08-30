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
  this.bitSquareSize = squareSizeIn;
  context.fillStyle = 'black';
  context.beginPath();
  var headBit = new SnakeBit(this.initialX,this.initialY, context, squareSizeIn);
  this.bits = [headBit];
  for (var i = 0; i < 5; i++) {
    var tailBit = new SnakeBit(this.initialX-(10*i),this.initialY, context, squareSizeIn);
    this.bits.push(tailBit);
  }
  context.stroke();
  this.snakeSpeed = 50;
  this.bitColor = 'black';
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
  if(this.bitColor == 'blue' || this.bitColor == 'star') {
    if(this.bits[0].xc >= canvasWidth) {
      this.bits[0].xc -= canvasWidth;
      this.bits[1].xc -= canvasWidth;
    } else if(this.bits[0].xc < 0) {
      this.bits[0].xc += canvasWidth;
      this.bits[1].xc += canvasWidth;
    } else if(this.bits[0].yc >= canvasHeight) {
      this.bits[0].yc -= canvasHeight;
      this.bits[1].yc -= canvasHeight;
    } else if(this.bits[0].yc < 0) {
      this.bits[0].yc += canvasHeight;
      this.bits[1].yc += canvasHeight;
    }
  } else {
    for (var i = 2; i < this.bits.length; i++) {
      if(this.bits[0].xc === this.bits[i].xc && this.bits[0].yc === this.bits[i].yc) {
        this.gameEnd = true;
      }
    }
    if(this.bits[0].xc >= canvasWidth || this.bits[0].xc < 0 || this.bits[0].yc >= canvasHeight || this.bits[0].yc < 0) {
      this.gameEnd = true;
    }
  }
}
Snake.prototype.changeProperty = function(color, context) {
  this.snakeSpeed = 50;
  if(this.bitColor == 'orange' || this.bitColor == 'star') {
    for (var i = 1; i < 11; i++) {
      this.bits.pop();
    }
  }
  this.bitColor = color;
  switch (color) {
    case 'red':
      this.snakeSpeed = 10;
      break;
    case 'orange':
      for (var i = 1; i < 11; i++) {
        var tailBit = new SnakeBit(this.bits[2].xc,this.bits[2].yc, context, this.bitSquareSize);
        this.bits.push(tailBit);
      }
      break;
    case 'green':
      this.score += 50;
      break;
    case 'star':
      this.snakeSpeed = 10;
      for (var i = 1; i < 11; i++) {
        var tailBit = new SnakeBit(this.bits[2].xc,this.bits[2].yc, context, this.bitSquareSize);
        this.bits.push(tailBit);
      }
      this.score += 100;
  }
}

//Game Over Flashing Text function -- added by JA
function flashingText(context, stopRecursion, intervalCounter){
  var count = 200;
  var timer = setInterval(function(){
    count --;
    if (!stopRecursion.stop) {
      console.log(intervalCounter);
      if (count%2 == 1){
        context.clearRect(0, 0, 800, 600);
        context.font = "80px Monoton";
        context.fillStyle = "red";
        context.textAlign = "center";
        context.fillText("GAME OVER", 400, 300);
        $("canvas").css('background-color', 'black');
      }
      else{
        context.clearRect(0, 0, 800, 600);
        context.font = "80px Monoton";
        context.fillStyle = "white";
        context.textAlign = "center";
        context.fillText("GAME OVER", 400, 300);
        $("canvas").css('background-color', 'black');
      }
    } else {
      clearInterval(timer);
    }
  }, 200);
}
// parses information from checkboxes
function parseColors(powerChoicesIn) {
  var colorChoicesOut = [[false, false, false, false, false], ['orange','green','blue','red','star']];
  for (var i = 0; i < powerChoicesIn.length; i++) {
    for (var j = 0; j < colorChoicesOut[1].length; j++) {
      if (powerChoicesIn[i] == colorChoicesOut[1][j]) {
        colorChoicesOut[0][j] = true;
      }
    }
  }
  return colorChoicesOut;
}

//function to play themed game over audio
function gameOverAudio(userTheme){
  var marioGameOver = $("#mario-game-over")[0];
  var sailorMoonGameOver = $("#sailor-moon-game-over")[0];
  var castlevaniaGameOver = $("#castlevania-game-over")[0];
  var zeldaGameOver = $("#zelda-game-over")[0];
  var pokemonGameOver = $("#pokemon-game-over")[0];

  if (userTheme === "mario"){
    marioGameOver.play();
    sailorMoonGameOver.pause();
    castlevaniaGameOver.pause();
    zeldaGameOver.pause();
    pokemonGameOver.pause();
  } else if (userTheme === "sailorMoon"){
    marioGameOver.pause();
    sailorMoonGameOver.play();
    castlevaniaGameOver.pause();
    zeldaGameOver.pause();
    pokemonGameOver.pause();
  } else if (userTheme === "castlevania"){
    marioGameOver.pause();
    sailorMoonGameOver.pause();
    castlevaniaGameOver.play();
    zeldaGameOver.pause();
    pokemonGameOver.pause();
  } else if (userTheme === "zelda1"){
    marioGameOver.pause();
    sailorMoonGameOver.pause();
    castlevaniaGameOver.pause();
    zeldaGameOver.play();
    pokemonGameOver.pause();
  } else if (userTheme === "zelda2"){
    marioGameOver.pause();
    sailorMoonGameOver.pause();
    castlevaniaGameOver.pause();
    zeldaGameOver.play();
    pokemonGameOver.pause();
  } else if (userTheme === "zelda3"){
    marioGameOver.pause();
    sailorMoonGameOver.pause();
    castlevaniaGameOver.pause();
    zeldaGameOver.play();
    pokemonGameOver.pause();
  } else if (userTheme === "pokemon"){
    marioGameOver.pause();
    sailorMoonGameOver.pause();
    castlevaniaGameOver.pause();
    zeldaGameOver.pause();
    pokemonGameOver.play();
  } else {
    marioGameOver.pause();
    sailorMoonGameOver.pause();
    castlevaniaGameOver.pause();
    zeldaGameOver.pause();
    pokemonGameOver.pause();
  }
}
function playMusic(songToPlayIndex, songs) {
  for (var i = 0; i < songs[0].length; i++) {
    if(i == songToPlayIndex) {
      songs[0][i].play();
    } else {
      songs[0][i].pause();
    }
  }
}

$(document).ready(function() {

//grabs user input for themes and changes background/font/music accordingly
  var musicThemes = [[0,0,0,0,0,0,0], ['mario','sailorMoon','castlevania','zelda1','zelda2','zelda3','pokemon']];
  var userThemeChoice = "";
  for (var i = 0; i < musicThemes[1].length; i++) {
    musicThemes[0][i] = ($("#" + musicThemes[1][i])[0]);
  }
  $("select#themes").change(function(){
    userThemeChoice = $("#themes").val();
    $("body").removeClass();
    $("h1").removeClass();
    console.log(userThemeChoice);
    if (userThemeChoice === "mario"){
      $("body").addClass("marioBackground");
      $("h1").addClass("marioText");
      playMusic(0,musicThemes);
    } else if (userThemeChoice === "sailorMoon"){
      $("body").addClass("sailorMoonBackground");
      $("h1").addClass("sailorMoonText");
      playMusic(1,musicThemes);
    } else if (userThemeChoice === "castlevania") {
      $("body").addClass("castlevaniaBackground");
      $("h1").addClass("castlevaniaText");
      playMusic(2,musicThemes);
    } else if (userThemeChoice === "zelda1"){
      $("body").addClass("zelda1Background");
      $("h1").addClass("zelda1Text");
      playMusic(3,musicThemes);
    } else if (userThemeChoice === "zelda2"){
      $("body").addClass("zelda2Background");
      $("h1").addClass("zelda2Text");
      playMusic(4,musicThemes);
    } else if (userThemeChoice === "zelda3"){
      $("body").addClass("zelda3Background");
      $("h1").addClass("zelda3Text");
      playMusic(5,musicThemes);
    } else if (userThemeChoice === "pokemon"){
      $("body").addClass("pokemonBackground");
      $("h1").addClass("pokemonText");
      playMusic(6,musicThemes);
    } else {
      $("body").removeClass();
      $("h1").removeClass();
      playMusic(null,musicThemes);
    }
  });


//receives user input
  $(document.body).on('keydown', function onkeypress(key) {
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
  var lastKey = 'right';
  var restart = true;
  var preventKeyChange = 'left';
  var stopRecursion = {
    stop : false
  };
  var intervalCounter = 0;
//initiates and maintains frame updates
  $("body").on("keydown", function(key) {
    stopRecursion.stop = true;
    if (restart == true){
      restart = false;

      //declares initial game variables
      var c = document.getElementById('canvas');
      var ctx = c.getContext('2d');
      var canvasWidth = 800;
      var canvasHeight = 600;
      var prevTimestamp = null;
      var bitSquareSize = 9;
      var xStart = 100;
      var yStart = 300;

      // Blank screen
      ctx.fillStyle = 'white';
      ctx.fillRect(0,0,c.clientWidth,c.clientHeight);

      //creates snake object and initial images
      var colorCounter = 0;
      var colorsArray = ['red', 'blue', 'orange', 'green'];
      var snakeColor = "black";
      var snakeGuy = new Snake(ctx, xStart, yStart, bitSquareSize);
      snakeGuy.bits[0].xc += 10;
      snakeGuy.updateBits();

      //creates initial coordinates for item
      var itemX = Math.floor((Math.random()*canvasWidth)/10)*10;
      var itemY = Math.floor((Math.random()*canvasHeight)/10)*10;
      var itemColor = 'black';
      ctx.fillRect(itemX, itemY, snakeGuy.bits[0].squareSize, snakeGuy.bits[0].squareSize);

      // Receive checkbox information
      var powerChoices = [];
      $('input:checkbox[name=powerups]:checked').each(function(){
        powerChoices.push(this.value);
      });
      var colorChoices = parseColors(powerChoices);

      // Animation function
      window.requestAnimationFrame(function step(timestamp) {
        $(".showScore").text(snakeGuy.score);
        if(timestamp > prevTimestamp + snakeGuy.snakeSpeed) {

          prevTimestamp = timestamp;
          // canvas color
          ctx.fillStyle = 'white';
          ctx.fillRect(0,0,c.clientWidth,c.clientHeight);
          // item color
          if (itemColor == 'star') {
            ctx.fillStyle = colorsArray[colorCounter%4];
            colorCounter++;
          } else {
            ctx.fillStyle = itemColor;
          }
          ctx.fillRect(itemX, itemY, snakeGuy.bits[0].squareSize, snakeGuy.bits[0].squareSize);
          // snakebit color
          if (snakeGuy.bitColor == 'star'){
            snakeColor = colorsArray[colorCounter%4];
            colorCounter++;
          }
          ctx.fillStyle = snakeColor;
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
          snakeGuy.changeProperty(itemColor, ctx);
          snakeColor = itemColor;
          itemColor = Math.floor(Math.random()*6);
          if (itemColor == 0 && colorChoices[0][0]) {
            itemColor = 'orange';
          } else if (itemColor == 1 && colorChoices[0][1]) {
            itemColor = 'green';
          } else if (itemColor == 2 && colorChoices[0][2]) {
            itemColor = 'blue';
          } else if (itemColor == 3 && colorChoices[0][3]) {
            itemColor = 'red';
          } else if (itemColor == 4 && colorChoices[0][4]) {
            itemColor = 'star';
          } else {
            itemColor = 'black';
          }
          var spaceFree = true;
          do {
            itemX = Math.floor((Math.random()*canvasWidth)/10)*10;
            itemY = Math.floor((Math.random()*canvasHeight)/10)*10;
            for (var i = 0; i < snakeGuy.bits.length; i++) {
              if(snakeGuy.bits[i].xc === itemX && snakeGuy.bits[i].yc === itemY) {
                spaceFree = false;
              }
            }
          } while(!spaceFree);
          snakeGuy.snakeBite(ctx, bitSquareSize);
          snakeGuy.score += 10;
        }

        //ends game if game ending conditions are true
        snakeGuy.gameOver(canvasWidth, canvasHeight);
        if(snakeGuy.gameEnd) {
          stopRecursion.stop = false;
          // Adds flashing Game Over text
          flashingText(ctx, stopRecursion);
          restart = true;
          //pauses game audio
          musicThemes[0][0].pause();
          musicThemes[0][1].pause();
          musicThemes[0][2].pause();
          musicThemes[0][3].pause();
          musicThemes[0][4].pause();
          musicThemes[0][5].pause();
          musicThemes[0][6].pause();
          //starts game over audio
          gameOverAudio(userThemeChoice);
        } else {
          window.requestAnimationFrame(step);
        }
      });
    }
  });
});
