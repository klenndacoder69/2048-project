//global variables:
const numGrid = 16; //number of grids
var grid_elements = document.getElementsByClassName("playview-item"); //array that contains the elements of the grid that are changeable
var grid_values = Array.from({length:numGrid}, () => 0);  //grid value array, sets the length to 16

//end of global variables...
function randomizeNumbers(){
    //random number will be picked through grid values that are equal to zero (open spaces)
    var open_slots = [];
    for(var a = 0; a < numGrid; a++){
        if(grid_values[a] == 0){
            //this suggests an open slot. push the index to the list
            open_slots.push(a);
        }
    }
    //find index by getting the value of the specified index in the open slots
    var index = open_slots[Math.floor(Math.random() * open_slots.length)];
    // var rand = Math.floor(Math.random() * 17);
    return index;
}
function createGrid(){
    const playviewContainer = document.getElementById('playview-container');

    for(let i = 0; i < numGrid; i++){
        const playviewItem = document.createElement('div');
        playviewItem.classList.add('playview-item');
        playviewContainer.appendChild(playviewItem);
    }
}

function addNum(index, value){
   //check whether the cell has a value
    if(grid_values[index] == 0){
        grid_values[index] = value;
    }
  console.log(grid_values);
}

function updateGrid(){ //changed updateGrid based on position of grid_values
    for(var a = 0; a < numGrid; a++){
        if(grid_values[a] == 0){
            grid_elements[a].innerHTML = "";
        }
        if(grid_values[a] != 0){
            grid_elements[a].innerHTML = grid_values[a];
        }
    }
}
function random_values(){
    var values = [2,4];
    var randIndex = Math.floor(Math.random() * values.length);
    return values[randIndex];
}
function onClickContainer(flag){
    var index = randomizeNumbers();
    //or you can just create a list containing all the grid elements, and just change their values there.
    //get that specific grid element
    var value = random_values();
    //insertion of '4' will be implemented later
    if(flag){ //CHECK THIS 23/03/2024
        addNum(index, value);
    }
    updateGrid()
    //we can keep track of the numbers by appending it to a list?

}

function handleDragMovement(){
    /*
    User may do an up, down, left, right stroke. After the stroke (drag), number may or may not disappear
    Clicking and dragging are two different things. Thus, we must consider a distance to
    where a mouse 'drag' is actually a dragging scenario and not a clicking scenario. 
    */ 
    var flag = false; //checks whether there are available moves 
    var negX;
    var negY;
    const dragDistance = 7; 
    let xStart;
    let yStart;

    document.addEventListener('mousedown', function(event){
        xStart = event.pageX; //pageX and pageY returns coordinates of mouse
        yStart = event.pageY;
   })
    
    document.addEventListener('mouseup', function(event){
        const xDis = event.pageX - xStart;
        const yDis = yStart - event.pageY;
        if(Math.sign(xDis) === -1){
            negX = true;
        }
        else{
            negX = false;
        }
        if(Math.sign(yDis) === -1){
            negY = true;
        }
        else{
            negY = false;
        }
        const xDiff = Math.abs(xDis);
        const yDiff = Math.abs(yDis);
        console.log("x is: " + (event.pageX - xStart))
        console.log("y is: " + (yStart - event.pageY))
        /*
           We consider the differences of x and y to consider on what direction
           the user is dragging to.  
        */
        
        if(!(xDiff < dragDistance && yDiff < dragDistance)){ //checks if the user drags
            if(xDiff > yDiff){ //we consider the left and right drag
                if(negX){
                    console.log("negative x drag");
                    flag = handleNumMovement(-1); //-1 : negative x
                }
                else{
                    console.log("positive x drag");
                    flag = handleNumMovement(1); // 1 : positive x
                }
            }
            else{ //we consider the up and down drag
                if(negY){
                    console.log("negative y drag");
                    flag = handleNumMovement(-2); //-2 : negative y
                }
                else{
                    console.log("positive y drag");
                    flag = handleNumMovement(2); //2 : positive y

                }
            }
            //09-03-2024 (we must handle the spawning of numbers when there are no avaiable moves)
                onClickContainer(flag); 
        }
    })

}   



