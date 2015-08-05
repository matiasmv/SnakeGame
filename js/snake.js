function Snake(board) {

  var directions = {
    left:1,
    top: 2,
    right:3,
    bottom:4
  };

  var blockCount = 0;
  var self = this;
  var isGraphicsActivated = true;
  //public
  this.init = init;
  this.start = start;
  this.grow = addSnakeBlock;
  this.move = moveSnake;
  this.body = [];
  this.lastDirection = null;
  this.lastHeadDirection = null;
  this.enableGraphics = enableGraphics;
  this.checkColitionsWithBoard = checkColitionsWithBoard;
  this.checkColitionsItself = checkColitionsItself;
  this.isHeadColitionWith = isSnakePartColitionWith.bind(this, function(){return 0;});
  this.isColitionWith = isSnakePartColitionWith.bind(this, getSnakeLength.bind(this));

  var temp = 0; //TODO: remove this.

  function getTop(element){
    return Number(element.css("top").replace("px", ""));
  }

  function getLeft(element){
    return Number(element.css("left").replace("px", ""));
  }

  function getSnakeLength(){
    return this.body.length;
  }

  //Colitions
  function isSnakePartColitionWith(getSnakeLength, elementTop, elementLeft, elementHeight, elementWidth){
    var colition;
    var i = 0;
    while(!colition && i < this.body.length){

      var part = this.body[i];
      var partTop = getTop(part);
      var partLeft = getLeft(part);
      var width = part.outerWidth(true);
      var height = part.outerHeight(true);

      colition =  Math.abs(partTop - elementTop) <= Math.max(height, elementHeight) &&
                  Math.abs(partLeft - elementLeft) <= Math.max(width, elementWidth);

      i++;
    }

    return colition;
  }

  function checkColitionsWithBoard(outOfBoardCallback){
    var head = getHead();
    var headTop = getTop(head);
    var headLeft = getLeft(head);
    var boardWidth = board.outerWidth(true);
    var boardHeight = board.outerHeight(true);

    var colition = headTop < 0 || headLeft < 0 ||
                    boardWidth < headLeft + head.outerWidth(true) ||
                    boardHeight < headTop + head.outerHeight(true);

    if(colition && outOfBoardCallback){
       outOfBoardCallback();
    }
  }

  function checkColitionsItself(colitionItselfCallback){
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

    if(colition && colitionItselfCallback ){
      colitionItselfCallback();
    }

  }

  function init(config){
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
     self.lastHeadDirection = directions.bottom;
     self.initialBodyLength = self.initialBodyLength || 3;
     self.lastDirection = null;

     deleteBody();

     for (var i = 0; i < self.initialBodyLength; i++) {
        self.grow();
     }
  }

  function rotateBlock(block, deg, zindex){
     block.css({
       "-ms-transform": "rotate("+deg+"deg)", /* IE 9 */
       "-webkit-transform": "rotate("+deg+"deg)", /* Safari */
       "transform": "rotate("+deg+"deg)",
       "z-index": zindex
     });

  }

  function addSnakeGraphics(snakeBlock){
    var graphic = $("<div>");
    var prevTail;
    var prevTailGraphic;

    if(self.body.length == 0){
        graphic.addClass("snakeHead");
    }
    else{
      prevTail = getTail();
      prevTailGraphic = prevTail.find("div.snakeTail");

      if( prevTailGraphic.hasClass("snakeTail") ){
        console.log("Entro a este if?");
        prevTailGraphic.removeClass("snakeTail").addClass("snakeBody");
        rotateBlock(prevTail, 0 ,20); //obtener esto de otro lado.
      }

      graphic.addClass("snakeTail");
      rotateTail(snakeBlock, getTop(snakeBlock), getLeft(snakeBlock));
    }
    snakeBlock.append(graphic);
  }

  function enableGraphics(turnOn){
    isGraphicsActivated = turnOn;

    for (var i = 0; i < self.body.length; i++) {
      toggleSnakeGraphics(self.body[i]);
    }
  }

  function toggleSnakeGraphics(block){

    block.find("div").css({
      display: isGraphicsActivated ? "block" : "none"
    });

    if(isGraphicsActivated){
       block.removeClass("snakeBlockNoGraphics");
    }
    else{
      block.addClass("snakeBlockNoGraphics");
    }

  }

  function addSnakeBlock(){

    console.log("New block was added to snake!!");
    blockCount++;
    var snakeBlock = $("<div>").attr({id:blockCount}).addClass("snakeBlock");

    board.append(snakeBlock);

    setInitialPostition(snakeBlock);
    addSnakeGraphics(snakeBlock);
    toggleSnakeGraphics(snakeBlock);

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
        tailTop = getTop(tail); //tail.offset().top;
        tailLeft = getLeft(tail); //tail.offset().left;

        direction = getDirection(tailTop, tailLeft);

        blockTop = tailTop + (-1) * getTopMovement(direction, block.outerHeight(true));
        blockLeft = tailLeft + (-1) * getLeftMovement(direction, block.outerWidth(true));

        setPosition(block, blockTop, blockLeft);
      }
  }

  function setPosition(element, top, left){
    element.css({ top: top, left: left });
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
      var prevToTailTop = getTop(prevToTail);
      var prevToTailLeft = getLeft(prevToTail);

      if(tailTop === prevToTailTop){
         direction = prevToTailLeft > tailLeft ? directions.right : directions.left;
      }
      else if (prevToTailLeft === tailLeft){
        direction = prevToTailTop > tailTop ? directions.bottom : directions.top;
      }
      else{
        console.log("No se encontro direction!!!!!");
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

  function changeHeadChangeDirection(){
    var head = getHead();
    var tail = getTail();
    var top = head.offset().top;
    var left = head.offset().left;
    var topMovement;
    var leftMovement;
    var prevElement = self.body[self.body.length -1];
    var topIncrement = head.outerHeight(true);
    var leftIncrement = head.outerWidth(true);

    topIncrement = prevElement.offset().top +  getTopMovement(self.lastDirection, topIncrement);
    leftIncrement = prevElement.offset().left + getLeftMovement(self.lastDirection, leftIncrement);
    setPosition(head, topMovement, leftMovement);
    self.lastHeadDirection = self.lastDirection;

  }

  function rotateTail(tail, top, left){
    var direction = getDirection(top, left);
    rotateBlock(tail, (direction - 4) * 90, 10);
  }

  function moveSnakeSameDirection(){
    var head = getHead();
    var tail = getTail();
    var top = getTop(head); // head.offset().top;
    var left = getLeft(head); // head.offset().left;
    var topMovement;
    var leftMovement;
    var prevElement = self.body[self.body.length -1];
    var topIncrement = head.outerHeight(true);
    var leftIncrement = head.outerWidth(true);

    topMovement = top + getTopMovement(self.lastDirection, topIncrement);
    leftMovement = left + getLeftMovement(self.lastDirection, leftIncrement);

    setPosition(head, topMovement, leftMovement);

    //Move body
    for (var i = 1; i < self.body.length; i++) {
        var part = self.body[i];
        var partTop = getTop(part); //part.offset().top;
        var partLeft = getLeft(part);  //part.offset().left;

        setPosition(part, top, left);

        rotateBlock(part, 0 ,20);
        if(head !== tail && part == tail){
          rotateTail(part, top, left);
        }

        top = partTop;
        left = partLeft;
    }

  }
  function isDirectionValid(){
    return  Math.abs(self.lastDirection - self.lastHeadDirection) != 2 ;
  }

  function moveSnake(){

    if(!self.lastDirection){
      return;
    }

    self.lastDirection = isDirectionValid() ? self.lastDirection :  self.lastHeadDirection;

    if(isDirectionChanged()){
      changeHeadChangeDirection();
    }
    else{
      moveSnakeSameDirection();
    }
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
         if(self.lastDirection == null){
           self.lastDirection = key;
           self.lastDirection = isDirectionValid() ? self.lastDirection : null;

         }else if(self.lastDirection == self.lastHeadDirection){
            self.lastDirection = key;
         }

         if(isDirectionValid() &&  self.lastDirection != self.lastHeadDirection){
            self.move();
         }
      }
  }

}
