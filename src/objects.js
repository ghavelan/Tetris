//SPRITE IMAGE
var spriteObject =
{
  sourceX      : 0,
  sourceY      : 0,
  sourceWidth  : 16,
  sourceHeight : 16,
  width        : 16,
  height       : 16,
  x            : 0,
  y            : 0
};

//BOARD
var boardObject =
{
  grid              : [],
  ROWS              : 0,
  COLUMNS           : 0,
  FREE              : 0,
  FALLING           : 1,
    
  create            : function(row, col)
  {
    this.ROWS = row;
    this.COLUMNS = col;

    for(var i = 0; i < row; i++){
      this.grid.push([]);
      for(var j = 0; j < col; j++){
        this.grid[i].push(this.FREE);
      }
    }
  },

  get               : function(x, y){
    return this.grid[y][x];
  },

  set               : function(x, y, value){
    this.grid[y][x] = value;
  },

  replaceValue      : function(oldValue, newValue){
     for(var i = 0; i < this.ROWS; i++){

      for(var j = 0; j < this.COLUMNS; j++){

        if(this.grid[i][j] === oldValue){
          
          this.grid[i][j] = newValue;
        }
      }
    }
  },

  clearCurrentPiece : function(){
    for(var i = 0; i < this.ROWS; i++){
      for(var j = 0; j < this.COLUMNS; j++){
        if(this.grid[i][j] === this.FALLING){
          
          this.grid[i][j] = this.FREE;
        }
       
      }
    }
  },

  clearLines        : function(){
    var number = 0;
    for(var row = 0; row < this.ROWS; row++){
      var isfilled = true;
      for(var col = 0; col < this.COLUMNS; col++){
        if(this.grid[row][col] === this.FREE){
          isfilled = false;
        }
      }

      if(isfilled){
        ++number;
        this.grid.splice(row, 1);
        var toAdd = [];
        for(var j = 0; j < this.COLUMNS; j++){

          toAdd.push(this.FREE);
        }
        this.grid.unshift(toAdd);
      }
      
    }
    return number;
  }

};

//PIECE
var pieceObject       = Object.create(spriteObject);
pieceObject.rotations = 4;
pieceObject.type      = 0;
pieceObject.color     = 0x0000FF;//Blue
pieceObject.blocks    = [0x0660, 0x0660, 0x0660, 0x0660];

pieceObject.update = function(){

  switch(this.type){

      case 0:
        this.sourceX = 10*this.width;
        this.sourceY = 0;
        this.blocks  = [0x0660, 0x0660, 0x0660, 0x0660];
        this.color   = 0x0000FF;//Blue
        break;

      case 1:
        this.sourceX = 12*this.width;
        this.sourceY = 0;
        this.blocks  = [0x0F00, 0x2222, 0x0F00, 0x2222];
        this.color   = 0x808080;//Gray --> orange in the tilesheet
        break;

      case 2:
        this.sourceX = 11*this.width;
        this.sourceY = 0;
        this.blocks  = [0x0360, 0x2310, 0x0360, 0x2310];
        this.color   = 0x008000;//Green
        break; 

      case 3:
        this.sourceX = 13*this.width;
        this.sourceY = 0;
        this.blocks  = [0x0630, 0x1320, 0x0630, 0x1320];
        this.color   = 0x4B0082;//Purple
        break;

      case 4:
        this.sourceX = 10*this.width;
        this.sourceY = this.width;
        this.blocks  = [0x0740, 0x2230, 0x1700, 0x6220];
        this.color   = 0xFF0000;//Red
        break;

      case 5:
        this.sourceX = 11*this.width;
        this.sourceY = this.width;
        this.blocks  = [0x0710, 0x3220, 0x4700, 0x2260];
        this.color   = 0xFFFFFF;//White
        break;

      case 6:
        this.sourceX = 12*this.width;
        this.sourceY = this.width;
        this.blocks  = [0x0720, 0x2320, 0x2700, 0x2620];
        this.color   = 0xFFFF00;//Yellow
        break;
    }
};

pieceObject.selectRandomPiece = function(){
    this.type = Math.floor(Math.random() * 7);
    this.update();
    return this;  
   };   

 


