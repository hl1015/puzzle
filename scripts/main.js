function Game(canvas) {
  this.started = false;
  this.stage = 1;
  this.num_lines = 2;
  this.scale = 1;
  this.alpha = 1;
  this.fade1 = 0;
  this.fade2 = 0;
  this.resized = true;
  //console.log('start loading...');
  this.loadAssets();
}

Game.prototype.loadAssets = function() {
  this.canvas = document.getElementById('canvas');
  this.context = this.canvas.getContext('2d');
  this.canvas_bg = document.getElementById('canvas_bg');
  this.context_bg = this.canvas.getContext('2d');
  
  //Canvas size
  document.getElementById('canvas').width = window.innerWidth;
  document.getElementById('canvas').height = window.innerHeight;
  document.getElementById('canvas_bg').width = window.innerWidth;
  document.getElementById('canvas_bg').height = window.innerHeight;
  
  document.getElementById('game').height = window.innerHeight;
  
  //console.log("canvas: "+window.innerWidth+", "+window.innerHeight);
  //
  
  this.original_width = this.canvas.width;
  this.original_height = this.canvas.height;
  this.font_size = Math.round(this.canvas.width/8);
  this.scaled_width = (this.canvas.width/this.scale)/2;
  this.scaled_height = (this.canvas.height/this.scale)/2;
  //console.log('scaled_width: '+this.scaled_width);
  //console.log('scaled_height: '+this.scaled_height);

  this.loaded_items = 0;
  this.loaded = false;
  this.interval = null;
  this.maxElapsedTime = 0;
  this.start_time = 0;
  
  this.random_image = Math.floor(Math.random() * 12) + 1;
  if(this.random_image<10)
    this.random_image = new String("0"+this.random_image);
    
  this.random_image = new String("01");  
 
  this.drip = document.getElementById("audio-drip");
  this.twang = document.getElementById("audio-twang");
  this.bgm = document.getElementById("audio-bgm");
  this.chimes = document.getElementById("chimes");
    
  //this.items_to_load = this.assets.length;
  //loadAssets(this, this.assets);
  this.items_to_load = 1;
  this.loaded_items = 1;

  //eval("this.img = this.img"+this.random_image);
  eval("this.img = document.getElementById('img"+this.random_image+"');");
  //console.log("this.img = this.img"+this.random_image);
  //console.log("this.img = document.getElementById('img"+this.random_image+"')");
   
  this.w_rate = this.canvas.width / this.img.width;
  this.h_rate = this.canvas.height / this.img.height;
  this.w_scale = 1;
  this.h_scale = 1;
  
  //console.log(this.loaded_items+' assets loaded');
};

Game.prototype.apply_scale = function(){
  document.getElementById('canvas').width = window.innerWidth;
  document.getElementById('canvas').height = window.innerHeight;
  document.getElementById('canvas_bg').width = window.innerWidth;
  document.getElementById('canvas_bg').height = window.innerHeight;

  /*
  var rw = document.getElementById('canvas').width / this.original_width;
  var rh = document.getElementById('canvas').height / this.original_height;
  this.scale = Math.min(rw,rh);
  if(this.scale == 1)
    this.scale = Math.max(rw,rh);
  */

  //ws = (document.getElementById('canvas').width/1.5) / document.getElementById('img01').width;
  //hs = (document.getElementById('canvas').height/1.5) / document.getElementById('img01').height;
  //this.scale = Math.min(ws,hs);
//  if(ws/hs<1.5){
      ws = (document.getElementById('canvas').width/3.2) / document.getElementById('img01').width;
      hs = (document.getElementById('canvas').height/3.2) / document.getElementById('img01').height;
      this.scale = Math.min(ws,hs);
  //}


  /*
  if(document.getElementById('img09').width >= document.getElementById('canvas').width){
    console.log("W")
    this.scale = (document.getElementById('canvas').width/1.5) / document.getElementById('img09').width
  }
  else if(document.getElementById('img09').height >= document.getElementById('canvas').height){
    console.log("H")
    this.scale = (document.getElementById('canvas').height/1.5) / document.getElementById('img09').height
  }
  else if(document.getElementById('img09').width < document.getElementById('canvas').width){
    console.log("W2")
    this.scale = (document.getElementById('canvas').width/1.5) / document.getElementById('img09').width
  }
  else if(document.getElementById('img09').height < document.getElementById('canvas').height){
    console.log("H2")
    this.scale = (document.getElementById('canvas').height/1.5) / document.getElementById('img09').height
  }
  */
  
  
  /*else{
    ws = (document.getElementById('canvas').width/1.5) / document.getElementById('img09').width;
    hs = (document.getElementById('canvas').height/1.5) / document.getElementById('img09').height;
  }
  console.log(ws+':'+hs);
  this.scale = Math.min(ws,hs);
  */

  this.context.scale(this.scale,this.scale);
  //console.log('scale: '+this.scale);
  this.resized = false;
};