function handleNumMovement(direction){ //function for handling number movement in any primary direction
    var column_arrays;
    var index_column;
    var track_grid = [...grid_values]; //spread operator to keep track of the grid_values CURRENT INSTANCE. (using track_grid = grid_values will reference track_grid to grid_values, its values constantly always being equal to grid_values)
    console.log(track_grid);
    if(direction === -1){ //neg x
        for(var a = 0; a < numGrid; a += 4){
            updateNegRow(a);
            combineNumbers(direction, a);
        }
    }
    if(direction === 1){ //pos x
        for(var a = 3; a < numGrid; a += 4){
           updatePosRow(a);
           combineNumbers(direction, a);
        }
    }
    if(direction === -2){ //neg y
        for(var a = 0; a < numGrid/4; a++){
            column_arrays = [];
            index_column = [];
            for(var b = a; b < numGrid; b+=4){
                index_column.push(b); // push the indexes
                column_arrays.push(grid_values[b]); //push the values
            }
            // updatePosRow(column_arrays.length - 1); //this means an index of 3 as the starting index
            updateNegCol(column_arrays, index_column);
            combineNumbers(direction,a);
        }
    }

    if(direction === 2){ //pos y
        for(var a = 0; a < numGrid/4; a++){
            column_arrays = [];
            index_column = [];
            for(var b = a; b < numGrid; b+=4){
                index_column.push(b);
                column_arrays.push(grid_values[b]);
            }
            updatePosCol(column_arrays, index_column);
            combineNumbers(direction,a);

        }
    }
    //check whether a value is changed. if a value is changed, this implied that there were changes in the placement of numbers
    //else there are no available moves
    console.log(track_grid);
    console.log(grid_values);
    // console.log(track_grid);
    for(var a = 0; a < grid_values.length; a++){
        if(grid_values[a] !== track_grid[a]){
            console.log(grid_values[a], " ", track_grid[a]);
            return true;
        }
    }
    return false;
}

//FUNCTIONS NECESSARY FOR COMBINING NUMBERS:

function combineNumbers(direction, startingIndex){ //function to call after moving the numbers
    var start;
    var end;
    //conditions to combine:
    //they are equal && (they are adjacent to each other || there are vacant spaces between them)
    if(direction === -1){
        end = startingIndex; 
        start = startingIndex + 3; //3 kase 4 - 1, we must not use the next row
        for(var a = start; a > end; a--){
            if(grid_values[a-1] === grid_values[a]){
                grid_values[a-1] *= 2;
                grid_values[a] = 0;
            }
        }  
    }
    if(direction === 1){
        end = startingIndex;
        start = startingIndex - 3;
        for(var a = start; a < end; a++){
            if(grid_values[a+1] === grid_values[a]){
                grid_values[a+1] *= 2;
                grid_values[a] = 0;
            }
        }
    }
    if(direction === -2){
        start = startingIndex;
        end = startingIndex + 12;
        for(var a = start; a < end; a+=4){
            console.log(a)
            if(grid_values[a] === grid_values[a+4]){
                grid_values[a+4] *= 2;
                grid_values[a] = 0;
            }
        }
    }
    if(direction === 2){
        end = startingIndex;
        start = startingIndex + 12;
        for(var a = start; a > end; a -=4){
            if(grid_values[a] === grid_values[a-4]){
                grid_values[a-4] *= 2;
                grid_values[a] = 0;
            }
        }
    }
}

//FUNCTIONS FOR UPDATING ROWS (LEFT AND RIGHT DRAG):
function updateNegRow(startingIndex){ //This functions handles the left dragging direction
    var endIndex = startingIndex + 4; 
    var vacantIndex; //this suggests the first initial vacancy of an element
    for(var index = startingIndex; index < endIndex; index++){
        vacantIndex = updateNegVacancy(startingIndex, endIndex)
        if(vacantIndex == -1){
            break;
        }   
        //find the closed container in the row
        if(grid_values[index] != 0 && index > vacantIndex){ //YESSSSSSSSSSSS GUMAGANA NA
            grid_values[vacantIndex] = grid_values[index];
            grid_values[index] = 0;    
            // console.log("SOMETHING DEBUG")
        }
    }
}

