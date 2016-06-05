/*
var nodes = [new Node({name: 'S', quantity: 700}),
             new Node({name: 'I', quantity: 2}),
             new Node({name: 'R', quantity: 0})];
var edges = [new Edge({from: nodes[0], to: nodes[1], formula: 'a*S*I'}),
             new Edge({from: nodes[1], to: nodes[2], formula: 'b*I'})];
var engine = new Engine({edges: edges, nodes: nodes, params: {a: 0.1, b: 0.5}});
*/


var Node = (function(){

    function Node(config){
        this.quantity = config.quantity || 0;
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

        if(result !== ''){
            try {
                return eval(result);
            }
            catch(error){
                console.log(error);
                return 0;
            }
        }
        return 0;
    }

    return Edge;

})();


var Engine = (function(){

    function Engine(config = {}){
        this.edges = config.edges || [];
        this.nodes = config.nodes || [];
        this.params = config.params || {};
        this.stats = {};
    }

    Engine.prototype.buildNamespace = function(){
        var result = {};
        this.nodes.forEach(function(node){
            result[node.name] = node.quantity;
        });

        for(var propName in this.params){
            result[propName] = this.params[propName];
        }

        return result;
    }

    Engine.prototype.statsSnapshot = function(){
        var self = this;
        this.nodes.forEach(function(node){
            if(typeof self.stats[node.name] === 'undefined'){
                self.stats[node.name] = [node.quantity];
            }else{
                self.stats[node.name].push(node.quantity);
            }
        });
    }

    Engine.prototype.next = function(){
        var namespace = this.buildNamespace();
        var derivatives = [];
        this.edges.forEach(function(edge, i){
            var derivative = edge.derivative(namespace);
            derivatives[i] = derivative;
        });

        this.edges.forEach(function(edge, i){
            var transfer = Math.max(Math.min(derivatives[i], edge.from.quantity), 0);
            transfer = transfer;
            edge.from.quantity -= transfer;
            edge.to.quantity += transfer;
        });
    }

    return Engine;

})();