Game.prototype.init = function(){
  $("#game").css('height', window.innerHeight);
  
  this.loaded = true;
  this.pieces = new Array();
  this.holders = new Array();
  this.startholders = new Array();
  this.real_holders = new Array();
  this.placed_pieces = new Array();
  this.moving = true;
  this.selected = null;
  this.over = null;
  this.is_over = false;

  //console.log(this.img.width+','+this.img.height);
  this.img_width = this.img.width;
  this.img_height = this.img.height;
  
  //this.img_width = document.getElementById('canvas').width/2;
  //this.img_height = document.getElementById('canvas').height/2;
  
  //this.img.width = this.img_width; 
  //this.img.height = this.img_height; 
  
  /*
  if(this.img_width > document.getElementById('canvas').width)
    this.img_width = (document.getElementById('canvas').width/100)*70;
  if(this.img_height > document.getElementById('canvas').height)
    this.img_height = (document.getElementById('canvas').height/100)*70;
  */
  this.num_pieces = this.num_lines * this.num_lines;
  this.piece_width = this.img_width / this.num_lines;
  this.piece_height = this.img_height / this.num_lines;
  this.realNumLines = this.num_lines/2 .toFixed();
  this.realNumPieces = this.realNumLines*this.realNumLines;
  this.protopieces = new Array();
  this.protopieces.length = this.num_lines;
  this.protoshapes = new Array();
  this.sumShapeWeight = 0;
  //console.log("piece_width: "+this.piece_width);

  //IMAGE SIZE
  if(this.resized)
    this.apply_scale();

  this.font_size = Math.round(this.canvas.width/8);
  this.scaled_width = (this.canvas.width/this.scale)/2;
  this.scaled_height = (this.canvas.height/this.scale)/2;

  this.draw_bg();

  this.remaining_time = this.num_pieces*(50/this.stage);
  this.time_to_complete = this.remaining_time;
  this.clock_interval = null;
  this.mouse = new Mouse(this);p

  this.auto_snap = false;
  this.generateShapes();
  this.placeStartHolders();
  this.placeHolders();
  this.placePieces();
};

Game.prototype.checkLowerPosition = function(numCH, arrayholdCH){
  for(l = 0; l<arrayholdCH.length; l++){
    for(d = 0; d<this.startholders.length/2; d++){
      if(d === arrayholdCH[l]){

      }
    }
  }
};

Game.prototype.checkHolderRandom = function(num, arrayhold){
  //var mincur = 9999999;
  for(k = 0; k<arrayhold.length; k++){
    if(num === arrayhold[k]){
      return true;
    }
  }
 // if(this.num_lines>=4){
   // if(num>=this.startholders.length/2){
     // this.checkLowerPosition(num, arrayhold)
    //}
  //}
  return false;
};

Game.prototype.placePieces = function(){
  
  
  
  var maxcount = this.protoshapes.length;
  var j = -1;
  var cont = this;
  var holderNum = -1;
  var holderPrevWeight = 0;
  var holderCurrWeight = 0;
  var holderArray = new Array();
  var holderID;
  for(i=0; i<maxcount; i++){
    var d = -1;
    j++;
    x = Math.floor(Math.random()*this.scaled_width*2);
    y = Math.floor(Math.random()*this.scaled_height*2);
    holderCurrWeight = Math.ceil(this.protoshapes[j][2].length/2);
    do{
      holderNum = Math.floor(Math.random()*maxcount);
    }while(this.checkHolderRandom(holderNum, holderArray));

    holderArray.push(holderNum);
    holderPrevWeight = Math.ceil(this.protoshapes[j][2].length/2);
    holderID = (this.protoshapes[i][0]+(this.num_lines*this.protoshapes[i][1]));  

    temp = new Piece(
      j+1,
      this,
      this.piece_width,
      this.piece_height,
      this.startholders[holderNum].x,
      this.startholders[holderNum].y,
      new Point2D(x,y),
      new Point2D(this.holders[holderID].x,this.holders[holderID].y),
      this.holders[holderID],
      true,
      false,
      this.protoshapes[j],
      this.startholders[holderNum]
    );
    this.pieces.push(temp);
    //console.log('pieces array length>>'+this.pieces.length);
  }
  document.getElementById('audio-chimes').play();
};


Game.prototype.generateShapes = function(){
  var self = this, j = -1;
  //var sumShapeWeight;
  var isReserved;
  this.sumShapeWeight = 0;
    for(i=0; i<this.num_pieces; i++){
    this.protopieces[i] = new Array();
    this.protopieces[i].length = this.num_lines;
  }
  
  for(i=0; i<this.num_pieces; i++){
    j++;
    this.protoshapes[j] = (function(){
      
      return function(){
        var isReserved;
        var shapeweight;
        var _shaperandom = Math.floor(Math.random()*9+1);
        //console.log("shaperandom: "+_shaperandom);
        if(_shaperandom === 1 || _shaperandom ===2){
          shapeweight = 2;

          if(_shaperandom ===1){
            if(self.num_pieces>=(self.sumShapeWeight+shapeweight)){
              isReserved = reservePlaces.call(self, 1, self.num_lines);
            }else{
              isReserved = false;
            }
            if(!isReserved){
              isReserved = reservePlaces.call(self, 3, self.num_lines);
              shapeweight = 1;
            }
            self.sumShapeWeight += shapeweight;
            i += shapeweight-1;
            return isReserved;
          }else if(_shaperandom ===2){
            if(self.num_pieces>=(self.sumShapeWeight+shapeweight)){
              isReserved = reservePlaces.call(self,2, self.num_lines);
            }else{
              isReserved = false;
            }
            if(!isReserved){
              isReserved = reservePlaces.call(self, 3, self.num_lines);
              shapeweight = 1;
            }
            self.sumShapeWeight += shapeweight;
            i += shapeweight-1;
            return isReserved;
          }
        }else if(_shaperandom === 4 || _shaperandom ===5 || _shaperandom ===9){
          shapeweight = 3;
          if(_shaperandom ===4){
            if(self.num_pieces>=(self.sumShapeWeight+shapeweight)){
              isReserved = reservePlaces.call(self, 4, self.num_lines);
            }
            else{
              isReserved = false;
            }
            if(!isReserved){
              isReserved = reservePlaces.call(self, 3, self.num_lines);
              shapeweight = 1;
            }
            self.sumShapeWeight += shapeweight;
            i += shapeweight-1;
            return isReserved;
          }else if(_shaperandom ===5){
            if(self.num_pieces>=(self.sumShapeWeight+shapeweight)){
              isReserved = reservePlaces.call(self, 5, self.num_lines);
            }
            else{
              isReserved = false;
            }
            if(!isReserved){
              isReserved = reservePlaces.call(self, 3, self.num_lines);
              shapeweight = 1;
            }
            self.sumShapeWeight += shapeweight;
            i += shapeweight-1;
            return isReserved;
          }else if(_shaperandom ===9){
            if(self.num_pieces>=(self.sumShapeWeight+shapeweight)){
              isReserved = reservePlaces.call(self, 9, self.num_lines);
            }
            else{
              isReserved = false;
            }
            if(!isReserved){
              isReserved = reservePlaces.call(self, 3, self.num_lines);
              shapeweight = 1;
            }
            self.sumShapeWeight += shapeweight;
            i += shapeweight-1;
            return isReserved;
          }
        }else if(_shaperandom ===6 || _shaperandom ===8){
          shapeweight = 4;
          if(_shaperandom ===6){
            if(self.num_pieces>=(self.sumShapeWeight+shapeweight)){
              isReserved = reservePlaces.call(self, 6, self.num_lines);
            }
            else{
              isReserved = false;
            }
            if(!isReserved){
              isReserved = reservePlaces.call(self, 3, self.num_lines);
              shapeweight = 1;
            }
            self.sumShapeWeight += shapeweight;
            i += shapeweight-1;
            return isReserved;
          }else if(_shaperandom ===8){
            if(self.num_pieces>=(self.sumShapeWeight+shapeweight)){
              isReserved = reservePlaces.call(self, 8, self.num_lines);
            }
            else{
              isReserved = false;
            }
            if(!isReserved){
              isReserved = reservePlaces.call(self, 3, self.num_lines);
              shapeweight = 1;
            }
            self.sumShapeWeight += shapeweight;
            i += shapeweight-1;
            return isReserved;
          }

        }else if(_shaperandom ===7){
          shapeweight = 5;
          if(_shaperandom ===7){
            if(self.num_pieces>=(self.sumShapeWeight+shapeweight)){
              isReserved = reservePlaces.call(self, 7, self.num_lines);
            }
            else{
              isReserved = false;
            }
            if(!isReserved){
              isReserved = reservePlaces.call(self, 3, self.num_lines);
              shapeweight = 1;
            }
            self.sumShapeWeight += shapeweight;
            i += shapeweight-1;
            return isReserved;
          }
        }else{
          isReserved = reservePlaces.call(self, 3, self.num_lines);
          shapeweight = 1;
          self.sumShapeWeight += shapeweight;
          i += shapeweight-1;
          return isReserved;
        }
        
        
      };
    }())();

  }

};

