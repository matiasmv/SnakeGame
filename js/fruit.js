function Fruit(board, boardWidth, boardHeight){
    var self = this;

    this.body = $("<div>").addClass("fruitBlock");

    this.remove = remove;
    this.draw = draw;
    this.enableGraphics = enableGraphics;
    this.setPositionRelativeToBoard = setPositionRelativeToBoard;

    function setPositionRelativeToBoard(){

      this.top = getRandomValue(boardHeight);
      this.left = getRandomValue(boardWidth);
      this.width = this.body.outerWidth(true);
      this.height = this.body.outerHeight(true);

      while(this.top + this.height > boardHeight){
        console.log("Recalculating a new top for Fuit");
        this.top = getRandomValue(boardHeight);
      }

      while(this.left + this.width > boardWidth){
        console.log("Recalculating a new left for Fuit");
        this.left = getRandomValue(boardWidth);
      }

      this.body.css({
        top: this.top+"px",
        left: this.left+"px"
      });

    }

    function draw(turnOnGraphics){
      board.append(this.body);
      addFruitGraphics(this.body);
      enableGraphics(turnOnGraphics);
    }

    function addFruitGraphics(body){
      var randomFruitNumber = getRandomValue(4);
      var graphic = $("<div>");
      body.append(graphic);
      graphic.addClass("fruit"+randomFruitNumber);
    }

    function enableGraphics(turnOn){
      self.body.find("div").css({
        display: turnOn ? "block" : "none"
      });

      if(turnOn){
          self.body.removeClass("fruitNoGraphics");
      }
      else{
          self.body.addClass("fruitNoGraphics");
      }
    }

    function remove(){
        this.body.remove();
    }

    function getRandomValue(number){
       return Math.floor(Math.random() * number) + 1
    }
}
