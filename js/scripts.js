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
function Snake(context, xStart, yStart, squareSizeIn, difficulty) {
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
  this.snakeSpeed = difficulty;
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
Snake.prototype.changeProperty = function(color, context, difficulty) {
  this.snakeSpeed = difficulty;
  if(this.bitColor == 'orange' || this.bitColor == 'star') {
    for (var i = 1; i < 11; i++) {
      this.bits.pop();
    }
  }
  this.bitColor = color;
  switch (color) {
    case 'red':
      this.score += 20;
      this.snakeSpeed -= 40;
      break;
    case 'orange':
      for (var i = 1; i < 11; i++) {
        var tailBit = new SnakeBit(this.bits[2].xc,this.bits[2].yc, context, this.bitSquareSize);
        this.bits.push(tailBit);
      }
      this.score += 10;
      break;
    case 'green':
      this.score += 40;
      break;
    case 'star':
      this.snakeSpeed -= 40;
      for (var i = 1; i < 11; i++) {
        var tailBit = new SnakeBit(this.bits[2].xc,this.bits[2].yc, context, this.bitSquareSize);
        this.bits.push(tailBit);
      }
      this.score += 90;
  }
}

//Game Over Flashing Text function -- added by JA
function flashingText(context, stopRecursion, width, height){
  var count = 200;
  var timer = setInterval(function(){
    count --;
    if (!stopRecursion.stop) {
      if (count%2 == 1){
        context.clearRect(0, 0, width, height);
        context.font = "55px Monoton";
        context.fillStyle = "red";
        context.textAlign = "center";
        context.fillText("GAME OVER", width/2, height/2);
        $("canvas").css('background-color', 'black');
      }
      else{
        context.clearRect(0, 0, width, height);
        context.font = "55px Monoton";
        context.fillStyle = "white";
        context.textAlign = "center";
        context.fillText("GAME OVER", width/2, height/2);
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
// plays selected music while pausing all others
function playMusic(songToPlayIndex, songs) {
  for (var i = 0; i < songs[0].length; i++) {
    if(i == songToPlayIndex) {
      songs[0][i].play();
    } else {
      songs[0][i].pause();
    }
  }
}

// UI Logic
$(document).ready(function() {
  //function to capture user input for canvas size
  var c = document.getElementById('canvas');
  var ctx = c.getContext('2d');
  var userCanvasOption = "";
  var userCanvasOptionSplit = [800, 600];
  var currentScore = 0;
  var highScore = 0;
  $("form#canvasOption").change(function(){
    userCanvasOption = $("input:radio[name=canvasSize]:checked").val();
    userCanvasOptionSplit = [];
    userCanvasOptionSplit = userCanvasOption.split(" ");
    $(c).attr('width', userCanvasOptionSplit[0]);
    $(c).attr('height', userCanvasOptionSplit[1]);
  });

//grabs user input for themes and changes background/font/music accordingly
  $("#themes").change(function() {
    var musicThemes = [[0,0,0,0,0,0,0], ['mario','sailorMoon','castlevania','zelda1','zelda2','zelda3','pokemon']];
    var userThemeChoice = "";
    for (var i = 0; i < musicThemes[1].length; i++) {
      musicThemes[0][i] = ($("#" + musicThemes[1][i])[0]);
    }
    userThemeChoice = $("#themes").val();
    $("body").removeClass();
    $("h1").removeClass();
    for (var i = 0; i < musicThemes[1].length; i++) {
      if (userThemeChoice == musicThemes[1][i]) {
        $("body").addClass(musicThemes[1][i] + "Background");
        $("h1").addClass(musicThemes[1][i] + "Text");
        break;
      } else {
        $("body").removeClass();
        $("h1").removeClass();
      }
    }
  });
  //function to play themed game over audio
  function gameOverAudio(userTheme, musicThemes){
    var gameOverThemes = [[0,0,0,0,0], ['marioGameOver', 'sailorMoonGameOver', 'castlevaniaGameOver', 'zeldaGameOver', 'pokemonGameOver']];
    for (var i = 0; i < gameOverThemes[1].length; i++) {
      gameOverThemes[0][i] = ($("#" + gameOverThemes[1][i])[0]);
    }
    for (var i = 0; i < musicThemes[1].length; i++) {
      if (userTheme === musicThemes[1][i]) {
        if(i === 3 || i === 4 || i === 5) {
          playMusic(3, gameOverThemes);
          break;
        } else if (i === 6) {
          playMusic(4, gameOverThemes);
          break;
        } else {
          playMusic(i,gameOverThemes);
          break;
        }
      }
    }
  }

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
//initiates and maintains frame updates
  $("body").on("keydown", function(key) {
    $('#themes').prop('disabled', true);
    stopRecursion.stop = true;
    if (restart == true){
      restart = false;

      //declares initial game variables
      var canvasWidth = parseInt(userCanvasOptionSplit[0]);
      var canvasHeight = parseInt(userCanvasOptionSplit[1]);
      var prevTimestamp = null;
      var bitSquareSize = 9;
      var xStart = canvasWidth/4;
      var yStart = canvasHeight/2;

      // Blank screen
      ctx.fillStyle = 'white';
      ctx.fillRect(0,0,c.clientWidth,c.clientHeight);

      //creates snake object and initial images
      var colorCounter = 0;
      var colorsArray = ['red', 'blue', 'orange', 'green'];
      var snakeColor = "black";
      var difficultyIn = -(parseInt($("#difficulty").val()));
      console.log(difficultyIn);
      var snakeGuy = new Snake(ctx, xStart, yStart, bitSquareSize, difficultyIn);
      snakeGuy.bits[0].xc += 10;
      snakeGuy.updateBits();
      currentScore = snakeGuy.score;


      //creates initial coordinates for item
      var blackItemX = Math.floor((Math.random()*canvasWidth)/10)*10;
      var blackItemY = Math.floor((Math.random()*canvasHeight)/10)*10;
      var coloredItemX = Math.floor((Math.random()*canvasWidth)/10)*10;
      var coloredItemY = Math.floor((Math.random()*canvasHeight)/10)*10;
      ctx.fillStyle = 'black';
      ctx.fillRect(blackItemX, blackItemY, snakeGuy.bits[0].squareSize, snakeGuy.bits[0].squareSize);

      // Receive colored items checkbox information
      var powerChoices = [];
      $('input:checkbox[name=powerups]:checked').each(function(){
        powerChoices.push(this.value);
      });
      var colorChoices = parseColors(powerChoices);
      var itemColor = null;
      if (powerChoices.length > 0)
        itemColor = powerChoices[Math.floor(Math.random()*(powerChoices.length-1))];
      //Plays chosen music for theme
      var musicThemes = [[0,0,0,0,0,0,0], ['mario','sailorMoon','castlevania','zelda1','zelda2','zelda3','pokemon']];
      var userThemeChoice = "";
      for (var i = 0; i < musicThemes[1].length; i++) {
        musicThemes[0][i] = ($("#" + musicThemes[1][i])[0]);
      }
      userThemeChoice = $("#themes").val();
      $("body").removeClass();
      $("h1").removeClass();
      for (var i = 0; i < musicThemes[1].length; i++) {
        if (userThemeChoice == musicThemes[1][i]) {
          $("body").addClass(musicThemes[1][i] + "Background");
          $("h1").addClass(musicThemes[1][i] + "Text");
          playMusic(i,musicThemes);
          break;
        } else {
          $("body").removeClass();
          $("h1").removeClass();
          playMusic(null,musicThemes);
        }
      }

      // Animation function
      window.requestAnimationFrame(function step(timestamp) {
        $(".showScore").text(currentScore);
        if(timestamp > prevTimestamp + snakeGuy.snakeSpeed) {
          prevTimestamp = timestamp;
          // canvas color
          ctx.fillStyle = 'white';
          ctx.fillRect(0,0,c.clientWidth,c.clientHeight);

          // paints colored items
          if (itemColor != null) {
            if (itemColor == 'star') {
              ctx.fillStyle = colorsArray[colorCounter%5];
              colorCounter++;
            } else {
              ctx.fillStyle = itemColor;
            }
            ctx.fillRect(coloredItemX, coloredItemY, snakeGuy.bits[0].squareSize, snakeGuy.bits[0].squareSize);
          }
          ctx.fillStyle = 'black';
          ctx.fillRect(blackItemX,blackItemY, snakeGuy.bits[0].squareSize, snakeGuy.bits[0].squareSize);
          // snakebit color
          if (snakeGuy.bitColor == 'star'){
            snakeColor = colorsArray[colorCounter%5];
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
        //generates new colored item placement when snake consumes colored item
        if(snakeGuy.bits[0].xc === coloredItemX  && snakeGuy.bits[0].yc === coloredItemY && itemColor != null) {
          snakeGuy.changeProperty(itemColor, ctx, difficultyIn);
          snakeColor = itemColor;
          itemColor = powerChoices[Math.floor(Math.random()*(powerChoices.length))];

          var spaceFree = true;
          do {
            spaceFree = true;
            coloredItemX = Math.floor((Math.random()*canvasWidth)/10)*10;
            coloredItemY = Math.floor((Math.random()*canvasHeight)/10)*10;
            for (var i = 0; i < snakeGuy.bits.length; i++) {
              if(snakeGuy.bits[i].xc === coloredItemX && snakeGuy.bits[i].yc === coloredItemY) {
                spaceFree = false;
              } else if (coloredItemX == blackItemX && coloredItemY == blackItemY) {
                spaceFree = false;
              }
            }
          } while(!spaceFree);
          snakeGuy.snakeBite(ctx, bitSquareSize);
          snakeGuy.score += 10;
        }
        //generates new black item placement when snake consumes black item
        if(snakeGuy.bits[0].xc === blackItemX  && snakeGuy.bits[0].yc === blackItemY) {
          snakeGuy.changeProperty('black', ctx, difficultyIn);
          snakeColor = 'black';
          var spaceFree = true;
          do {
            spaceFree = true;
            blackItemX = Math.floor((Math.random()*canvasWidth)/10)*10;
            blackItemY = Math.floor((Math.random()*canvasHeight)/10)*10;
            for (var i = 0; i < snakeGuy.bits.length; i++) {
              if(snakeGuy.bits[i].xc === blackItemX && snakeGuy.bits[i].yc === blackItemY) {
                spaceFree = false;
              } else if (blackItemX == coloredItemX && blackItemY == coloredItemY) {
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
          currentScore = snakeGuy.score;
          stopRecursion.stop = false;
          lastKey = 'right';
          // Adds flashing Game Over text
          flashingText(ctx, stopRecursion, canvasWidth, canvasHeight);
          restart = true;
          //pauses game audio
          for (var i = 0; i < musicThemes[0].length; i++) {
            musicThemes[0][i].pause();
          }
          //starts game over audio
          gameOverAudio(userThemeChoice, musicThemes);
          $('#themes').prop('disabled', false);
          if (highScore < currentScore)
            highScore = currentScore;
          $("#highScore").text(highScore);
        } else {
          currentScore = snakeGuy.score;
          window.requestAnimationFrame(step);
        }
      });
    }
  });
});