Game.prototype.placeStartHolders = function(){
  var pieces = 1;
  var tempx, tempy;
  var offsetx = Math.round(this.scaled_width-(this.img_width)/2);
  var offsety = Math.round(this.scaled_height-(this.img_height)/2);
  offsety += 26;
  for(var i = 0; i < Math.ceil(Math.sqrt(this.protoshapes.length)); ++i) {
    for(var j = 0; j < Math.ceil(Math.sqrt(this.protoshapes.length)); ++j) {
      tempx = offsetx - j*this.piece_width-5*this.piece_width/2+(this.piece_width/2)-this.piece_width/2;
      tempy = i*this.piece_height*3+offsety+this.piece_height/2-this.num_lines*this.piece_height/2;
      if((j%3) == 0 && this.num_lines<4 && this.num_lines>2){
        tempx = offsetx - j*this.piece_width-4*this.piece_width/2+(this.piece_width/2-this.piece_width);
        tempy = i*this.piece_height*3+offsety+this.piece_height/2-this.num_lines*this.piece_height/2-3*this.piece_height/4;
      }
      if((j%3) == 0 && this.num_lines<3){
        tempx = offsetx - j*this.piece_width-4*this.piece_width/2+(this.piece_width/2);
        tempy = i*this.piece_height*2.5+offsety+this.piece_height/2-this.num_lines*this.piece_height/2;
      }
    //  if((j%3) == 0 && this.num_lines>=8){
    //    tempx = offsetx - j*this.piece_width-5*this.piece_width/2+(this.piece_width/2)-2*this.piece_width;
    //  tempy = i*this.piece_height*3+offsety+this.piece_height/2-this.num_lines*this.piece_height/2;
   //   }

      if((j%3) == 1){
        tempx = offsetx +this.piece_width/2+i*this.piece_width*3;
        tempy = offsety + this.num_lines*this.piece_height+j*this.piece_height+this.piece_height/2+this.piece_height/8;
      }

      if((j%3) == 1 && this.num_lines<4){
        tempx = offsetx +this.piece_width/2+i*this.piece_width*2;
        tempy = offsety + this.num_lines*this.piece_height+j*this.piece_height-((j)*this.piece_height/1.6)+5*this.piece_height/6;
      }


      /*if((j%4) == 1){
        tempx = j*this.piece_width+offsetx+this.num_lines*this.piece_width+this.piece_width/2+this.piece_width;
        tempy = i*this.piece_height*3+offsety+this.piece_height/2-this.num_lines*this.piece_height/2;
      }
      if((j%4) == 1 && this.num_lines>=8){
        tempx = j*this.piece_width+offsetx+this.num_lines*this.piece_width+this.piece_width/2+2*this.piece_width;
        tempy = i*this.piece_height*3+offsety+this.piece_height/2-this.num_lines*this.piece_height/2;
      }
      if((j%4) == 1 && this.num_lines<=4){
        tempx = j*this.piece_width+offsetx+this.num_lines*this.piece_width+this.piece_width/2;
        tempy = i*this.piece_height*2+offsety+this.piece_height/2-this.num_lines*this.piece_height/2;
      }*/

      if((j%3) == 2){
        tempx = offsetx +this.piece_width/2+i*this.piece_width*3;
        tempy = offsety -j*this.piece_height+3*this.piece_height/8;
      
      }
      if((j%3) == 2 && this.num_lines<4){
        tempx = offsetx +this.piece_width/2+i*this.piece_width*2;
        tempy = offsety -4*j*this.piece_height/3+this.piece_height;
      
      }
      if((j%3) == 1 && this.num_lines<=3 && this.num_lines>2){
        tempx = j*this.piece_width+offsetx+this.num_lines*this.piece_width+2.5*9*this.piece_width/8;
        tempy = i*this.piece_height*3+offsety+this.piece_height/2-this.num_lines*this.piece_height/2-3*this.piece_height/4;
      }
      if((j%3) == 1 && this.num_lines<3){
        tempx = j*this.piece_width+offsetx+this.num_lines*this.piece_width+this.piece_width/2;
        tempy = i*this.piece_height*2.5+offsety+this.piece_height/2-this.num_lines*this.piece_height/2;
      }




      temp = new StartHolder(
        pieces,
        this,

        tempx,
        tempy,
        i,
        j
      );
      this.startholders.push(temp);
      //console.log('holders array length>>'+this.holders.length+' '+temp.x+','+temp.y);
      pieces++;
    }
  }
};

