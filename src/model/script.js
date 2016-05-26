var Node = (function(){

    function Node(config){
        this.quantity = config.quantity || 10;
        this.name = config.name || 'unnamed';
    }

    return Node;

})();


var Edge = (function(){

    function Edge(config){
        this.from = config.from;
        this.to = config.to;
        this.formula = config.formula || '';
    }

    Edge.prototype.derivative = function(namespace){
        var result = this.formula;
        for(var propName in namespace){
            result = result.replace(propName, namespace[propName])
        }

        return eval(result)
    }

    return Edge;

})();


var Engine = (function(){

    function Engine(config){
        this.edges = config.edges || [];
        this.nodes = config.nodes || [];
        this.params = config.params || {};
        this.stats = {};
    }

    Edges.prototype.buildNamespace = function(){
        var result = {};
        this.nodes.forEach(function(node){
            result[node.name] = node.quantity;
        });

        for(var propName in this.params){
            result[propName] = this.params[propName];
        }

        return result;
    }

    Engine.prototype.updateStats = function(){
        var self = this;
        this.nodes.forEach(function(node){
            var stat = self.stats[node.name];
            if(typeof stat === 'undefined'){
                stat = [node.quantity];
            }else{
                stat.push(node.quantity);
            }
        });
    }

    Engine.prototype.next = function(){
        var namespace = this.buildNamespace();
        var derivatives = [];
        this.edges.forEach(function(edge){
            var derivative = edge.derivative(namespace);
            derivatives.push(derivative);
        });

        for (var i = 0; i < this.edges.length; i++) {
            var edge = this.edges[i];
            var transfer = Math.max(derivatives[i], 0);
            edge.from.quantity -= transfer;
            edge.to.quantity += transfer;
        }
    }

    return Engine;

})();
