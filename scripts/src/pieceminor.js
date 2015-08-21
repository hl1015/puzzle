/*****
 *
 *   pieceminor.js
 *
 *****/

/*****
 *
 *   constructor
 *
 *****/
;function PieceMinor(id, game, width, height, x, y, startPoint, color, minorID /*, target, holder, moveble, placed*/) {
  if(arguments.length > 0) {
    this.id = id;
    this.game = game;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    //this.target = target;
    this.startPoint = startPoint;
    //this.holder = holder;
    //this.moveble = moveble;
    //this.placed = placed;
    this.moveble = false;
    //this.m = (target.y - this.y)/(target.x - this.x);
    //this.b = target.y - (this.m * target.x);
    this.pickedColor = color;
    this.minorID = minorID;
   // this.x = this.x*(this.pieceShape[2]+1);
   // this.y = this.y*(this.pieceShape[3]+1);
    if(Math.random() >= 0.5)
      this.p = 0.1;
    else
      this.p = -0.1;
  }
  else{
    this.id = 0;
    this.game = null;
    this.width = 10;
    this.height = 10;
    this.x = 0;
    this.y = 0;
    this.target = null;
    this.startPoint = null;
    this.minorID = null;
    //this.holder = null;
    //this.moveble = false;
    //this.placed = null;
    //this.pieceShape = null;
  }
  this.tolerance = 200;
  this.moving = false;
  this.placed = false;
  this.widthLegacy = this.width;
  this.heightLegacy = this.height;
  //this.width = this.width*(this.pieceShape[2]+1);
  //this.height = this.height*(this.pieceShape[3]+1);
      var colorRandom = Math.floor(Math.random()*6+1);
    //this.pickedColor = this.game.pickedColor;
}