Game.prototype.placeHolders = function(){
  
//  console.log(this.protoshapes[j]);
  if(this.sumShapeWeight !== this.num_pieces){alert("wrong weight/pieces number "+this.sumShapeWeight+"   "+this.num_pieces+"\nIt's possible that you should reset the game to avoid unexpected behavior.")}
  var pieces = 1;
  var offsetx = Math.round(this.scaled_width-(this.img_width)/2);
  var offsety = Math.round(this.scaled_height-(this.img_height)/2);
  offsety += 26;
  for(var i = 0; i < this.num_lines; ++i) {
    for(var j = 0; j < this.num_lines; ++j) {
      temp = new Holder(
        pieces,
        this,

        j*this.piece_width+offsetx+this.piece_width/2,
        i*this.piece_height+offsety+this.piece_height/2,
        i,
        j,
        false
      );
      this.holders.push(temp);
      //console.log('holders array length>>'+this.holders.length+' '+temp.x+','+temp.y);
      pieces++;
    }
  }
};

Game.prototype.checkPlace = function(currentPiece, currentHolder){
  var dx, dy, distance;
  var maxdx = 0;
  var maxdy = 0;
  if(currentHolder.occupied){
    return false;
  }
  for(j = 0; j<currentPiece.createdShapes.length; j++){
    for(k = 0; k<this.game.holders.length; k++){
    dx = currentPiece.createdShapes[j].x - this.game.holders[k].x;
    dy = currentPiece.createdShapes[j].y - this.game.holders[k].y;
    distance = (dx * dx + dy * dy);
    maxdx = (maxdx<=dx)?dx:maxdx;
    maxdy = (maxdy<=dy)?dy:maxdy;
    if(distance <= currentPiece.tolerance){
      if(this.game.holders[k].occupied === true){
        return false;
      }
    }
    }
  }
  if(maxdx>=currentPiece.width*this.game.num_lines-(currentPiece.width/2+1)){
    return false;
  }
  if(maxdy>=currentPiece.height*this.game.num_lines-(currentPiece.height/2+1)){
    return false;
  }
  return true;

}

Game.prototype.render = function() {
  this.draw_bg();

  //LOADING
  if(!this.loaded){
    if((this.items_to_load > 0)&&(this.loaded_items == this.items_to_load)){
      this.items_to_load = 0;
      var t = setTimeout("game.init();", 1500);
    }else{
      this.draw_loading();
    }
  }
  else{
    //HOLDERS
    for(var i = 0; i < this.holders.length; i++){
      holder = this.holders[i];
      holder.draw();
    }
    for(var i = 0; i < this.startholders.length; i++){
      startholder = this.startholders[i];
      startholder.draw();
    }

    //PIECES
    var not_placed = new Array();
    var over = false;
    for(var i = 0; i < this.pieces.length; i++){
      piece = this.pieces[i];
      if(!over && piece.mouse_is_over())
        over = true;
      if(!piece.placed)
        not_placed.push(piece);
      else if(piece != this.selected)
        piece.draw();
        
      if(!this.selected){
        if((!this.over)||(this.over.id < piece.id)||(piece.mouse_is_over())){
          if(piece.mouse_is_over()){
            this.over = piece;
          }
        }
      }

    }
    for(var i = 0; i < not_placed.length; i++){
      not_placed[i].draw();
    }
    if(this.selected)
      this.selected.draw();

    if(!over)
      this.over = null;

    //move
    if((this.selected != null)&&(this.selected.moveble)){
      this.selected.x = Math.round(this.mouse.x);
      this.selected.y = Math.round(this.mouse.y);
    }

    //REMAINING TIME
    this.draw_remaining();

    //Game Over
    if(this.remaining_time <= 0){
      this.remaining_time = 0;
      pauseGame();
      if(confirm('Timeup! Try again')){
        this.is_over = false;
        this.init();
        startGame();
      }
    }
    else{
      if(this.is_over){
        pauseGame();
        $('#stage').html("Stage "+this.stage+" completed!");
        $('#pieces').html(this.protoshapes.length+" pieces in "+(this.time_to_complete-this.remaining_time)+"s");
        $('#modal-success').modal();
      }else{
        if(this.protoshapes.length == this.placed_pieces.length){
          this.is_over = true;
        }
      }
    }
  }
};

Game.prototype.draw_bg = function() {
  if(!this.scale) this.scale = 1;
  this.context.fillStyle = "rgba(125, 125, 125, 1)";
  this.context_bg.fillRect(0,0,this.canvas_bg.width/this.scale,this.canvas_bg.height/this.scale);
  //puzzle image
  var offsetx = Math.round(this.scaled_width-(this.img_width)/2);
  var offsety = Math.round(this.scaled_height-(this.img_height)/2);
  offsety += 26;
  this.context_bg.globalAlpha = 0.2;
  this.context_bg.drawImage(this.img, offsetx, offsety, this.img_width, this.img_height);
};

