//TODO: connect obstacles to form walls
//TODO: remove neighbors that aren't accessible

function removeFromArray(arr,obj){
    for(var i = arr.length - 1; i >= 0; i--){
        if(arr[i] == obj){
            arr.splice(i,1);
        }
    }
}

function estimate(a,b,h){
    if(h === "Euclidean"){
        return dist(a.x,a.y,b.x,b.y);
    }else if(h === "Manhatten"){
        return abs(a.x - b.x) + abs(a.y - b.y);
    }else{
        return console.error("NOT A HEURISTIC");
    }
}


var rows = 50;
var cols = 50;
var grid = new Array(cols);

var w, h;

var openSet = [];
var closedSet = [];
var start;
var end;
var path = [];
var noSolution = false; 

//Constructor for Cell 
function Cell(x,y){
    this.x = x;
    this.y = y;

    this.f = 0;
    this.g = 0;
    this.h = 0;

    this.neighbors = [];

    this.parent = undefined;

    this.obstacle = false;

    if(random(1) < 0.4){
        this.obstacle = true;
    }

    this.show = function(col) {
        fill(col);
        noStroke();
        if(this.obstacle) {
            fill(0);
            ellipse(this.x * w + w/2,this.y * h + h/2, w/2, h/2);

        }else{
            rect(this.x * w,this.y * h, w, h);
        }
    }

    this.addNeighbors = function(grid){
        var i = this.x;
        var j = this.y;

        var rowLimit = grid.length-1;
        var columnLimit = grid[0].length-1;
    
        for(var x = Math.max(0, i-1); x <= Math.min(i+1, rowLimit); x++) {
        for(var y = Math.max(0, j-1); y <= Math.min(j+1, columnLimit); y++) {
            if(x !== i || y !== j) {
                this.neighbors.push(grid[x][y]);
            }
        }
        }
    }
}

function setup(){
    createCanvas(400,400);
    console.log("A*");

    w = width / cols;
    h = height / rows;

    //Making a 2D array for a "grid"
    for(var i = 0; i < cols; i++){
        grid[i] = new Array(rows);
    }

    for(var i = 0; i < cols; i++){
        for(var j = 0; j < rows; j++){
            grid[i][j] = new Cell(i,j); 
        }
    }

    for(var i = 0; i < cols; i++){
        for(var j = 0; j < rows; j++){
            grid[i][j].addNeighbors(grid); 
        }
    }

    start = grid[0][0];
    end = grid[cols - 1][rows - 1];

    start.obstacle = false;
    end.obstacle = false;

    openSet.push(start);
}

function draw(){

    if(openSet.length > 0){

        //finds the current where current:= node with lowest f distance
        var lowestIndex = 0;
        for(var i = 0; i < openSet.length; i++){
            if(openSet[i].f < openSet[lowestIndex].f){
                lowestIndex = i;
            }
        }
        var current = openSet[lowestIndex];

        //if the current cell is the goal/end then the path has been found
        if(current === end){

            //Find the path
            noLoop();

            console.log("DONE");

            console.log(grid);

        }

        //the current cell has been explored
        removeFromArray(openSet,current);
        closedSet.push(current);

        var neighbors = current.neighbors;
        for(var i = 0; i < neighbors.length; i++){
            neighbor = neighbors[i];
            if(!closedSet.includes(neighbor) && !neighbor.obstacle){

                var tentative_g = current.g + 1;

                var newPath = false;
                if(openSet.includes(neighbor)){
                    if(tentative_g < neighbor.g){
                        neighbor.g = tentative_g;
                        newPath = true;
                    }
                }else{
                    neighbor.g = tentative_g;
                    newPath = true;
                    openSet.push(neighbor);
                }
                if(newPath){
                    neighbor.h = estimate(neighbor,end,"Manhatten");
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.parent = current;
                }
            }
                
        }

    }else{
        console.log("No solution");
        noLoop();
        return;
        //no solution found
    }

    background(255);

    //show all cells as white
    for(var i = 0; i < cols; i++){
        for(var j = 0; j < rows; j++){
            grid[i][j].show(color(255));
        }
    }

    //show all cells in the openSet as green
    for(var i = 0; i < openSet.length; i++){
        openSet[i].show(color(0,255,0,63));
    }

    //show all cells in the closedSet as red
    for(var i = 0; i < closedSet.length; i++){
        closedSet[i].show(color(255,0,0,63));
    }

    path = [];
    var tmp = current;
    path.push(tmp);

    while(tmp.parent){
        path.push(tmp.parent);
        tmp = tmp.parent;
    }

    for(var i = 0; i < path.length; i++){
        // path[i].show(color(0,0,255));
    }
   
    noFill();
    stroke(255,0,200);
    strokeWeight(w/4);
    beginShape();
    for(var i = 0; i < path.length; i++){
        vertex(path[i].x * w + w/2, path[i].y * h + h/2);
    }
    endShape();

}