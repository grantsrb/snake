# Snake Game

### Elysia Avery Nason, Joanna Anderson, Sandro Alvarez, and Satchel Grant, 08.30.16

## Description

A classic game of Snake with a modern twist.

See the website [here](https://rawgit.com/grantsrb/snake/master/index.html)

## Specifications

Input Behavior | Input | Output
---------------|-------|--------
A pixel that responded to arrow keys | ----> | pixel moves right
Pixel can be moved in a different direction | ^ | pixel can be moved up after being moved right
Pixel cannot move in opposite direction of current direction | --> | --> / <--
Pixel will have a constant movement in direction indicated | --> | -- -- -- --->
Each pixel in 'snake' body will inherit movement at a given mark along the x, y axis | x: 300, y: 200 | each pixel moves at that place
Game will plot an item in random x, y coordinates | math.floor(math.random()) | ooooXoooo
When item is consumed by 'snake', it's body will increase in length | this.bits.push(tailBit); | [][][][]
Item regenerates after being consumed in random location | if(snakeGuy.bits[0].xc === itemX  && snakeGuy.bits[0].yc === itemY) | N/A
Each item collected will increase documented score | item consumed | user.score += 10
When 'snake' hits a canvas boundary, game ends | snake = boundary(xCoordinate) | Game Over !
When snake hits itself, game over | snakeHead(xCoordinate) = body(xCoordinate) | Game Over !
Different items, allow for different game settings | redItem = speedUp | snake increases speed

## Setup/Installation Requirements ##

To use this program, you will need:

* Go to our [Github Page](https://github.com/grantsrb/snake)
* Access Terminal
* Execute following command on your desktop: $git clone https://github.com/grantsrb/snake

## GitHub Pages ##

This game can be viewed on GitHub Pages [here](https://grantsrb.github.io/snake/).

## Known Bugs ##

There are no known bugs at this time.

## Support and Contact Details ##

Please report any bugs or issues to elysia.avery@gmail.com, joanna.saerom.anderson@gmail.com, sandromateo22@gmail.com, grantsrb@gmail.com.

## Technologies Used ##

* HTML
* CSS
* Bootstrap
* JavaScript
* jQuery
* Atom

### Legal

Copyright (c) 2016 Elysia Avery Nason, Joanna Anderson, Sandro Alvarez, Satchel Grant

Licensed under the MIT license