Game.prototype.draw_remaining = function() {
  if(this.remaining_time <= 50){
  this.fade1 = this.fade1+(0.010*this.alpha);
  if(this.fade1 >= 0.6)
    this.alpha = -1;
  else if(this.fade1 <= 0.2)
    this.alpha = 1;
  this.context.fillStyle = "rgba(255, 255, 255, "+this.fade1+")";
  this.context.strokeStyle = "rgba(0, 0, 0, 0.5)";
  this.context.lineWidth = 2;
  this.context.font = "bold "+this.font_size+"px Arial";
  this.context.textBaseline = 'middle';
  this.context.textAlign = 'center';
  this.context.fillText(parseInt(game.remaining_time), this.scaled_width, this.scaled_height);
  }
};

Game.prototype.draw_loading = function() {
  this.fade1 = this.fade1+0.025;
  if(this.fade1 >= 1)
    this.fade1 = 0;
  this.fade2 = 1-this.fade1;

  this.context.fillStyle = "rgba(255, 255, 255, "+this.fade2+")";
  this.context.strokeStyle = "rgba(255, 255, 255, "+this.fade1+")";
  this.context.font = "bold "+this.font_size+"px Arial";
  this.context.textBaseline = 'middle';
  this.context.textAlign = 'center';
  this.context.lineWidth = 5;
  this.context.strokeText("LOADING", this.scaled_width, this.scaled_height);
  this.context.fillText("LOADING", this.scaled_width, this.scaled_height);
};

////////////////////////////////////////

Game.prototype.clockTick = function() {
  this.remaining_time--;
};

Game.prototype.getTimer = function() {
  return (new Date().getTime() - this.start_time); //milliseconds
};

Game.prototype.nextStage = function(resetStr) {
  /*var r = this.random_image;
  while(r == this.random_image){
    this.random_image = Math.floor(Math.random() * 12) + 1;
    if(this.random_image<10)
      this.random_image = new String("0"+this.random_image);
  }
  
  //eval("this.img = this.img"+this.random_image);
  */
  eval("this.img = document.getElementById('img01')");
  
  this.is_over = false;
  this.stage++;
  if(resetStr === "reset"){
    this.stage--;
  }
  if(resetStr !== "reset"){
    this.num_lines++;
  }
  this.init();
  startGame();
};

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

// polyfill for animation frame
;( function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }
  if(!window.requestAnimationFrame) {
    //console.log('!window.requestAnimationFrame');
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 22 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }
  if(!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }
}());

if(Modernizr.fullscreen){
  function RunPrefixMethod(obj, method) {
    var pfx = ["webkit", "moz", "ms", "o", ""];
    var p = 0, m, t;
    while (p < pfx.length && !obj[m]) {
      m = method;
      if (pfx[p] == "") {
        m = m.substr(0,1).toLowerCase() + m.substr(1);
      }
      m = pfx[p] + m;
      t = typeof obj[m];
      if (t != "undefined") {
        pfx = [pfx[p]];
        return (t == "function" ? obj[m]() : obj[m]);
      }
      p++;
    }
  }
}

// GAME START
var game = new Game();
var interval = null;
var gameInterval = null;
game.debug = false;
m = {
  game : game
};

interv = function() {
  interval = setTimeout("game.mouse.moving = false; document.getElementById('moving').value = false; intervClear();", 500);
};
intervClear = function() {
  clearInterval(interval)
};

stopGame = function() {
  clearInterval(gameInterval);
  
  game.started = false;
  stopSFX();
  stopBGM();
  window.cancelAnimationFrame(game.interval);

  $('#home').addClass('active');

  $('#play').show();
  $('.control').hide();
  
  $('#canvas, #canvas_bg').hide();
  $('.content').show();
};

startGame = function() {
  clearInterval(gameInterval);
  gameInterval = setInterval(function() { game.remaining_time--; },1000);
  game.started = true;
  //resizeGame();
  startSFX();
  startBGM();
  loop();
  $('#home').removeClass('active');
  $('#canvas, .control, .abs').show();
  $('.content, #play, #exitfullscreen, #bgm, #sfx, #autosnap').hide();
  $('.container, .footer').hide();
  $('#body').css('padding', '0px');
  $('#body').css('margin', '0px');
};

pauseGame = function() {
  clearInterval(gameInterval);
  game.started = false;
  window.cancelAnimationFrame(game.interval);

  $('.control').hide();  
  $('#play').show();
  $('#btn-play').show();
};

stopSFX = function() {
  game.drip.volume = 0.0;
  game.twang.volume = 0.0;
  game.drip.pause();
  game.twang.pause();
  $('#sfxoff').hide();
  $('#sfx').show();
};

startSFX = function() {
  game.drip.volume = 1.0;
  game.twang.volume = 1.0;
  $('#sfxoff').show();
  $('#sfx').hide();
};

stopBGM = function() {
  game.bgm.volume = 0.0;
  game.bgm.pause();
  $('#bgmoff').hide();
  $('#bgm').show();
};

startBGM = function() {
  game.bgm.volume = 1.0;
  game.bgm.play();
  //game.bgm.start(0);
  //document.getElementById('audio-bgm').play();
  $('#bgmoff').show();
  $('#bgm').hide();
};

autoSnap = function() {
  game.auto_snap = true;
  $('#autosnapoff').show();
  $('#autosnap').hide();
};

autoSnapOff = function() {
  game.auto_snap = false;
  $('#autosnapoff').hide();
  $('#autosnap').show();
};

fullscreen = function() {
  RunPrefixMethod(game.canvas, "RequestFullScreen");
};

exitfullscreen = function() {
  RunPrefixMethod(document, 'CancelFullScreen');
};

