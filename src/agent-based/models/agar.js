var AgarModel = (function(){
    function AgarModel(distance){
        this.distance = distance || 10;
    }

    AgarModel.prototype.mutateAgent = function(agent, world){
        var agents = world.agents;
        for (var i = 0; i < agents.length; i++) {
            if(agent.touches(agents[i]) && agent.size > agents[i].size){
                agent.size += agents[i].size / 2;
                agents.splice(i, 1);
            }
        }

        this.moveAgent.call(agent, world.size);
    }

    AgarModel.prototype.moveAgent = function(size){
        this.direction += Math.random() / 2 - 0.25;
        var translationVect = new Vector(
            this.speed * Math.cos(this.direction),
            this.speed * Math.sin(this.direction)
        );

        this.pos.translate(translationVect);
        this.pos.x = this.pos.x.mod(size.width);
        this.pos.y = this.pos.y.mod(size.height);
    }

    return AgarModel;
})();
