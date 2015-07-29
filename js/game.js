
var Snake = function () {

  var directions = {
    left:1,
    top: 2,
    right:3,
    bottom:4
  };
  var blockCount = 0;
  var self = this;
  this.board = null;
  this.body = [];
  this.speed = 3;
  this.lastDirection = null;
  this.lastHeadDirection = null;

  var temp = 0; //TODO: remove this.

  function init(config){
      this.board = config.board;
      this.addBlock();
      this.addBlock();
      this.addBlock();
      wireup();
      setInterval(this.move, 100);

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

  function getDirection(tailTop, tailLeft){
    var direction = self.lastDirection || directions.bottom;

    if(self.body.length > 1){

      var prevToTail =  getPrevToTail();
      var prevToTailTop = prevToTail.offset().top;
      var prevToTailLeft = prevToTail.offset().left;

      if(tailTop === prevToTailTop){
         direction = prevToTailLeft > tailLeft ? directions.right : directions.left;
      }
      else{
        direction = prevToTailTop > tailTop ? directions.bottom : directions.top;
      }

    }

    return direction;
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

    var topIncrement = self.speed;
    var leftIncrement = self.speed;

    if(self.lastDirection !== self.lastHeadDirection && self.body.length > 1){
        topIncrement = head.outerHeight(true);
        leftIncrement = head.outerWidth(true);
    }

    topMovement = top + getTopMovement(self.lastDirection, topIncrement);
    leftMovement = left + getLeftMovement(self.lastDirection,leftIncrement);
    setPosition(head, topMovement, leftMovement);

    //move body
    for (var i = 1; i < self.body.length; i++) {
        var part = self.body[i];
        var partTop = part.offset().top;
        var partLeft = part.offset().left;

        var direction = getDirection(partTop, partLeft);



        setPosition(part, top, left);

        top = prevPartTop;
        left = prevPartLeft;
    }

    self.lastHeadDirection = lastDirection;
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

  this.init = init;
  this.addBlock = addSnakeBlock;
  this.draw = drawSnake;
  this.move = moveSnake;

};



var game = (function(){

  var selectors={
    board: '.board',
  };

  var snake = new Snake();
  var board = $(selectors.board);


  function init(config){
    config.board = board;
    console.log("Starting game");
    snake.init(config);
  }



  function draw(){
    console.log("game draw was called");
     //cleanBoard();
     snake.draw(board);
  }

  return {
    init: init
  };

})();

$(document).ready(function(){
  game.init({});
});
