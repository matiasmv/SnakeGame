function Game(){

  var selectors={
    board: '.board',
    gameOverMessage: ".gameOverMessage",
    newGameButton: "#newGameButton",
    graphicToggleButton: "#graphicToggle",
    scoreLabel: "#score",
    shareButton: "#shareButton"
  };

  var isGraphicsActivated = true;
  var speed = 100;
  var snake;
  var board = $(selectors.board);
  var boardWidth = board.width();
  var boardHeight = board.height()
  var gameLoop;
  var lastFruit = null;
  var scoreLabel = $(selectors.scoreLabel);
  var score = 0;

  function init(config){
    console.log("Starting game");

    snake = new Snake(board);
    snake.init(config);

    $(selectors.newGameButton).click(startNewGame);
    $(selectors.graphicToggleButton).click(toggleGraphics)
  }

  function toggleGraphics(){
      isGraphicsActivated = !isGraphicsActivated;

      snake.enableGraphics(isGraphicsActivated);
      if(lastFruit) {
        lastFruit.enableGraphics(isGraphicsActivated);
      }

      $(selectors.graphicToggleButton).find("span").text( isGraphicsActivated ? "ON" : "OFF");
  }

  function endGame(){
    stopGameLoop();
    showGameOverMensage();
  }

  function updateScoreLabel(){
    scoreLabel.text(score);
  }


  function startNewGame(){
      score = 0;
      updateScoreLabel();
      hideGameOverMensage();
      startGameLoop();
      addNewFruit(); // add the first fruit after the game loop start
  }

  function addNewFruit(){

    if(lastFruit){
      lastFruit.remove();
    }

    lastFruit = new Fruit(board, boardWidth, boardHeight);
    lastFruit.draw(isGraphicsActivated);
    lastFruit.setPositionRelativeToBoard();

    while(snake.isSnakeColitionWith(lastFruit.top, lastFruit.left, lastFruit.height, lastFruit.width)){
      lastFruit.setPositionRelativeToBoard();
    }
  }

  function hideGameOverMensage(){
      var  gameOverMessage = $(selectors.gameOverMessage);
      gameOverMessage.css({display: "none"})
  }

  function showGameOverMensage(){
      var  gameOverMessage = $(selectors.gameOverMessage);
      gameOverMessage.show("medium");
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
       snake.checkColitionsWithBoard(endGame);
       snake.checkColitionsItself(endGame);

       if(snake.isSnakeColitionWith(lastFruit.top, lastFruit.left, lastFruit.height, lastFruit.width)){
         snake.grow();
         addNewFruit();
         score++;
         updateScoreLabel();
       }
     }, speed);
   }

  return {
    init: init,
    startNewGame: startNewGame,
  };

}
