var AgarModel = (function(){
    function Model(distance){
        this.distance = distance || 10;
    }

    Model.prototype.getNeightbours = function(agent, agents){
        var neighbours = [];
        for (var i = 0; i < agents.length; i++) {
            if(agent.pos.distance(agents[i].pos) < this.distance){
                neighbours.push(agents[i]);
            }
        }
        return neighbours;
    }

    Model.prototype.mutateAgent = function(agent, world){
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

    return Model;
})();