function start() {
  startGame();
}
function stop() {
  stopGame();
}
function pause() {
  pauseGame();
}

function loop() {
  game.interval = window.requestAnimationFrame(loop, game.canvas);

  game.render();

  var elapsed = game.getTimer() - game.time;
  game.time = game.getTimer();
  if(elapsed > game.maxElapsedTime)
    game.maxElapsedTime = elapsed;
}

function loadAssets(g,assets) {
  for(i=0; i<assets.length; i++){
    if(assets[i].type == "image"){
      //IMAGE
      eval("g."+assets[i].slug+' = new Image();');
      eval("g."+assets[i].slug+'.src = "'+assets[i].src+'";');
      eval("g."+assets[i].slug+'.onload = g.loaded_items++;');
    }
    else if(assets[i].type == "audio"){
      //AUDIO
      eval("g."+assets[i].slug+' = document.createElement(\'audio\');');
      eval("g."+assets[i].slug+'.addEventListener(\'canplaythrough\', itemLoaded(g), false);');
      var source= document.createElement('source');
      if(Modernizr.audio.ogg){
        source.type= 'audio/ogg';
        source.src= assets[i].src+'.ogg';
      }
      else if(Modernizr.audio.mp3){
        source.type= 'audio/mpeg';
        source.src= assets[i].src+'.mp3';
      }
      if(source.src != ""){
        eval("g."+assets[i].slug+'.appendChild(source);');
      }
      else{
        // no MP3 or OGG audio support
        g.itens_to_load--;
      }
    }
  }
}

function itemLoaded(g) {
  g.loaded_items++;
}

function resizeGame() {  
  //location.reload();
  game.apply_scale();
  if(game.started)
    game.init();
}

window.addEventListener('resize', resizeGame, false);
window.addEventListener('orientationchange', resizeGame, false);
//

$(function() {  
  $(".popover-test").popover();
  
  $("#next").click(function() {
    game.nextStage();
    $('#modal-success').modal('hide');
  });
  
  $("#play, #btn-play, #play-btn-lg").click(function() {
    start();
  });
  
  $("#btn-pause").click(function() {
    pause();
  });

  $("#btn-reset").click(function() {
    game.nextStage("reset");
  });
  
  $("#btn-fullscreen").click(function() {
    fullscreen();
  });
  
  $("#btn-exitfullscreen").click(function() {
    exitfullscreen();
  });
  
  $("#btn-bmg-on").click(function() {
    startBGM();
  });
  
  $("#btn-bmg-off").click(function() {
    stopBGM();
  });
  
  $("#btn-sfx-on").click(function() {
    startSFX();
  });
  
  $("#btn-sfx-off").click(function() {
    stopSFX();
  });
  
  $("#btn-autosnap-on").click(function() {
    autoSnap();
  });
  
  $("#btn-autosnap-off").click(function() {
    autoSnapOff();
  });

  $("#play-top").click(function() {
    start();
  });

  $("#btn-home").click(function() {
    self.location.href="./index.html";
  });
  
  $("#modal-success").removeClass('show');
  
});

/*****
 *
 *   Mouse.js
 *
 *****/

/*****
 *
 *   constructor
 *
 *****/
function Mouse(game) {
  this.game = game;
  this.x = 0;
  this.y = 0;
  this.down = false;
  this.up = false;
  var me = this;
  this.moving = false;
  this.interval = null;

  //this.element = window;
  this.element = document.getElementById('canvas');
  
  if(!Modernizr.touch){
    this.element.addEventListener('mousemove', function(e){ me.mousemove(e) }, false);
    this.element.addEventListener('mousedown', function(e){ me.mousedown(e) }, false);
    this.element.addEventListener('mouseup', function(e){ me.mouseup(e) }, false);
    //window.addEventListener('keyup', function(e){ me.keyup(e) }, false);
  }else{
    this.element.addEventListener('touchstart', function(e) { me.touchstart(e) }, false);
    this.element.addEventListener('touchmove', function(e) { me.touchmove(e) }, false);
    this.element.addEventListener('touchend', function(e) { me.touchend(e) }, false);
  }
}


/*****
 *
 *   keyup
 *
 *****/
Mouse.prototype.keyup = function(e) {
  console.log(e.keyCode)
}

/*****
 *
 *   isOverBall
 *    -
 *
 *****/
Mouse.prototype.isOverBall = function(ball) {
  var r = false;
  if((this.x > 0 && this.y > 0)&&(ball.x > 0 && ball.y > 0)){
    if(((this.x >= (ball.x - ball.radius)) && (this.x <= (ball.x + ball.radius)))&&
    ((this.y >= (ball.y - ball.radius)) && (this.y <= (ball.y + ball.radius)))){
      r = true;

      if(this.game.debug){
        console.log('over '+this.x+' '+this.y);
      }
    }
  }
  return r;
}

/*****
 *
 *   isOverPiece
 *    -
 *
 *****/
Mouse.prototype.isOverPiece = function(piece) {
  var poly = new Array();
  poly[0]= new Point2D(piece.x-piece.width/2, piece.y-piece.height/2);
  poly[1]= new Point2D(piece.x+piece.width/2, piece.y-piece.height/2);
  poly[2]= new Point2D(piece.x+piece.width/2, piece.y+piece.height/2);
  poly[3]= new Point2D(piece.x-piece.width/2, piece.y+piece.height/2);
  pt = new Point2D(this.x, this.y);
  for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
      ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
      && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
      && (c = !c);
  return c;
}

/*****
 *
 *   isOverRect
 *    -
 *
 *****/
Mouse.prototype.isOverRect = function(p1, p2, p3, p4) {
  var poly = new Array();
  poly[0]=p1;
  poly[1]=p2;
  poly[2]=p3;
  poly[3]=p4;
  pt = new Point2D(this.x, this.y);
  for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
      ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
      && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
      && (c = !c);
  return c;
}

