Number.prototype.mod = function(n) {
    return ((this % n) + n) % n;
};

var state = {
    susceptible: '#4FD5D6',
    infected: '#FF0000',
    removed: '#400D12',
}

function agent(state){
    this.state = state;
    this.lastChange = 0;
}

function* mooreTorusNeighborhood(posX, posY, grid){
    for (var i = -1; i <= 1; i++)
        for (var j = -1; j <= 1; j++)
            if(i || j) yield grid.matrix[(posX + i).mod(grid.width)][(posY + j).mod(grid.height)];
}

function mooreTorusNeighborhoodArr(posX, posY, grid){
    return [...mooreTorusNeighborhood(posX, posY, grid)];
}

function numOf(value, arr){
    var result = 0;
    for (var i = 0; i < arr.length; i++)
        result += value == arr[i].state;

        return result;
}

function kermackModel(pInfect, pRecover, wrapFactor){
    this.pInfect = pInfect;
    this.pRecover = pRecover;
    this.wrapFactor = wrapFactor;
}

kermackModel.prototype.nextState = function(agent, neighbours, generation){
    var rnd = Math.random(),
        infectedNighbours = numOf(state.infected, neighbours);
    agent.lastChange++;
    if(agent.state == state.susceptible && rnd < (1 - Math.pow(1 - this.pInfect, infectedNighbours))){
        agent.state = state.infected;
        agent.lastChange = 0;
    }else if(agent.state == state.infected && rnd < this.pRecover){
        agent.state = state.removed;
        agent.lastChange = 0;
    }else if(agent.state == state.removed && agent.lastChange > this.wrapFactor){
        agent.state = state.susceptible;
        agent.lastChange = 0;
    }
}

function grid(width, height, neighboursExtractor, model){
    this.width = width || 100;
    this.height = height || 100;
    this.neighboursExtractor = neighboursExtractor;
    this.model = model;
    this.matrix = [[]];
    this.generation = 0;
    this.stats = {};
}

grid.prototype.randomInit = function(ifectedProbability){
    this.matrix = [[]];
    this.stats = {};
    this.generation = 0;

    for (var i = 0; i < this.width; i++) {
        for (var j = 0; j < this.height; j++) {
            var rndState = Math.random() < ifectedProbability ?
                state.infected : state.susceptible;
            this.matrix[i].push(new agent(rndState));
        }
        if(i != this.width - 1)
            this.matrix.push([]);
    }
    this.updateStats();
}

grid.prototype.render = function(ctx){
    var origin = {x: 0, y: 0},
        cellSize = 6,
        cellPadding = 0;

    for (var i = 0; i < this.width; i++) {
        for (var j = 0; j < this.height; j++) {
            var color = this.matrix[i][j].state;
            ctx.fillStyle = color;
            ctx.fillRect(i * (cellSize + cellPadding),
                        j * (cellSize + cellPadding),
                        cellSize, cellSize);
        }
    }
}

grid.prototype.nextState = function(){
    var matrixCpy = copy(this.matrix);
    for (var i = 0; i < this.width; i++) {
        for (var j = 0; j < this.height; j++) {
            var neighbours = this.neighboursExtractor(i, j, this);
            this.model.nextState(matrixCpy[i][j], neighbours, this.generation++);
        }
    }

    this.matrix = matrixCpy;
    this.updateStats();
}

grid.prototype.renderStats = function(ctx){
    for (var propName in this.stats) {
        var yVals = this.stats[propName];
        ctx.beginPath();
        ctx.strokeStyle = propName;
        ctx.lineWidth = 5;
        var yScale = this.width * this.height;
        var xScale = 600 / yVals.length;
        for (var i = 1; i < yVals.length; i++) {
            var x1 = (i - 1) * xScale;
            var y1 = yVals[i - 1] / yScale * 600;
            var x2 = i * xScale;
            var y2 = yVals[i] / yScale * 600;
            ctx.moveTo(x1, 600-y1);
            ctx.lineTo(x2, 600-y2);
        }
        ctx.stroke();
        ctx.closePath();
    }
}

grid.prototype.updateStats = function(){
    var totalNumSnaps = 100;
    var snapshot = {};
    for (var i = 0; i < this.width; i++){
        for (var j = 0; j < this.height; j++){
            if(snapshot[this.matrix[i][j].state] != undefined)
                snapshot[this.matrix[i][j].state]++;
            else
                snapshot[this.matrix[i][j].state] = 0;
        }
    }
    for (var propName in snapshot) {
        if (this.stats.hasOwnProperty(propName)) {
            this.stats[propName].push(snapshot[propName]);
            if(this.stats[propName].length > totalNumSnaps)
                this.stats[propName].shift();
        }else {
            this.stats[propName] = [];
        }
    }
}

function copy(o) {
   var output, v, key;
   output = Array.isArray(o) ? [] : {};
   for (key in o) {
       v = o[key];
       output[key] = (typeof v === "object") ? copy(v) : v;
   }

   return output;
}
