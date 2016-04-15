var ModelHelper = (function(){
    var ModelHelper = {};

    ModelHelper.getNeightbours = function(agent, agents){
        var neighbours = [];
        for (var i = 0; i < agents.length; i++) {
            if(agent.pos.distance(agents[i].pos) < this.distance){
                neighbours.push(agents[i]);
            }
        }
        return neighbours;
    }

    return ModelHelper;
})();


var AgarModel = (function(){
    function AgarModel(distance){
        this.distance = distance || 10;
    }

    AgarModel.prototype.mutateAgent = function(agent, world){
        agent.move(world.size);
        var agents = world.agents;

        for (var i = 0; i < agents.length; i++) {
            if(agent.pos.distance(agents[i].pos) < agent.size + agents[i].size &&
                    agent.size > agents[i].size &&
                    agents[i].desiredSize != 0){
                agent.desiredSize += agents[i].size / 2;
                agents[i].desiredSize = 0;
            }
            if(agents[i].size < 0.01){
                agents.splice(i, 1);
            }
        }
    }

    return AgarModel;
})();



/////////////////////////////////
/////////////////////////////////



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

    World.prototype.render = function(ctx){
        for (var i = 0; i < this.agents.length; i++) {
            ctx.beginPath();
            ctx.fillStyle = this.agents[i].state.background();
            //ctx.rect(this.agents[i].pos.x, this.agents[i].pos.y,
            //         this.agents[i].size * 2, this.agents[i].size * 2);
            ctx.arc(this.agents[i].pos.x, this.agents[i].pos.y,
                    this.agents[i].size, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    World.prototype.randomInit = function(cnt, width, height){
        this.size = {width: width, height: height};
        for (var i = 0; i < cnt; i++) {
            var ag = new Agent(new Vector(Math.random() * width,
                               Math.random() * height));
            this.agents.push(ag);
        }

        return this;
    }

    return World;
})();


var Status = (function(){
    function Status(value){
        this.value = value || 0;
        this.color = {
            red:   Math.round(Math.random() * 250),
            green: Math.round(Math.random() * 250),
            blue:  Math.round(Math.random() * 250)
        };
    }

    Status.prototype.background = function(){
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

    Vector.prototype.scale = function(n){
        this.x *= n;
        this.y *=  n;
        return this;
    }

    return Vector;
})();


var Agent = (function(){
    function Agent(pos, state){
        this.pos = pos || new Vector();
        this.size = 2 + Math.random() * 5;
        this.desiredSize = this.size;
        this.direction = 0;
        this.state = state || new Status();
    }

    Agent.prototype.move = function(size){
        this.direction += Math.random() / 2 - 0.25;
        var translationVect = new Vector(
            (10 /  this.size / 2) * Math.cos(this.direction),
            (10 / this.size / 2) * Math.sin(this.direction)
        );

        this.size += (this.desiredSize - this.size) / 10;
        this.pos.translate(translationVect);

        this.pos.x = this.pos.x.mod(size.width);
        this.pos.y = this.pos.y.mod(size.height);
    }

    return Agent;
})();
