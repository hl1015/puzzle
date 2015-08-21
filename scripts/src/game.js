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
