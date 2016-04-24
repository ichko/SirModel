var SirModel = (function(){
    function SirModel(probSuc, probInf, probRec){
        this.probSuc = probSuc;
        this.probInf = probInf;
        this.probRec = probRec;
        this.states = {
            susceptible: new Status('#4AC0F2'),
            infected: new Status('#E80018'),
            removed: new Status('#ffcc00')
        };
    }

    SirModel.prototype.mutateAgent = function(agent, world){
        var agents = world.agents;
        for (var i = 0; i < agents.length; i++) {
            var rand = Math.random();
            if(agent.touches(agents[i]) && rand < this.probInf &&
                    agent.status == this.states.susceptible &&
                    agents[i].status == this.states.infected){
                agent.status = this.states.infected;
            }
            else if(rand < this.probRec && agent.status == this.states.infected){
                agent.status = this.states.removed;
            }
            else if(rand < this.probSuc && agent.status == this.states.removed){
                agent.status = this.states.susceptible;
            }
        }

        this.moveAgent.call(agent, world.size);
    }

    SirModel.prototype.moveAgent = function(size){
        this.direction += Math.random() / 2 - 0.25;
        var translationVect = new Vector(
            this.speed * Math.cos(this.direction),
            this.speed * Math.sin(this.direction)
        );

        this.pos.translate(translationVect);
        this.pos.x = this.pos.x.mod(size.width);
        this.pos.y = this.pos.y.mod(size.height);
    }

    return SirModel;
})();
