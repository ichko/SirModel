var ModelHelper = (function(){
    var ModelHelper = {};

    ModelHelper.getNeightbours = function(agent, agents, distance){
        distance = distance || 10;
        var neighbours = [];
        for (var i = 0; i < agents.length; i++) {
            if(agent.pos.distance(agents[i].pos) < distance){
                neighbours.push(agents[i]);
            }
        }
        return neighbours;
    }

    return ModelHelper;
})();


/////////////////////////////////
////////////////////////////////


Number.prototype.mod = function(n) {
    return ((this % n) + n) % n;
};


var World = (function(){
    function World(model, size){
        this.model = model;
        this.size = size || {width: 100, height: 100};
        this.agents = [];
    }

    World.prototype.nextState = function(){
        for (var i = 0; i < this.agents.length; i++) {
            this.model.mutateAgent(this.agents[i], this);
        }
    }

    World.prototype.render = function(context){
        for (var i = 0; i < this.agents.length; i++) {
            context.beginPath();
            context.fillStyle = this.agents[i].status.background();
            context.arc(this.agents[i].pos.x, this.agents[i].pos.y,
                    this.agents[i].size, 0, 2 * Math.PI);
            context.fill();
        }
    }

    World.prototype.populate = function(cnt, width, height, mutateAgent){
        this.size = {width: width, height: height};
        for (var i = 0; i < cnt; i++) {
            var ag = new Agent(
                new Vector(Math.random() * width,Math.random() * height),
                new Status({red: 200, green: 20, blue: 20})
            );
            mutateAgent && mutateAgent(ag);

            this.agents.push(ag);
        }

        return this;
    }

    return World;
})();


var Agent = (function(){
    function Agent(pos, status){
        this.pos = pos || new Vector();
        this.size = 12;
        this.direction = 0;
        this.status = status || new Status();
        this.speed = Math.random() + 1;
    }

    Agent.prototype.touches = function(agent){
        return this.pos.distance(agent.pos) < this.size + agent.size;
    }

    return Agent;
})();


var Status = (function(){
    function Status(color, value){
        this.value = value || 0;
        this.color = color || {
            red:   Math.round(Math.random() * 250),
            green: Math.round(Math.random() * 250),
            blue:  Math.round(Math.random() * 250)
        };
    }

    Status.prototype.background = function(){
        if(typeof this.color === 'string')
            return this.color;
        return 'rgb(' + this.color.red   + ',' +
                        this.color.green + ',' +
                        this.color.blue  + ')';
    }

    return Status;
})();


var Vector = (function(){
    function Vector(x, y){
        this.x = x || 0;
        this.y = y || 0;
    }

    Vector.prototype.length = function(){
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    Vector.prototype.distance = function(vect){
        return Math.sqrt((this.x - vect.x) * (this.x - vect.x) +
                         (this.y - vect.y) * (this.y - vect.y));
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

    Vector.prototype.direction = function(vect){
        return Math.atan2(vecy.y - this.y, vect.x - this.x);
    }

    Vector.prototype.scale = function(n){
        this.x *= n;
        this.y *=  n;
        return this;
    }

    return Vector;
})();