function updatePosRow(startingIndex){ //This function is an opposite implementation of updateNegRow that handles the right drag direction
    var endIndex = startingIndex - 4;
    var vacantIndex;
    for(var index = startingIndex; index > endIndex; index--){
        vacantIndex = updatePosVacancy(startingIndex, endIndex)
        if(vacantIndex == -1){
            break;
        }
        if(grid_values[index] != 0 && index < vacantIndex){
            grid_values[vacantIndex] = grid_values[index];
            grid_values[index] = 0;
            // console.log("SOMETHING DEBUG");
        }
    }
}

function updateNegVacancy(startingIndex, endIndex){ //Function that checks vacancy in a left to right direction (left being the highest priority)
    var vacantIndex;
    for(var index = startingIndex; index < endIndex; index++){
        if(grid_values[index] == 0){
            vacantIndex = index;
            // console.log("update vacancy index: " + vacantIndex);
            return vacantIndex;
        }
    }
    console.log("No vacant")
    return -1;
}

function updatePosVacancy(startingIndex, endIndex){ //Opposite implementation of updateNegVacancy (right being the highest priority)
    var vacantIndex;
    for(var index = startingIndex; index > endIndex; index--){
        if(grid_values[index] == 0){
            vacantIndex = index;
            console.log("update pos vacancy index: " + vacantIndex);
            return vacantIndex;
        }
    }
    console.log("No pos vacant");
    return -1;
}
//END OF ROW FUNCTIONS-------------------------------

//FUNCTIONS NECESSARY FOR DRAGGING COLUMNS (UP AND DOWN DRAG):
function updatePosColVacancy(startingIndex, endIndex, column_arrays){
    var vacantIndex;
    for(var index = startingIndex; index > endIndex; index--){
        if(column_arrays[index] == 0){
            vacantIndex = index;
            return vacantIndex;
        }
    }
    return -1;
}

function updateNegColVacancy(startingIndex, endIndex, column_arrays){
    var vacantIndex;
    for(var index = startingIndex; index < endIndex; index++){
        if(column_arrays[index] == 0){
            vacantIndex = index;
            return vacantIndex;
        }
    }
    return -1;
}


function updateColNumbers(column_arrays, index_column){
    for(var a = 0; a < column_arrays.length; a++){
        grid_values[index_column[a]] = column_arrays[a]; //updates the grid_values to be rendered later in updateGrid()
    }
}

function updateNegCol(column_arrays, index_column){ //keep in mind this has the same implementation of updatePosRow with added tracking of its column array and indices
    var startingIndex = column_arrays.length - 1;
    var endIndex = startingIndex - 4;
    var vacantIndex;
    for(var index = startingIndex; index > endIndex; index--){
        // vacantIndex = updatePosVacancy(startingIndex, endIndex) implementation must be changed 
        vacantIndex = updatePosColVacancy(startingIndex, endIndex, column_arrays)
        if(vacantIndex == -1){
            break;
        }
        if(column_arrays[index] != 0 && index < vacantIndex){
            column_arrays[vacantIndex] = column_arrays[index];
            column_arrays[index] = 0;
        }
    }
    updateColNumbers(column_arrays, index_column);
}

function updatePosCol(column_arrays, index_column){
    var startingIndex = 0;
    var endIndex = startingIndex + 4;
    var vacantIndex;
    for(var index = startingIndex; index < endIndex; index++){
        vacantIndex = updateNegColVacancy(startingIndex, endIndex, column_arrays);
        if(vacantIndex == -1){
            break;
        }
        if(column_arrays[index] != 0 && index > vacantIndex){
            column_arrays[vacantIndex] = column_arrays[index];
            column_arrays[index] = 0;
        }
    }
    updateColNumbers(column_arrays, index_column);
}
//END OF COLUMN FUNCTIONS--------------------------------------
function ifEqual(){ //function for checking if numbers will combine if equal during collision

}
document.addEventListener('DOMContentLoaded', function (){ //when website starts its first load, then perform starting set-up
    createGrid();
    addNum(randomizeNumbers(), 2); //sets number for starting grid
    addNum(randomizeNumbers(), 2); //sets 2nd number for starting grid
    updateGrid();
    document.getElementById("debug-purposes").innerHTML = randomizeNumbers();
    // document.getElementById("playview-container").onclick = onClickContainer;
    handleDragMovement();
}); //keep note that I passed the function reference. using createGrid() will return an undefined since you already executed it before the DOM even loaded (fixed, not used)