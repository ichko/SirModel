Number.prototype.mod = function(n) {
    return ((this % n) + n) % n;
};

var eps = 10;


var World = (function(){
    function World(){
        this.agents = [];
        this.size = {width: 100, height: 100};
    }

    World.prototype.nextState = function(){
        for (var i = 0; i < this.agents.length; i++) {
            this.agents[i].move(this.size);
        }
    }

    World.prototype.render = function(ctx){
        for (var i = 0; i < this.agents.length; i++) {
            this.agents[i].render(ctx);
        }
    }

    World.prototype.randomInit = function(cnt, width, height){
        this.size = {width: width, height: height};
        for (var i = 0; i < cnt; i++) {
            var ag = new Agent(new Vector(Math.random() * width, Math.random() * height));
            this.agents.push(ag);
        }
    }

    return World;
})();

function Status(value){
    this.value = value || 0;
    this.color = 'rgb(' + Math.round(Math.random() * 255) + ',' +
                          Math.round(Math.random() * 255) + ',' +
                          Math.round(Math.random() * 255) + ')';
}

Status.prototype.background = function(){
    return this.color;
}


function Vector(x, y){
    this.x = x || 0;
    this.y = y || 0;
}

Vector.prototype.length = function(){
    return Math.sqrt(this.x * this.x + this.y * this.y);
}

Vector.prototype.distance = function(vect){
    return Math.sqrt((this.x - vect.x) * (this.x - vect.x) + (this.y - vect.y) * (this.y - vect.y));
}

Vector.prototype.direction = function(vect){
    return new Vector(vect.x - this.x, vect.y - this.y);
}

Vector.prototype.translate = function(vect){
    this.x += vect.x;
    this.y += vect.y
    return this;
}

Vector.prototype.normalize = function(){
    var len = this.length();
    this.x /= len;
    this.y /= len;
    return this;
}

Vector.prototype.scale = function(n){
    this.x *= n;
    this.y *=  n;
    return this;
}


function Agent(pos, state){
    this.pos = pos || new Vector();
    this.size = 2 + Math.random() * 5;
    this.speed = 1 + Math.random() * 3;
    this.direction = 0;
    this.state = state || new Status();
}

Agent.prototype.move = function(size){
    this.direction += Math.random() / 2 - 0.25;
    var translateVect = new Vector(this.speed * Math.cos(this.direction), this.speed * Math.sin(this.direction));
    this.pos.translate(translateVect);
    this.pos.x = this.pos.x.mod(size.width);
    this.pos.y = this.pos.y.mod(size.height);
}

Agent.prototype.render = function(ctx){
    ctx.beginPath();
    ctx.fillStyle = this.state.background();
    ctx.arc(this.pos.x, this.pos.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
}
