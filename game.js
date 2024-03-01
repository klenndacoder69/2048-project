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
    /*
    Clicking and dragging are two different things. Thus, we must consider a distance to
    where a mouse 'drag' is actually a dragging scenario and not a clicking scenario.
    */
    var negX;
    var negY;
    const dragDistance = 6;
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
                }
                else{
                    console.log("positive x drag");
                }
            }
            else{ //we consider the up and down drag
                if(negY){
                    console.log("negative y drag");
                }
                else{
                    console.log("positive y drag");
                }
            }
        }
    })

}   


document.addEventListener('DOMContentLoaded', function (){ //when website starts its first load, then perform starting set-up
    createGrid();
    updateGrid(randomizeNumbers(), 2); //sets number for starting grid
    updateGrid(randomizeNumbers(), 2); //sets 2nd number for starting grid
    document.getElementById("debug-purposes").innerHTML = randomizeNumbers();
    document.getElementById("playview-container").onclick = onClickContainer;
    handleDragMovement();
}); //keep note that I passed the function reference. using createGrid() will return an undefined since you already executed it before the DOM even loaded