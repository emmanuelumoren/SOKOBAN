/*
	In this solution, we used 3 functions and the executing order is:
	1. drawMap : takes one parameter which is the map object to draw the game map
	2. readKey : doesn't take any parameters, waits user to press a key
	3. move    : takes 2 parameters, entity and movement direction
*/
(function() {

	// draw the sokoban map
	function drawMap(map) {
		// create the main div
		var main = document.createElement("div");
		// set the main div width to map grid * 32 px, in order to set the width to dynamic size
		main.style.width = map.width * 32 + "px";
		// loop through the multidimensional array, the rows first
		for(var row = 0;row < map.height;row++) {
			var rowDiv = document.createElement("div"); // create the row handle
			for(var cell = 0;cell < map.width;cell++) { 
				var cellDiv = document.createElement("div"); // create the columns
				cellDiv.id = row + "-" + cell; 				// set current column id
				if(map.mapGrid[row][cell][0] === "W") { // if the current column value equals "W", assign wall class to the element
					cellDiv.className = Tiles.Wall;
				} else if(map.mapGrid[row][cell][0] === "G") { // if the current column value equals "G", assign goal class to the element
					cellDiv.className = Tiles.Goal;
				} else {										// anything else, assign "space" class to the element
					cellDiv.className = Tiles.Space;
				}
				if(map.mapGrid[row][cell][0] === "P") { // if the current column value equals "P", assign character class to the element
					player.positionX = row;				// set the player positionX
					player.positionY = cell;			// set the player positionY
					cellDiv.classList.add(Entities.Character);	// set the player object type
				} else if (map.mapGrid[row][cell][0] === "B") { // if the current column value equals "B", assign block class to the element
					// add block class
					cellDiv.classList.add(Entities.Block);		
					// create new object of type block and set positions, type and push it into blocks array
					blocks.push({positionX: row, positionY: cell, isPlayer: false, type: Entities.Block});
				}
				// assign css float left property to the element to set all elements in one row
				cellDiv.style.float = "left"
				rowDiv.appendChild(cellDiv); // append current element to current row
			}
			main.appendChild(rowDiv); // append current row to the main element
		}
		document.body.appendChild(main); // append the main element to the body element
	}
           // this line of code use Eventlistener Button on the webpage//
    document.getElementById ("buttonUp").addEventListener("click",() => move(player,"up"));
    document.getElementById ("buttonDown").addEventListener("click",() => move(player,"down"));
    document.getElementById ("buttonLeft").addEventListener("click",() => move(player,"left"));
    document.getElementById ("buttonRight").addEventListener("click",() => move(player,"right"));

    document.addEventListener("keydown",(event) => readKey(event));

	// movement function, takes 2 parameters. "entity" is the element to move and "direction" is the direction :)
	function move(entity, direction) {
		// set temporary positions, because javascripts passes by reference
		var x = entity.positionX; // temporary position x 
		var y = entity.positionY; // temporary position y
		// change x or y value relying the direction
		switch(direction) {
			case "left":
				y--;
				break;
			case "up":
				x--;
				break;
			case "right":
				y++;
				break;
			case "down":
				x++;
				break;
			default:
				return false;
		}
		// get new and old positions
		var nPosition = document.getElementById(x + "-" + y); 
		var oPosition = document.getElementById(entity.positionX + "-" + entity.positionY);
		// check if the new position is wall
		if(nPosition.classList.contains(Tiles.Wall)) {
			return false;
		} else {
			// check if the new position is block
			if(nPosition.classList.contains(Entities.Block)) {
				var blockIndex = blocks.findIndex((e, i) => e.positionY == y && e.positionX == x);
				var block = blockIndex > -1 ? blocks[blockIndex] : null; // create new variable to set block info
				if(block !== null) {
					if(!entity.isPlayer) {
						return false;
					}
					if(!move(block, direction)){
						return false;
					}
					// if the block has been found and current entity is the player and the block is movable, move the block :)
					nPosition.classList.add(entity.Type);
					oPosition.classList.remove(entity.Type);
				}
			}
		}
		// move the player :)
		nPosition.classList.add(entity.type);
		oPosition.classList.remove(entity.type);
		// sets the player new positions
		entity.positionX = x;
		entity.positionY = y;
		return true;
	}

	// get pressed key from the keyboard players//
	function readKey(event) {
		switch(event.keyCode) {
			case 37:
				move(player, "left");
				break;
			case 38:
				move(player, "up");
				break;
			case 39:
				move(player, "right");
				break;
			case 40:
				move(player, "down");
				break;
			default:
				break;
		}
	}

	// empty array to store blocks positions
	var blocks = [];
	// the player object
	var player = {
		positionX: 0,
		positionY: 0,
		isPlayer: true,
		type: Entities.Character
	}
	document.onreadystatechange = function() {
		if(document.readyState === 'complete') {
			drawMap(tileMap01); // draw the map :)
			document.onkeyup = readKey; // event listener
		}
	}
})();