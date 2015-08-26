(function(){

	// The canvas
	var canvas = document.querySelector("canvas");

	// Create the drawing surface 
	var drawingSurface = canvas.getContext("2d");

	// Variables used to store square size, number of rows and columns
	const SIZE    = 16;
	const ROWS    = 23;
	const COLUMNS = 10;

	// Color code of the pieces
	const	BLUE   = 0x0000FF;
	const	GRAY   = 0x808080;
	const	GREEN  = 0x008000;
	const	PURPLE = 0x4B0082;
	const	RED    = 0xFF0000;
	const	WHITE  = 0xFFFFFF;
	const	YELLOW = 0xFFFF00;

	// Score, lines and level
	var score             = 0;
	var lines             = 0;
	var totalLines        = 0;
	var simultaneousLines = 0;
	var level             = 1;

	//HTML elements
	var GAME_SCORE = document.getElementById("score");
	var GAME_LINES = document.getElementById("lines");
	var GAME_LEVEL = document.getElementById("level");
	var GAME_STATES = document.getElementById("states");
	
	//Array to store the 7 colors
	const COLORS = [BLUE, GRAY, GREEN, PURPLE, RED, WHITE, YELLOW];

	/* Object used to store the X and Y coordinates of the tilesheet's blocks according to the color 
	   (don't forget to multiply by block size at the end)
	*/
	const blockPosition = 
	{
		BLUE   : [10, 0],
		GRAY   : [12, 0],
		GREEN  : [11, 0],
		PURPLE : [13, 0],
		RED    : [10, 1],
		WHITE  : [11, 1],
		YELLOW : [12, 1]
	};

	//Arrows and space key codes
	const UP    = 38;
	const RIGHT = 39;
	const DOWN  = 40;
	const LEFT  = 37;
	const SPACE = 32;
	const PAUSE = 80;//p

	//Variable used to start/pause the game
	var play = false;

	//Arrays to store the game objects and assets to load
	var sprites      = [];
	var assetsToLoad = [];

	//Game states
	var LOADING   = 0;
	var PLAYING   = 1;
	var OVER      = 2;
	var gameState = LOADING;

	//Speed of the falling pieces
	var cptr          = 0;
	var frequency     = 30;

	//Moving time when a piece is dropped
	var last          = 0;
	var lastFrequency = 30;

	//Directions
	var moveRight      = false;
	var moveLeft       = false;
	var moveUp         = false;
	var moveSpace      = false;
	var spaceKeyIsDown = false;
	var rightKeyIsDown = false;
	var leftKeyIsDown  = false;
	var upKeyIsDown    = false;
	var pauseKeyIsDown = false;

	//Create the background
	var background          = Object.create(spriteObject);
	background.sourceWidth  = 160;
	background.sourceHeight = 320;
	background.width        = 160;
	background.height       = 320;

	sprites.push(background);
	
	//Create the game board
    var board = Object.create(boardObject);
    board.create(ROWS, COLUMNS);

    //Color of the current piece
    var pieceColor = board.FALLING;

    //Create a random piece
	var piece        = Object.create(pieceObject);
	var currentPiece = piece.selectRandomPiece();

	/*	Initial position of the Tetris piece :
		posX : X-coordinatee of the 4 by 4 grid's upper-left corner
		posY : Y-coordinatee of the the 4 by 4 grid's upper-left corner
		upManagement : one of the four rotations (0 -> 3)
	*/
	var posX         = 3;
	var posY         = 0;
	var upManagement = 0;
	
	if(isPossible(currentPiece, posX, posY, upManagement)){
		newPiece = true;
		placeFourbyFourGrid(currentPiece, posX, posY, upManagement, board.FALLING);

	}
	
	//Load the tilesheet image
	var image = new Image();
	image.addEventListener("load", loadHandler, false);
	image.src = "../images/spritesheet.png";
	assetsToLoad.push(image);

	//Variable to count the number of assets the game needs to load
	var assetsLoaded = 0;

	//Add keyboard listeners
	window.addEventListener("keydown", function(event){

	  switch(event.keyCode){

		  case LEFT:

		    if(!leftKeyIsDown){

			    if(canMove(LEFT)){

			    	--posX;
			    }

			    leftKeyIsDown = true;
			    moveLeft      = true;	      		
		    }
		   
		    break;  
		    
		  case RIGHT:

		  	if(!rightKeyIsDown){

			    if(canMove(RIGHT)){

			    	++posX;
			    }

			    rightKeyIsDown = true;
			    moveRight      = true;	 		      		
		    }
		    
		    break;

		  case UP:

		  	if(!upKeyIsDown){

			    if(canMove(UP)){

			    	++upManagement;

			    	if(upManagement === piece.rotations){

			    		upManagement = 0;
			    	}
			    }

			    upKeyIsDown = true;
			    moveUp      = true;	
			    
		    }
		    
		    break;
		 
		  case SPACE:

		    if(!spaceKeyIsDown){

		      while(canMove(DOWN)){

		      	++posY;

		      }
		      spaceKeyIsDown = true;
		      moveSpace      = true;

		    }
		   
		    break;

		  	case PAUSE:

		  		if(!pauseKeyIsDown){

		  			play = !play;
		  			pauseKeyIsDown = true;
		  		}
	   }

	}, false);

	window.addEventListener("keyup", function(event){

	  switch(event.keyCode){

		  case LEFT:
		    moveLeft      = false;
		    leftKeyIsDown = false;
		    break;  
		    
		  case RIGHT:
		    moveRight      = false;
		    rightKeyIsDown = false;
		    break; 

		  case UP:
		    moveUp      = false;
		    upKeyIsDown = false;
		    break;
		
		  case SPACE:
		  	moveSpace      = false;
		  	spaceKeyIsDown = false;
		    break;

		  case PAUSE:
		  	pauseKeyIsDown = false;
		    break;
	  }
	}, false);
	
	//Start the game animation loop
	update();

	function update(){ 
  		//The animation loop
  		requestAnimationFrame(update, canvas);

  		switch(gameState){

		    case LOADING:

		      break;
		    
		    case PLAYING:

		    	if(play){
		    		playGame();
		    	}
		      
		      break;
		    
		    case OVER:

		      endGame();
		      break;
  		}
  		//Render the game
  		render();
  
  	}
  
	function loadHandler(){ 
  		assetsLoaded++;
  		if(assetsLoaded === assetsToLoad.length){
    		//Remove the load event listener
    		image.removeEventListener("load", loadHandler, false);
    		//Start the game 
    		gameState = PLAYING;        
  		}
	}

	function render(){ 
  		drawingSurface.clearRect(0, 0, canvas.width, canvas.height);
  		//Display the background and sides
  		for(var i = 0, len = sprites.length; i < len; i++){
  			var sprite = sprites[i];
  			drawingSurface.drawImage(
	        		image, 
	        		sprite.sourceX, sprite.sourceY, 
	        		sprite.sourceWidth, sprite.sourceHeight,
	        		Math.floor(sprite.x), Math.floor(sprite.y+48), 
	        		sprite.width, sprite.height
      		    	); 

  		}
  		
  		//Display the blocks
  		for(var i = 0; i < ROWS; i++){
  			for(var j = 0; j < COLUMNS; j++){
  				var pieceColor = board.get(j, i);
  				//If it is a block of the current piece
  				if(pieceColor === board.FALLING){
  					drawingSurface.drawImage(
	        				image, 
	        				currentPiece.sourceX, currentPiece.sourceY, 
	        				SIZE, SIZE,
	        				Math.floor(j*SIZE), Math.floor(i*SIZE), 
	        				SIZE, SIZE
	        		   	); 
	        		
  				}
  				//If it is an old block (with one of the 7 colors above)
  				else if(COLORS.indexOf(pieceColor) !== -1){ 				
  					var x, y;
  					switch(pieceColor){

  						case BLUE:
	  						x = blockPosition.BLUE[0];
	  						y = blockPosition.BLUE[1];
	  						break;
  						case GRAY:
	  						x = blockPosition.GRAY[0];
	  						y = blockPosition.GRAY[1];
	  						break;
  						case PURPLE:
	  						x = blockPosition.PURPLE[0];
	  						y = blockPosition.PURPLE[1];
	  						break;
  						case GREEN:
	  						x = blockPosition.GREEN[0];
	  						y = blockPosition.GREEN[1];
	  						break;
  						case RED:
	  						x = blockPosition.RED[0];
	  						y = blockPosition.RED[1];
	  						break;
  						case YELLOW:
	  						x = blockPosition.YELLOW[0];
	  						y = blockPosition.YELLOW[1];
	  						break;
  						case WHITE:
	  						x = blockPosition.WHITE[0];
	  						y = blockPosition.WHITE[1];
	  						break;
  					}

  					drawingSurface.drawImage(
	        				image, 
	        				x*SIZE, y*SIZE, 
	        				SIZE, SIZE,
	        				Math.floor(j*SIZE), Math.floor(i*SIZE), 
	        				SIZE, SIZE
	        			); 
  				}
  			}
  		}

  		drawingSurface.clearRect(0, 0, canvas.width, 48);
	}

	function playGame(){
		 //If the current piece can move downward
		if(canMove(DOWN)){
		  
		  	if(++cptr === frequency){

				cptr = 0;
		  		++posY;		  		
		  	}
		  	   			  	     	
		}
		// Else if the current piece is no longer able to move downward		  	 	  
		else {

			if(++last === lastFrequency){

				pieceColor = currentPiece.color;

				if(posY <= 1){

			  		gameState = OVER;

				}
		  	
			  	else if(!moveSpace){
			  				  				  
			  		board.replaceValue(board.FALLING, pieceColor);
			  		simultaneousLines = board.clearLines();
			  		score += computeScore(simultaneousLines, level);
			  		totalLines += simultaneousLines;
			  		lines += simultaneousLines;
			  		//Every 10 lines : increase the level and the speed of falling pieces
			  		if(totalLines > 0 && lines >= 10){
			  			++level;
			  			--frequency;
			  			lines = 0;
			  		}
			  		GAME_LINES.innerHTML = totalLines;
			  		GAME_SCORE.innerHTML = score;
			  		GAME_LEVEL.innerHTML = level;
			  		simultaneousLines = 0;
				  	currentPiece = piece.selectRandomPiece();
				  	posX = 3;
				  	posY = 0;
				  	upManagement = 0;
				  	pieceColor = board.FALLING;
				  			  			  				  		
			  	}

		  		last = 0;
			}

		}
		
		board.clearCurrentPiece();
		placeFourbyFourGrid(currentPiece, posX, posY, upManagement, pieceColor);
		  	 		  		  
	}

	function endGame(){
		GAME_STATES.innerHTML = "<p> <strong>GAME OVER !</strong></p>";
	}

	
	function selectFourbyFourGrid(type, x, y, rotation, funct) {
	  	 var row   = 0;
	  	 var col   = 0;
	  	 var block = type.blocks[rotation];
  
	  	for(var mask = 0x8000 ; mask > 0 ; mask = mask >> 1) 
	  	{

	    	if(block & mask){
	    	
	    		funct(x+col, y+row);	

	    	}

	    	if (++col === 4) {
	    
		      	col = 0;
		      	++row;
	    	}

	  	}
  
	 }
	 
	function placeFourbyFourGrid(type, x, y, rotation, value) {
	    selectFourbyFourGrid(type, x, y, rotation, function(x, y){
	   		
	   		board.set(x, y, value);
	   	
	    }); 	
	      	
	}

	/*Check if the cells where to place the Tetris piece are occupied or not
	 (x, y) = upper left corner of the 4 by 4 grid.*/
	function isPossible(type, x, y, rotation) {
	  	var result = true;
	  	selectFourbyFourGrid(type, x, y, rotation, function(x, y){

	  		if(x < 0 || x >= COLUMNS || y < 0 || y >= ROWS || isFilled(x, y)){

				result = false;
				
			}

	  	}); 	    	
		 
	  	return result;
  
	 }

	 /* Check if the cell at (x, y) is occupied or not.
	    It is occupied if the cell at position (x, y) contains one of the 7 colors listed above
	 */
	 function isFilled(x, y){
	 	
	 	return COLORS.indexOf(board.get(x, y)) !== -1;
	 }

	 // Manage moves
	 function canMove (direction){

	 	var result = true;
	 	var position;

	 	switch(direction){

	 		case LEFT:
		 		position = posX - 1;
			     //If it is not possible to move the piece to the left
			      if(!isPossible(currentPiece, position, posY, upManagement)){

			      	result = false;
			      }		      
	 		break;

	 		case RIGHT:
		 		position = posX + 1;
			     //If it is not possible to move the piece to the left
			      if(!isPossible(currentPiece, position, posY, upManagement)){

			      	result = false;
			      }
	 		break;

	 		case DOWN:
		 		position = posY + 1;
			    //If it is not possible to move the piece downward
			    if(!isPossible(currentPiece, posX, position, upManagement)){
			      	
			      result = false;
			    }

	 		break;

	 		case UP:
		 		position = upManagement + 1;

			    if(position === piece.rotations){

			      	position = 0;
			    }
			     //If it is not possible to rotate the piece
			     if(!isPossible(currentPiece, posX, posY, position)){

				     result = false;
			 	}

	 		break;
	 	}

	 	return result;

	 }

	 function computeScore(lines, level){

	 	var score = 0;

	 	if(lines ===  4){
	 		score = 1200*(level+1);
	 	}
	 	else if(lines === 3){
	 		score = 300*(level+1);
	 	}
	 	else if(lines === 2){
	 		score = 100*(level+1);
	 	}
	 	else if(lines === 1){
	 		score = 40*(level+1);
	 	}

	 	return score;
	 }

}());
