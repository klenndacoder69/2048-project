//global variables:
var grid_elements = document.getElementsByClassName("playview-item");
var grid_values = Array.from({length:16}, () => 0);  //grid value array, sets the length to 16

//end of global variables...
function randomizeNumbers(){
    //random number will be picked through grid values that are equal to zero (open spaces)
    var open_slots = [];
    for(var a = 0; a < grid_values.length; a++){
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

    for(let i = 0; i < 16; i++){
        const playviewItem = document.createElement('div');
        playviewItem.classList.add('playview-item');
        playviewContainer.appendChild(playviewItem);
    }
}

function updateGrid(index, value){
   //check whether the cell has a value
    if(grid_values[index] == 0){
        grid_values[index] = value;
        grid_elements[index].innerHTML = value;         
    }
  console.log(grid_values);
}

function random_values(){
    var values = [2,4];
    var randIndex = Math.floor(Math.random() * values.length);
    return values[randIndex];
}
function onClickContainer(){
    
    var index = randomizeNumbers();
    //or you can just create a list containing all the grid elements, and just change their values there.
    //get that specific grid element
    var item = grid_elements[index];
    var value = random_values();
    //insertion of '4' will be implemented later
    updateGrid(index, value);
    //we can keep track of the numbers by appending it to a list?

}

function handleDragMovement(){
     /*
    User may do an up, down, left, right stroke
    After the stroke (drag), number may or may not disappear
    */ 

}   


document.addEventListener('DOMContentLoaded', function (){ //when website starts its first load, then perform starting set-up
    createGrid();
    updateGrid(randomizeNumbers(), 2); //sets number for starting grid
    updateGrid(randomizeNumbers(), 2); //sets 2nd number for starting grid
    document.getElementById("debug-purposes").innerHTML = randomizeNumbers();
    document.getElementById("playview-container").onclick = onClickContainer;
}); //keep note that I passed the function reference. using createGrid() will return an undefined since you already executed it before the DOM even loaded