/*****
 *
 *   mousemove
 *
 *****/
Mouse.prototype.mousemove = function(e) {
  
  body_scrollLeft = document.body.scrollLeft,
  element_scrollLeft = document.documentElement.scrollLeft,
  body_scrollTop = document.body.scrollTop,
  element_scrollTop = document.documentElement.scrollTop,
  offsetLeft = this.element.offsetLeft,
  offsetTop = this.element.offsetTop;
  
  var xx, yy;
  if (e.pageX || e.pageY) {
    xx = e.pageX;
    yy = e.pageY;
  } else {
    xx = e.clientX + body_scrollLeft + element_scrollLeft;
    yy = e.clientY + body_scrollTop + element_scrollTop;
  }
  
  xx = xx/this.game.scale;
  yy = yy/this.game.scale;
  
  this.moving = true;
  interv();
  this.x = xx;
  this.y = yy;
  this.event = e;

  if(this.game.debug){
    console.log('move '+xx);
  }
}

/*****
 *
 *   mousedown
 *
 *****/
Mouse.prototype.mousedown = function(e) {
  this.down = true;
  this.up = false;
  this.event = e;
  
  //select
  if(this.game.over){
    this.game.selected = this.game.over;
    if(this.game.selected.placed){
      this.game.placed_pieces.splice(this.game.placed_pieces.indexOf(this.game.selected), 1);
      this.game.selected.placed = false;
      Holder.prototype.deOccupy.call(this, this.game.selected.occupiedinfo);
      this.game.selected.occupiedinfo = null;
    }
  }

  if(this.game.debug){
    console.log('down');
  }
}

/*****
 *
 *   mouseup
 *
 *****/
Mouse.prototype.mouseup = function(e) {
  e.preventDefault();

  this.up = true;
  this.down = false;
  this.event = e;
  if(this.game.selected){
    this.checkNear = this.game.selected.near();
  }
  //place
  if((this.game.selected)&&(this.checkNear)&&(!this.game.selected.placed)){
    this.game.selected.x = this.checkNear.x;
    this.game.selected.y = this.checkNear.y;
    this.game.selected.placed = true;
    this.game.selected.occupiedinfo = Holder.prototype.occupy.call(this);
   // this.game.selected.moveble = false;
    this.game.placed_pieces.push(this.game.selected);
    if(this.game.drip.currentTime != 0)
      this.game.drip.currentTime = 0;
    this.game.drip.play();
  }else if((this.game.selected)&&(!this.checkNear)){
    this.game.selected.p = 0;
    //this.game.selected.moveble = false;
    this.game.selected.placed = false;
    //this.game.selected.startPoint.x = this.game.selected.iniPoint.x;
    //this.game.selected.startPoint.y = this.game.selected.iniPoint.y;
    //this.game.selected.startPoint.x = this.game.selected.iniPoint.x;
    //this.game.selected.startPoint.y = this.game.selected.iniPoint.y;
    if(this.game.twang.currentTime != 0)
      this.game.twang.currentTime = 0;
    this.game.twang.play();
  }

  //unselect
  this.game.selected = null;

  if(this.game.debug){
    console.log('up');
  }

};

/*****
 *
 *   touchstart
 *
 *****/
Mouse.prototype.touchstart = function(e) {
  this.game.drip.play();

  e.preventDefault();

  this.moving = false;
  this.down = true;
  this.up = false;
  this.event = e;
  
  if(this.game.debug){
    console.log('touch start');
  }
  
};

/*****
 *
 *   touchstop
 *
 *****/
Mouse.prototype.touchend = function(e) {
  if(this.game.debug)
    console.log('touchend');
    
  e.preventDefault();

  this.moving = false;
  this.up = true;
  this.down = false;
  this.x = -1;
  this.y = -1;
  if(this.game.selected){
    this.checkNear = this.game.selected.near();
  }
  //place
  if((this.game.selected)&&(this.checkNear)&&(!this.game.selected.placed)){
    this.game.selected.x = this.checkNear.x;
    this.game.selected.y = this.checkNear.y;
    this.game.selected.placed = true;
    this.game.selected.occupiedinfo = Holder.prototype.occupy.call(this);
   // this.game.selected.moveble = false;
    this.game.placed_pieces.push(this.game.selected);
    if(this.game.drip.currentTime != 0)
      this.game.drip.currentTime = 0;
    this.game.drip.play();
  }else if((this.game.selected)&&(!this.checkNear)){
    this.game.selected.p = 0;
    //this.game.selected.moveble = false;
    this.game.selected.placed = false;
    //this.game.selected.startPoint.x = this.game.selected.iniPoint.x;
    //this.game.selected.startPoint.y = this.game.selected.iniPoint.y;
    //this.game.selected.startPoint.x = this.game.selected.iniPoint.x;
    //this.game.selected.startPoint.y = this.game.selected.iniPoint.y;
    if(this.game.twang.currentTime != 0)
      this.game.twang.currentTime = 0;
    this.game.twang.play();
  }

  
  //unselect
  this.game.selected = null;
 
}

/*****
 *
 *   touchmove
 *
 *****/