PieceMinor.prototype.draw = function() {
  if((!this.game.moveble)&&(!this.game.placed)){
    //this.game.context.globalAlpha = 1
    //this.game.context.clearRect(0, 0, game.canvas.width, game.canvas.height);
    //this.game.context.clearRect(Math.round(this.startPoint.x-this.game.piece_width/2), Math.round(this.startPoint.y-this.game.piece_height/2), this.game.piece_width, this.game.piece_height);
    //this.game.context.fillRect(Math.round(this.startPoint.x-this.game.piece_width/2), Math.round(this.startPoint.y-this.game.piece_height/2), this.game.piece_width, this.game.piece_height);
    
    //this.game.context.drawImage(this.game.context_bg.getImageData(Math.round(this.startPoint.x-this.game.piece_width/2), Math.round(this.startPoint.y-this.game.piece_height/2), this.game.piece_width, this.game.piece_height), Math.round(this.startPoint.x-this.game.piece_width/2), Math.round(this.startPoint.y-this.game.piece_height/2), this.game.piece_width, this.game.piece_height, Math.round(this.startPoint.x-this.game.piece_width/2), Math.round(this.startPoint.y-this.game.piece_height/2), this.game.piece_width, this.game.piece_height );
    //this.game.context.putImageData(this.game.context_bg.getImageData(Math.round(this.startPoint.x-this.game.piece_width/2), Math.round(this.startPoint.y-this.game.piece_height/2), this.game.piece_width, this.game.piece_height), Math.round(this.startPoint.x-this.game.piece_width/2), Math.round(this.startPoint.y-this.game.piece_height/2));
    
    //this.p = this.p*1.1;
    //this.startPoint.x = this.startPoint.x + this.p;
    //this.startPoint.y = this.m * this.startPoint.x + this.b;
    /*
    if((this.startPoint.x > (this.game.canvas.width/this.scale)-this.game.img.width/this.game.num_lines) || 
      (this.startPoint.y > (this.game.canvas.height/this.scale)-this.game.img.height/this.game.num_lines) || 
      (this.startPoint.x < this.game.img.width/this.game.num_lines) || 
      (this.startPoint.y < this.game.img.height/this.game.num_lines)){
    */
    this.x= this.game.x+(((this.minorID%5)-2)*this.width);
    this.y = this.game.y+(((Math.floor(this.minorID/5))-2)*this.height);
    this.startPoint.x = this.game.startPoint.x+(((this.minorID%5)-2)*this.width);
    this.startPoint.y = this.game.startPoint.y+(((Math.floor(this.minorID/5))-2)*this.height);
   
    //this.game.context.save();
    //this.game.context.globalAlpha = 1;
    //this.game.context.beginPath();
    
    //this.game.context.putImageData(this.game.context_bg.getImageData(Math.round(this.startPoint.x-this.game.piece_width/2), Math.round(this.startPoint.y-this.game.piece_height/2), this.game.piece_width, this.game.piece_height), Math.round(this.startPoint.x-this.game.piece_width/2), Math.round(this.startPoint.y-this.game.piece_height/2));
    //this.game.context.globalAlpha = 1

    this.game.game.context.fillStyle=this.pickedColor;
     this.game.game.context.fillRect(this.startPoint.x-this.game.game.piece_width/2, this.startPoint.y-this.game.game.piece_height/2,this.game.game.piece_width, this.game.game.piece_height);

 //   this.game.context.drawImage(this.game.img, this.holder.column*this.game.piece_width, this.holder.line*this.game.piece_height, this.game.piece_width, this.game.piece_height, 
   //   this.startPoint.x-this.game.piece_width/2, this.startPoint.y-this.game.piece_height/2, this.game.piece_width*(this.pieceShape[2]+1), this.game.piece_height*(this.pieceShape[3]+1));

  }
  else{
    this.x= this.game.x+(((this.minorID%5)-2)*this.width);
    this.y = this.game.y+(((Math.floor(this.minorID/5))-2)*this.height);
    this.startPoint.x = this.game.startPoint.x+(((this.minorID%5)-2)*this.width);
    this.startPoint.y = this.game.startPoint.y+(((Math.floor(this.minorID/5))-2)*this.height);
    //this.game.context.save();
    
    //if(this.placed)
     // this.game.context.globalAlpha = 1
    //else if(!this.game.is_over)
      //this.game.context.globalAlpha = 0.8
    //else
      //this.game.context.globalAlpha = 1
  
    //this.game.context.fillStyle = "rgba(255, 255, 255, 0.5)";
    //over = this.game.mouse.isOverPiece(this);
  
    /*  
    if(!this.game.selected){
      if((!this.game.over)||(this.game.over.id < this.id)||(this.mouse_is_over())){
        if(this.mouse_is_over()){
          this.game.over = this;
        }
      }
    }
    */
  
    //if(this == this.game.selected){
      //this.game.context.fillStyle = "rgba(0, 0, 255, 0.1)";
    //}
    //else if(this.game.over == this)
      //this.game.context.fillStyle = "rgba(255, 0, 0, 0.1)";
  
    //target distance
    //if((this.game.selected == this)&&(this.near())){
      //this.game.context.fillStyle = "rgba(0, 255, 0, 0.1)";
      //if((this.game.auto_snap == true)&&(!this.placed)){
        //place
        //this.game.selected.x = this.game.selected.target.x;
        //this.game.selected.y = this.game.selected.target.y;
        //this.game.selected.placed = true;
        //this.game.selected.moveble = false;
        //this.game.placed_pieces.push(this.game.selected);
        //if(this.game.drip.currentTime != 0)
          //this.game.drip.currentTime = 0;
        //this.game.drip.play();
      //}
    //}
  
    //piece.draw();
    //this.game.context.beginPath();
    //this.game.context.fillRect(Math.round(this.startPoint.x-this.game.piece_width/2), Math.round(this.startPoint.y-this.game.piece_height/2), this.game.piece_width, this.game.piece_height);
    /*
    this.game.context.drawImage(this.game.img, this.holder.column*this.game.piece_width, this.holder.line*this.game.piece_height, this.game.piece_width, this.game.piece_height, 
      Math.round(this.x-this.game.piece_width/2), Math.round(this.y-this.game.piece_height/2), this.game.piece_width, this.game.piece_height);
    */this.game.game.context.fillStyle=this.pickedColor;
    this.game.game.context.fillRect(this.x-this.game.game.piece_width/2, this.y-this.game.game.piece_height/2, this.game.game.piece_width, this.game.game.piece_height);

  
    if(!this.game.is_over){
      //this.game.context.strokeRect(this.x-this.width/2,this.y-this.height/2,this.width,this.height);
      //this.game.context.fillRect(this.x-this.width/2,this.y-this.height/2,this.width,this.height);
      //this.game.context.globalAlpha = 1
      //this.game.context.fillStyle = "rgba(0, 0, 0, 1)";
      //this.game.context.fillText(this.id, this.x-3, this.y+3);
    }
    
    //this.game.context.closePath();
    //this.game.context.restore();
  }
  
  if(this.game.debug)
    console.log('pieace: '+this.id+' drew');
}

//Piece.prototype.near = function() {
//  //target distance
//  var r = false
//  var dx = this.x - this.target.x;
//  var dy = this.y - this.target.y;
//  var distance = (dx * dx + dy * dy);
//  if(distance <= this.tolerance){
//    r = true;
//  }
//  if(this.game.debug){
//    console.log(this.id+': '+distance)
//  }
//  return r;
//}

PieceMinor.prototype.mouse_is_over = function() {
  return this.game.game.mouse.isOverPiece(this);
}