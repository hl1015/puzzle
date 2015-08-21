/*****
 *
 *   holder.js
 *
 *****/

/*****
 *
 *   constructor
 *
 *****/
function Holder(id, game, x, y, line, column, moveble) {

  if(arguments.length > 0) {
    this.id = id;
    this.game = game;
    this.x = x;
    this.y = y;
    this.line = line;
    this.column = column;
    this.moveble = moveble;
  }
  else{
    this.id = 0;
    this.game = null;
    this.x = 0;
    this.y = 0;
    this.line = null;
    this.column = null;
    this.moveble = null;
  }
  this.occupied = false;
  
}

Holder.prototype.occupy = function(){
  var r = new Array();
  var dx, dy, distance;
  for(i = 0; i<this.game.holders.length; i++){
    dx = this.game.selected.x - this.game.holders[i].x;
    dy = this.game.selected.y - this.game.holders[i].y;
    distance = (dx * dx + dy * dy);
    if(distance <= this.game.selected.tolerance){
      this.game.holders[i].occupied = true;
      r.push(i);
    }
  }
  for(j = 0; j<this.game.selected.createdShapes.length; j++){
    for(i = 0; i<this.game.holders.length; i++){
    dx = this.game.selected.createdShapes[j].x - this.game.holders[i].x;
    dy = this.game.selected.createdShapes[j].y - this.game.holders[i].y;
    distance = (dx * dx + dy * dy);
    if(distance <= this.game.selected.tolerance){
      this.game.holders[i].occupied = true;
      r.push(i);
    }
    }
  }
  return r;
};

Holder.prototype.deOccupy = function(occupiedArray){
  for(i = 0; i<occupiedArray.length; i++){
    this.game.holders[occupiedArray[i]].occupied = false;
  }

};

Holder.prototype.draw = function() {
  this.game.context.lineWidth = 2;
  this.game.context.strokeRect(this.x-this.game.piece_width/2,this.y-this.game.piece_height/2,this.game.piece_width,this.game.piece_height);
};
