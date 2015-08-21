/*****
 *
 *   piece.js
 *
 *****/

/*****
 *
 *   constructor
 *
 *****/
;function Piece(id, game, width, height, x, y, startPoint, target, holder, moveble, placed, pieceShape, startHolder) {
  if(arguments.length > 0) {
    this.id = id;
    this.game = game;
    this.width = width;
    this.height = height;
    this.x = Math.round(x);
    this.y = Math.round(y);
    this.target = target;
    this.startPoint = new Point2D(target.x,target.y);
    this.holder = holder;
    this.moveble = moveble;
    this.placed = placed;
    this.moveble = false;
    this.pieceShape = pieceShape;
    this.m = (target.y - this.y)/(target.x - this.x);
    this.b = target.y - (this.m * target.x);
   // this.x = this.x*(this.pieceShape[2]+1);
   // this.y = this.y*(this.pieceShape[3]+1);
    this.p = 0.1;
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
    this.holder = null;
    this.moveble = false;
    this.placed = null;
    this.pieceShape = null;
  }
  this.offsetx = Math.round(this.game.scaled_width-(this.game.img_width)/2);
  this.offsety = Math.round(this.game.scaled_height-(this.game.img_height)/2);
  var tempX, tempY, tempStartX, tempStartY, minorID;
  this.offsety += 26;
  this.tolerance = 4000/this.game.num_lines;
  this.moving = false;
  this.placed = false;
  this.widthLegacy = this.width;
  this.heightLegacy = this.height;
  this.createdShapes = new Array();
  this.occupiedinfo = null;
  this.startHolder = startHolder;
  this.check1 = false;
  this.check2 = false;
  //this.width = this.width*(this.pieceShape[2]+1);
  //this.height = this.height*(this.pieceShape[3]+1);
  var colorRandom = Math.floor(Math.random()*15+1);
  this.pickedColor;
  if(colorRandom ==1){
    this.pickedColor = "#2F15D4";
  }else if(colorRandom ==2){
    this.pickedColor = "#D42F15";
  }else if(colorRandom ==3){
    this.pickedColor = "#F27A18";
  }else if(colorRandom ==4){
    this.pickedColor = "#15D42F";
  }else if(colorRandom ==5){
    this.pickedColor = "#F7F716";
  }else if(colorRandom ==6){
    this.pickedColor = "#FF00E1";
  }else if(colorRandom ==7){
    this.pickedColor = "#B728FA";
  }else if(colorRandom ==8){
    this.pickedColor = "#8CFF00";
  }else if(colorRandom ==9){
    this.pickedColor = "#0EE6E6";
  }else if(colorRandom ==10){
    this.pickedColor = "#FA4B88";
  }else if(colorRandom ==11){
    this.pickedColor = "#9C4970";
  }else if(colorRandom ==12){
    this.pickedColor = "#3B4AED";
  }else if(colorRandom ==13){
    this.pickedColor = "#134A28";
  }else if(colorRandom ==14){
    this.pickedColor = "#A16C28";
  }else{
    this.pickedColor = "#000000";
  }
  //this.pickedColor = this.getRandomColor();

  for(var i = 1; i<this.pieceShape[2].length; i++){
    tempX = this.x+(((this.pieceShape[2][i]%5)-2)*this.width);
    tempY = this.y+(((Math.floor(this.pieceShape[2][i]/5))-2)*this.height);
    tempStartX = this.startPoint.x+(((this.pieceShape[2][i]%5)-2)*this.width);
    tempStartY = this.startPoint.y+(((Math.floor(this.pieceShape[2][i]/5))-2)*this.height);
    minorID = this.pieceShape[2][i];
    this.createdShapes[i-1] = new PieceMinor(
      i,
      this,
      this.width,
      this.height,
      tempX,
      tempY,
      new Point2D(tempStartX,tempStartY),
      this.pickedColor,
      minorID
      );
  }

}

//Piece.prototype.getRandomColor= function() {
//    var letters = '0123456789ABCDEF'.split('');
//    var color = '#';
//    do{
//      for (var i = 0; i < 6; i++ ) {
//        color += letters[Math.floor(Math.random() * 16)];
//      }
//    }while(color === "#7D7D7D" || color === "#545454" || color === "#7A7A7A" || color === "#7F7F7F" || color === "#787878" || color === "#828282" || color === "#D7D7D7");
//    return color;
//};

