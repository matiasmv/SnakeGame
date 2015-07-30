
function Snake() {

  var directions = {
    left:1,
    top: 2,
    right:3,
    bottom:4
  };

  var blockCount = 0;
  var self = this;
  this.initialBodyLength;
  this.board = null;
  this.body = [];
  this.lastDirection = null;
  this.lastHeadDirection = null;

  var temp = 0; //TODO: remove this.

  function isSnakeColitionWith(elementTop, elementLeft, elementHeight, elementWidth){
    var colition;
    var head = getHead();
    var headTop = head.offset().top;
    var headLeft = head.offset().left;
    var width = head.outerWidth(true);
    var height = head.outerHeight(true);

    colition =  Math.abs(headTop - elementTop) < Math.max(height, elementHeight) &&
                Math.abs(headLeft - elementLeft) < Math.max(width, elementWidth);

    return colition;
  }

  function checkColitionsItself(){
    var colition = false;
    var head = getHead();
    var headTop = head.offset().top;
    var headLeft = head.offset().left;
    var width = head.outerWidth(true);
    var height = head.outerHeight(true);
    var part;
    var partTop;
    var partLeft;
    var i = 1;

    while(!colition && i <  self.body.length){
      part = self.body[i];
      partTop = part.offset().top;
      partLeft = part.offset().left;

      colition =  (headTop <= partTop &&
                  partTop < headTop + height &&
                  headLeft <= partLeft &&
                  partLeft < headLeft + width)
      i++;
    }

    if(colition && self.colitionItselfCallback ){
      self.colitionItselfCallback();
    }

  }

  function init(config){
      this.board = config.board;
      this.colitionItselfCallback = config.colitionItselfCallback;
      this.initialTop = config.initialTop;
      this.initialLeft = config.initialLeft;
      wireup();
  }

  function start(){
     restart();
  }

  function deleteBody(){
      for (var i = 0; i < self.body.length; i++) {
        var part = self.body[i];
        part.remove();
      }
      self.body = [];
  }

  function restart(){
     self.initialBodyLength = self.initialBodyLength || 3;
     self.lastDirection = null;

     deleteBody();

     for (var i = 0; i < self.initialBodyLength; i++) {
        self.grow();
     }
  }

  function addSnakeBlock(){

    console.log("New block was added to snake!!");

    var snakeBlock = $("<div>").attr({id:blockCount}).addClass("snakeBlock");
    blockCount++;

    self.board.append(snakeBlock);

    setInitialPostition(snakeBlock);

    self.body.push(snakeBlock);
  }

  function setInitialPostition(block){
      var tail;
      var tailTop;
      var tailLeft;
      var blockTop;
      var blockLeft;
      var direction;

      setPosition(block, self.initialTop, self.initialLeft);

      if(self.body.length > 0){

        tail = getTail();
        tailTop = tail.offset().top;
        tailLeft = tail.offset().left;

        direction = getDirection(tailTop, tailLeft);

        blockTop = tailTop + (-1) * getTopMovement(direction, tail.outerHeight(true));
        blockLeft = tailLeft + (-1) * getLeftMovement(direction, tail.outerWidth(true));

        setPosition(block, blockTop, blockLeft);

      }
  }

  function setPosition(element, top, left){

    element.offset({ top: top, left: left });

  }

  function getDirection(e1Top, e1Left, e2Top, e2Left){
    var direction = null;

    if(self.body.length > 1){

      if(e1Top === e2Top){
         direction = e1Left > e2Left ? directions.right : directions.left;
      }
      else if (e1Left === e2Left){
        direction = e1Top > e2Top ? directions.bottom : directions.top;
      }
    }

    return direction;
  }

  function getDirection(tailTop, tailLeft){
    var direction = self.lastDirection || directions.bottom;

    if(self.body.length > 1){

      var prevToTail =  getPrevToTail();
      var prevToTailTop = prevToTail.offset().top;
      var prevToTailLeft = prevToTail.offset().left;

      if(tailTop === prevToTailTop){
         direction = prevToTailLeft > tailLeft ? directions.right : directions.left;
      }
      else if (prevToTailLeft === tailLeft){
        direction = prevToTailTop > tailTop ? directions.bottom : directions.top;
      }
    }

    return direction;
  }

  function getHead(){
    return self.body[0];
  }

  function getTail(){
    return self.body[self.body.length -1];
  }

  function getPrevToTail(){
    return self.body[self.body.length -2];
  }

  function drawSnake(board){
    for(var part in this.body){
      //board.add(part);
    }
  }

  function moveSnake(){
    console.log("Snake moving...");

    if(!self.lastDirection){
      return;
    }

    //move head
    var head = self.body[0];
    var top = head.offset().top;
    var left = head.offset().left;
    var topMovement;
    var leftMovement;

    var topIncrement = head.outerHeight(true);
    var leftIncrement = head.outerWidth(true);

    self.lastDirection = Math.abs(self.lastDirection - self.lastHeadDirection) == 2 ? self.lastHeadDirection : self.lastDirection;

    if(isDirectionChanged()){
      var prevElement = self.body[self.body.length -1];

      topIncrement = prevElement.offset().top +  getTopMovement(self.lastDirection, topIncrement);
      leftIncrement = prevElement.offset().left + getLeftMovement(self.lastDirection, leftIncrement);
      setPosition(head, topMovement, leftMovement);
      self.lastHeadDirection = self.lastDirection;
    }
    else{
        topMovement = top + getTopMovement(self.lastDirection, topIncrement);
        leftMovement = left + getLeftMovement(self.lastDirection, leftIncrement);

        setPosition(head, topMovement, leftMovement);

        //Move body
        for (var i = 1; i < self.body.length; i++) {
            var part = self.body[i];
            var partTop = part.offset().top;
            var partLeft = part.offset().left;

            setPosition(part, top, left);

            top = partTop;
            left = partLeft;
        }
    }

    checkColitionsItself();

  }

  function isDirectionChanged(){
    return self.lastDirection !== self.lastHeadDirection && self.body.length > 1;
  }

  function directionSign(direction){
    return (direction == 2 || direction == 1) ? -1 : 1;
  }

  function getTopMovement(direction, increment){
      return directionSign(direction) * (direction % 2 == 0 ? increment : 0)
  }

  function getLeftMovement(direction, increment){
      return directionSign(direction) * (direction % 2 != 0 ? increment : 0)
  }

  function wireup(){
    $("body").keydown(keydownFunction)
  }

  function keydownFunction(e){
      var key = e.keyCode;

      if(key >= 37 && key <= 40){
        // direction 1 - left, 2-top, 3-right, 4-bottom
         key = key - 36;
         self.lastDirection = key;
         self.move();
      }
  }

  //public
  this.init = init;
  this.start = start;
  this.grow = addSnakeBlock;
  this.draw = drawSnake;
  this.move = moveSnake;
  this.colitionItselfCallback = function(){};
  this.isSnakeColitionWith = isSnakeColitionWith;

};

