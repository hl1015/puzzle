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