;Mouse.prototype.touchmove = function(e) {

  e.preventDefault();

  body_scrollLeft = document.body.scrollLeft,
  element_scrollLeft = document.documentElement.scrollLeft,
  body_scrollTop = document.body.scrollTop,
  element_scrollTop = document.documentElement.scrollTop,
  offsetLeft = this.element.offsetLeft,
  offsetTop = this.element.offsetTop;

  var xx, yy, touch_event = e.touches[0]; //first touch
  if (touch_event.pageX || touch_event.pageY) {
    xx = touch_event.pageX;
    yy = touch_event.pageY;
  } else {
    xx = touch_event.clientX + body_scrollLeft + element_scrollLeft;
    yy = touch_event.clientY + body_scrollTop + element_scrollTop;
  }  
  //xx -= offsetLeft;
  //yy -= offsetTop;

  xx = xx/this.game.scale;
  yy = yy/this.game.scale;

  this.moving = true;
  this.x = xx;
  this.y = yy;
  this.event = e;

  //select
  if(this.game.over){
    this.game.selected = this.game.over;
    if(this.game.selected.placed){
      this.game.placed_pieces.splice(this.game.placed_pieces.indexOf(this.game.selected), 1);
      this.game.selected.placed = false;
      Holder.prototype.deOccupy.call(this, this.game.selected.occupiedinfo);
      this.game.selected.occupiedinfo = null;
    }
  }

  if(this.game.debug)
    console.log('touchmove '+xx);

};

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
/*****
 *
 *   Point2D.js
 *
 *****/

/*****
 *
 *   constructor
 *
 *****/
;function Point2D(x, y) {
  if(arguments.length > 0) {
    this.x = x;
    this.y = y;
  }
}


;function reservePlaces(shape, lines){
    var shapeform = [];
    for(var i=0; i<lines; i++){
      for(var j=0; j<lines; j++){
        if(shape === 1){
          if(this.protopieces[i][j] == undefined && this.protopieces[i+1][j] == undefined && i<=lines-2){
            this.protopieces[i][j] = i+j;
            this.protopieces[i+1][j] = i+j;
            shapeform[0] = 12;
            shapeform[1] = 13;
            return [i, j, shapeform];
//            return [i,j,1,0];
          }
        }else if(shape === 2){
          if(this.protopieces[i][j] == undefined && this.protopieces[i][j+1] == undefined && j<=lines-2){
            this.protopieces[i][j] = i+j;
            this.protopieces[i][j+1] = i+j;
            shapeform[0] = 12;
            shapeform[1] = 17;
            return [i, j, shapeform];
  //          return [i,j,0,1];
          }
        }else if(shape ===3){
          if(this.protopieces[i][j] == undefined){
            this.protopieces[i][j] = i+j;
            shapeform[0] = 12;
            return [i, j, shapeform];
            //return [i,j,0,0];
          }
        }else if(shape ===4 && i<=lines-2 && i>=1){
          if(this.protopieces[i][j] == undefined && this.protopieces[i+1][j] == undefined && this.protopieces[i-1][j] == undefined){
            this.protopieces[i][j] = i+j;
            this.protopieces[i+1][j] = i+j;
            this.protopieces[i-1][j] = i+j;
            shapeform[0] = 12;
            shapeform[1] = 13;
            shapeform[2] = 11;
            return [i, j, shapeform];
//            return [i,j,2,0];
          }
        }else if(shape === 5 && j<=lines-2 && j>=1){
          if(this.protopieces[i][j] == undefined && this.protopieces[i][j+1] == undefined && this.protopieces[i][j-1] == undefined){
            this.protopieces[i][j] = i+j;
            this.protopieces[i][j+1] = i+j;
            this.protopieces[i][j-1] = i+j;
            shapeform[0] = 12;
            shapeform[1] = 17;
            shapeform[2] = 7;
            return [i, j, shapeform];
            //return [i,j,0,2];
          }
        }else if(shape ===6 && j<=lines-2 && i<=lines-2 && j>=1){
          if(this.protopieces[i][j] == undefined && this.protopieces[i][j+1] == undefined && this.protopieces[i][j-1] == undefined && this.protopieces[i+1][j-1] == undefined){
            this.protopieces[i][j] = i+j;
            this.protopieces[i+1][j-1] = i+j;
            this.protopieces[i][j+1] = i+j;
            this.protopieces[i][j-1] = i+j;
            shapeform[0] = 12;
            shapeform[1] = 7;
            shapeform[2] = 8;
            shapeform[3] = 17;
            return [i, j, shapeform];
          }
        }else if(shape ===7 && j<=lines-2 && i<=lines-2&& j>=1){
          if(this.protopieces[i][j] == undefined && this.protopieces[i][j+1] == undefined && this.protopieces[i][j-1] == undefined && this.protopieces[i+1][j] == undefined && this.protopieces[i+1][j+1] == undefined){
            this.protopieces[i][j] = i+j;
            this.protopieces[i+1][j+1] = i+j;
            this.protopieces[i][j+1] = i+j;
            this.protopieces[i][j-1] = i+j;
            this.protopieces[i+1][j] = i+j;
            shapeform[0] = 12;
            shapeform[1] = 7;
            shapeform[2] = 13;
            shapeform[3] = 17;
            shapeform[4] = 18;
            return [i, j, shapeform];
          }
        }else if(shape ===8 && j<=lines-1 && i<=lines-2 && j>=1 && i>=1){
          if(this.protopieces[i][j] == undefined && this.protopieces[i+1][j-1] == undefined && this.protopieces[i-1][j] == undefined && this.protopieces[i+1][j] == undefined){
            this.protopieces[i][j] = i+j;
            this.protopieces[i+1][j-1] = i+j;
            this.protopieces[i-1][j] = i+j;
            this.protopieces[i+1][j] = i+j;
            shapeform[0] = 12;
            shapeform[1] = 11;
            shapeform[2] = 13;
            shapeform[3] = 8;
            return [i, j, shapeform];
          }
        }else if(shape === 9 && j<=lines-2 && i>=1){
          if(this.protopieces[i][j] == undefined && this.protopieces[i][j+1] == undefined && this.protopieces[i-1][j] == undefined){
            this.protopieces[i][j] = i+j;
            this.protopieces[i][j+1] = i+j;
            this.protopieces[i-1][j] = i+j;
            shapeform[0] = 12;
            shapeform[1] = 17;
            shapeform[2] = 11;
            return [i, j, shapeform];
            //return [i,j,0,2];
          }
        }
      }
    }
    return false;
  };

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