function Fruit(board, boardSize){

    this.board = board;
    this.body = $("<div>").addClass("fruit");
    this.top = getRandomValue(boardSize);
    this.left = getRandomValue(boardSize);
    this.width = this.body.outerWidth(true);
    this.height = this.body.outerHeight(true);
    this.remove = remove;
    this.draw = draw;

    function draw(){
      board.append(this.body);
      this.body.offset({
        top: this.top,
        left: this.left
      });
    }

    function remove(){
        this.body.remove();
    }

    function getRandomValue(boardSize){
       return Math.floor(Math.random() * boardSize) + 1
    }
}


var game = (function(){

  var selectors={
    board: '.board',
    gameOverMessage: ".gameOverMessage",
    newGameButton: "#NewGameButton",
  };

  var speed = 100;
  var snake = new Snake();
  var board = $(selectors.board);
  var boardSize = board.outerWidth(true);
  var gameLoop;
  var lastFruit = null;


  function init(config){
    console.log("Starting game");

    config.board = board;
    config.colitionItselfCallback = endGame;
    snake.init(config);

    $(selectors.newGameButton).click(startNewGame);
  }

  function endGame(){
    showGameOverMensage();
    stopGameLoop();
  }

  function startNewGame(){
      lastFruit = new Fruit(board, boardSize);
      lastFruit.draw();
      hideGameOverMensage();
      startGameLoop();
  }

  function hideGameOverMensage(){
      var  gameOverMessage = $(selectors.gameOverMessage);
      gameOverMessage.css({display: "none"})
  }

  function showGameOverMensage(){
      var  gameOverMessage = $(selectors.gameOverMessage);
      gameOverMessage.css({display: "block"})
  }

  function stopGameLoop(){
    clearInterval(gameLoop);
  }

  function startGameLoop(){
     snake.start();

     if(gameLoop){
       stopGameLoop();
     }

     gameLoop = setInterval(function(){

       snake.move();

       if(snake.isSnakeColitionWith(lastFruit.top, lastFruit.left, lastFruit.height, lastFruit.width)){
          lastFruit.remove();
          lastFruit = new Fruit(board, boardSize);
          lastFruit.draw();
          snake.grow();
       }

     }, speed);
   }

  return {
    init: init,
    startNewGame: startNewGame,
  };

})();

$(document).ready(function(){
  game.init({
    initialTop: 300,
    initialLeft: 200,

  });
});