Piece.prototype.draw = function() {
  if((!this.moveble)&&(!this.placed)){
    this.game.context.globalAlpha = 1;
    //this.game.context.clearRect(0, 0, game.canvas.width, game.canvas.height);
    //this.game.context.clearRect(Math.round(this.startPoint.x-this.game.piece_width/2), Math.round(this.startPoint.y-this.game.piece_height/2), this.game.piece_width, this.game.piece_height);
    //this.game.context.fillRect(Math.round(this.startPoint.x-this.game.piece_width/2), Math.round(this.startPoint.y-this.game.piece_height/2), this.game.piece_width, this.game.piece_height);
    
    //this.game.context.drawImage(this.game.context_bg.getImageData(Math.round(this.startPoint.x-this.game.piece_width/2), Math.round(this.startPoint.y-this.game.piece_height/2), this.game.piece_width, this.game.piece_height), Math.round(this.startPoint.x-this.game.piece_width/2), Math.round(this.startPoint.y-this.game.piece_height/2), this.game.piece_width, this.game.piece_height, Math.round(this.startPoint.x-this.game.piece_width/2), Math.round(this.startPoint.y-this.game.piece_height/2), this.game.piece_width, this.game.piece_height );
    //this.game.context.putImageData(this.game.context_bg.getImageData(Math.round(this.startPoint.x-this.game.piece_width/2), Math.round(this.startPoint.y-this.game.piece_height/2), this.game.piece_width, this.game.piece_height), Math.round(this.startPoint.x-this.game.piece_width/2), Math.round(this.startPoint.y-this.game.piece_height/2));
    
    this.p = this.p*1.05;
   // this.startPoint.x = this.startPoint.x + this.p;
   // this.startPoint.y = this.m * this.startPoint.x + this.b;
    if(this.startPoint.x > this.x){
      this.startPoint.x -= this.p;
    }
    if(this.startPoint.x < this.x){
      this.startPoint.x += this.p;
    }
    if(this.startPoint.y > this.y){
      this.startPoint.y -= this.p;
    }
    if(this.startPoint.y < this.y){
      this.startPoint.y += this.p;
    }

    if((this.startPoint.x >= this.x) && (this.startPoint.x < (this.x+60)) && (!this.check1)){
      this.startPoint.x = this.x;
      this.check1 = true;
    //  alert("ID: "+this.id+"; CHECKED X");
    //  console.log("ID: "+this.id+"; CHECKED X");
    }
    if((this.startPoint.x <= this.x) && (this.startPoint.x > (this.x-60)) && (!this.check1)){
      this.startPoint.x = this.x;
      this.check1 = true;
    //  alert("ID: "+this.id+"; CHECKED X")
    //  console.log("ID: "+this.id+"; CHECKED X");
    }
    if((this.startPoint.y >= this.y) && (this.startPoint.y < (this.y+60)) && (!this.check2)){
      this.startPoint.y = this.y;
      this.check2 = true;
    //  alert("ID: "+this.id+"; CHECKED Y")
    //  console.log("ID: "+this.id+"; CHECKED Y");
    }
    if((this.startPoint.y <= this.y) && (this.startPoint.y > (this.y-60)) && (!this.check2)){
      this.startPoint.y = this.y;
      this.check2 = true;
    //  alert("ID: "+this.id+"; CHECKED Y")
    //  console.log("ID: "+this.id+"; CHECKED Y");
    }
    if(this.check1 && this.check2){
    //  console.log("ID: "+this.id+"; DONE");
      this.moveble = true;
      this.iniPoint = new Point2D(this.x,this.y);
    }
    /*
    if((this.startPoint.x > (this.game.canvas.width/this.scale)-this.game.img.width/this.game.num_lines) || 
      (this.startPoint.y > (this.game.canvas.height/this.scale)-this.game.img.height/this.game.num_lines) || 
      (this.startPoint.x < this.game.img.width/this.game.num_lines) || 
      (this.startPoint.y < this.game.img.height/this.game.num_lines)){
    */
  //  if((this.startPoint.x+this.width >= (this.game.canvas.width/this.game.scale)) || 
  //    (this.startPoint.y+this.height >= (this.game.canvas.height/this.game.scale)) || 
  //    (this.startPoint.x-this.width <= 0) || 
  //    (this.startPoint.y-this.height <= 60)){
  //    this.moveble = true;
  //    this.x = this.startPoint.x;
  //    this.y = this.startPoint.y;
  //    this.iniPoint = new Point2D(this.x,this.y)
  //  }
  // if((this.startPoint.x+this.width/2 >= (this.game.canvas.width/this.game.scale-(this.offsetx-this.game.piece_width/2))) || 
  //   (this.startPoint.y+this.height/2 >= (this.game.canvas.height/this.game.scale-(this.offsety-this.game.piece_height/2))) || 
  //   (this.startPoint.x+this.width <= (this.offsetx+this.game.piece_width/2)) || 
  //   (this.startPoint.y+this.height <= (this.offsety+this.game.piece_height/2))){
  //   this.moveble = true;
  //   this.x = this.startPoint.x;
  //   this.y = this.startPoint.y;
  //   this.iniPoint = new Point2D(this.x,this.y)
  // }
   
    //this.game.context.save();
    //this.game.context.globalAlpha = 1;
    //this.game.context.beginPath();
    
    //this.game.context.putImageData(this.game.context_bg.getImageData(Math.round(this.startPoint.x-this.game.piece_width/2), Math.round(this.startPoint.y-this.game.piece_height/2), this.game.piece_width, this.game.piece_height), Math.round(this.startPoint.x-this.game.piece_width/2), Math.round(this.startPoint.y-this.game.piece_height/2));
    //this.game.context.globalAlpha = 1

    this.game.context.fillStyle=this.pickedColor;
     this.game.context.fillRect(this.startPoint.x-this.game.piece_width/2, this.startPoint.y-this.game.piece_height/2,this.game.piece_width, this.game.piece_height);
     for(var i = 0; i<this.createdShapes.length; i++){
   
    this.createdShapes[i].draw();
  }
 //   this.game.context.drawImage(this.game.img, this.holder.column*this.game.piece_width, this.holder.line*this.game.piece_height, this.game.piece_width, this.game.piece_height, 
   //   this.startPoint.x-this.game.piece_width/2, this.startPoint.y-this.game.piece_height/2, this.game.piece_width*(this.pieceShape[2]+1), this.game.piece_height*(this.pieceShape[3]+1));

  }
  else{
    //this.game.context.save();
    
    if(this.placed)
      this.game.context.globalAlpha = 1
    else if(!this.game.is_over)
      this.game.context.globalAlpha = 0.8
    else
      this.game.context.globalAlpha = 1
  
    this.game.context.fillStyle = "rgba(255, 255, 255, 0.5)";
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
  
    if(this == this.game.selected){
      this.game.context.fillStyle = "rgba(0, 0, 255, 0.1)";
    }
    else if(this.game.over == this)
      this.game.context.fillStyle = "rgba(255, 0, 0, 0.1)";
  
    //target distance
    if((this.game.selected == this)&&(this.near())){
      this.game.context.fillStyle = "rgba(0, 255, 0, 0.1)";
      if((this.game.auto_snap == true)&&(!this.placed)){
        //place
        this.game.selected.x = this.game.selected.target.x;
        this.game.selected.y = this.game.selected.target.y;
        this.game.selected.placed = true;
        this.game.selected.moveble = false;
        this.game.placed_pieces.push(this.game.selected);
        if(this.game.drip.currentTime != 0)
          this.game.drip.currentTime = 0;
        this.game.drip.play();
      }
    }
  
    //piece.draw();
    //this.game.context.beginPath();
    //this.game.context.fillRect(Math.round(this.startPoint.x-this.game.piece_width/2), Math.round(this.startPoint.y-this.game.piece_height/2), this.game.piece_width, this.game.piece_height);
    /*
    this.game.context.drawImage(this.game.img, this.holder.column*this.game.piece_width, this.holder.line*this.game.piece_height, this.game.piece_width, this.game.piece_height, 
      Math.round(this.x-this.game.piece_width/2), Math.round(this.y-this.game.piece_height/2), this.game.piece_width, this.game.piece_height);
    */this.game.context.fillStyle=this.pickedColor;
    this.game.context.fillRect(this.x-this.game.piece_width/2, this.y-this.game.piece_height/2, this.game.piece_width, this.game.piece_height);
      for(var i = 0; i<this.createdShapes.length; i++){
   
    this.createdShapes[i].draw();
  }
  
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

Piece.prototype.near = function() {
  //target distance
  var r = false;
  var dx, dy, distance;
  for(i = 0; i<this.game.holders.length; i++){
    dx = this.x - this.game.holders[i].x;
    dy = this.y - this.game.holders[i].y;
    distance = (dx * dx + dy * dy);
    if(distance <= this.tolerance && this.game.checkPlace.call(this, this, this.game.holders[i])){
      r = this.game.holders[i];
      //console.log(r);
    }
  }
  if(this.game.debug){
    console.log(this.id+': '+distance)
  }
  return r;
}

Piece.prototype.mouse_is_over = function() {
  var overpiece;
  if(this.game.mouse.isOverPiece(this) && this.game.started){
    return true;
  }
  if(this.game.started){
    for(var i = 0; i<this.createdShapes.length; i++){
      if(this.createdShapes[i].mouse_is_over()){
        return true;
      }
    }
  }
  return false;
}