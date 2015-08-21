/*****
 *
 *   startHolder.js
 *
 *****/

/*****
 *
 *   constructor
 *
 *****/
;function StartHolder(id, game, x, y, line, column) {

  if(arguments.length > 0) {
    this.id = id;
    this.game = game;
    this.x = x;
    this.y = y;
    this.line = line;
    this.column = column;
  }else{
    this.id = 0;
    this.game = null;
    this.x = 0;
    this.y = 0;
    this.line = null;
    this.column = null;
  }
 
  
}

StartHolder.prototype.draw = function() {
  //this.game.context.lineWidth = 2;
  //this.game.context.strokeRect(this.x-this.game.piece_width/2,this.y-this.game.piece_height/2,this.game.piece_width,this.game.piece_height);
};
