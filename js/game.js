
var Snake = function () {
  var self = this;
  this.board = null;
  this.body = [];
  this.speed = 10;
  this.lastDirection = null;

  function init(config){
      this.board = config.board;
      this.addBlock();
      wireup();
      setInterval(this.move, 100);
      setInterval(this.addBlock, 500);
  }

  function addSnakeBlock(){
    console.log("New block was added to snake!!");

    var snakeBlock = $("<div>").addClass("snakeBlock");
    self.body.push(snakeBlock);
    self.board.append(snakeBlock);
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

    head.offset({
      top: top + (self.lastDirection == 2 ? -1 : 1) * (self.lastDirection % 2 == 0 ? self.speed : 0),
      left: left + (self.lastDirection == 1 ? -1 : 1) * (self.lastDirection % 2 != 0 ? self.speed : 0)
    });

    //move body
    for (var i = 1; i < self.body.length; i++) {
        var part = self.body[i];
        var prevPartTop = part.offset().top;
        var prevPartLeft = head.offset().left;

        part.css({ top: top, left: left})

        top = prevPartTop;
        left = prevPartLeft;
    }
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
