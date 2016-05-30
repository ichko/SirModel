function uiInit(config, chartBuilder){
    var chart = {};
    var chartCnt = 0;
    var maxChartData = 50;
    var idAtrib = 'data-id';
    var containerSelector = '.play';
    var interval = undefined;
    var intervalPeriod = 300;
    var colors = [
        {r: 0, g: 114, b: 187},
        {r: 255, g: 76, b: 59},
        {r: 255, g: 208, b: 52},
        {r: 50, g: 185, b: 45},
        {r: 242, g: 0, b: 117},
        {r: 111, g: 54, b: 98},
        {r: 255, g: 153, b: 0}
    ];
    var colorCnt = 0;

    var nodes = [];
    var edges = [];
    var params = {a: 0.001, b: 0.1};
    var engine = new Engine({nodes: nodes, edges: edges, params: params});


    function addUiNode(node, id){
        var containerDom = config.templates.nodeElement.format({
            name: node.name,
            quantity: node.quantity,
            id: id,
            color: colorToString(node.color)
        });

        $('#playground').append(containerDom);
        jsPlumb.draggable($('#node-' + id), {snap: true, containment: "parent"});
        jsPlumb.addEndpoint('node-' + id, config.endpointOptions);
        addNodeEvents();
    }

    function addUiEdge(event){
        var inCon = jsPlumb.getConnections({source: event.sourceId, target: event.targetId}).length;
        var outCon = jsPlumb.getConnections({source: event.targetId, target: event.sourceId}).length;
        if (event.sourceId !== event.targetId && inCon === 0 && outCon === 0){
            var fromNode = extract.nodeFromUi('#' + event.sourceId);
            var toNode = extract.nodeFromUi('#' + event.targetId)
            fromNode.id = event.sourceId;
            toNode.id = event.targetId;

            edges.push(new Edge({
                from: fromNode,
                to: toNode
            }));

            var con = jsPlumb.connect(config.getEdgeOptions(
                event.sourceId, event.targetId, edges.length - 1
            ));
            con.id = edges.length - 1;

            addEdgeEvents();
        }

        return false;
    }


    function addEdgeEvents(){
        $('.formula').off().change(function(){
            var edge = extract.edgeFromUi(this).edge;
            edge.formula = $(this).val();
        });

        $('.removeEdge').off().click(function(){
            var obj = extract.edgeFromUi(this);
            var edge = obj.edge;

            jsPlumb.detach({
                source: edge.from.id,
                target: edge.to.id
            });
            delete edges[obj.id];
        });
    }

    function addNodeEvents(){
        $('.node-name').off().change(function(){
            var node = extract.nodeFromParentUi(this).node;
            node.name = $(this).val();
        });

        $('.node-quantity').off().change(function(){
            var node = extract.nodeFromParentUi(this).node;
            node.quantity = +$(this).val();
        });

        $('.removeNode').off().click(function(){
            var id = extract.nodeFromParentUi(this).id;
            var outCon = jsPlumb.getConnections({source: 'node-' + id});
            var inCon = jsPlumb.getConnections({target: 'node-' + id});
            outCon.concat(inCon).forEach(function(con){
                delete edges[con.id]
                jsPlumb.detach(con);
            });

            delete nodes[id];
            jsPlumb.remove('node-' + id);
            chart = chartInit(nodes);
            chartCnt = 0;
        });
    }

    $('#addNode').click(function(){
        var node = new Node({});
        colors[colorCnt].a = 1;
        node.color = colors[colorCnt];
        colorCnt = (colorCnt + 1) % colors.length;
        nodes.push(node);

        chart = chartInit(nodes);
        chartCnt = 0;

        addUiNode(node, nodes.length - 1);
    });

    $('#play').click(function(){
        if($(this).attr('data-play') === 'false'){
            $(this).attr('data-play', 'true');
            $(this).text('Pause');
            interval = setInterval(function () {
                $('#next').click();
            }, intervalPeriod);
        }else{
            $(this).attr('data-play', 'false');
            $(this).text('Play');
            clearInterval(interval);
        }
    });

    $('#clearChart').click(function(){
        chart = chartInit(nodes);
        chartCnt = 0;
    });

    function chartInit(nodes){
        var datasets = [];
        nodes.forEach(function(node){
            var strokeStyle = colorToString(node.color);
            node.color.a = 0.1;
            var fillStyle = colorToString(node.color);
            node.color.a = 1;

            datasets.push({
                fillColor: fillStyle,
                strokeColor: strokeStyle,
                pointColor: strokeStyle,
                pointStrokeColor: "#fff",
                data: [0]
            })
        });
        return chartBuilder(datasets);
    }

    $('#next').click(function(){
        engine.statsSnapshot();
        engine.next();
        var chartData = [];

        nodes.forEach(function(node, id){
            $('#node-' + id + ' .node-quantity').val(node.quantity);
            chartData.push(node.quantity);
        });

        chart.addData && chart.addData(chartData, chartCnt++);
        if(chartCnt > maxChartData){
            chart.removeData && chart.removeData();
        }
    });


    jsPlumb.bind("beforeDrop", addUiEdge);

    var extract = {
        nodeFromUi: function(selector){
            return nodes[+$(selector).attr(idAtrib)];
        },
        nodeFromParentUi: function(selector){
            var id = +$(selector).parent().attr(idAtrib);
            return {
                node: nodes[id],
                id: id
            }
        },
        edgeFromUi: function(selector){
            var id = +$(selector).attr(idAtrib);
            return {
                edge: edges[id],
                id: id
            }
        }
    }

    function colorToString(color){
        return 'rgba({r}, {g}, {b}, {a})'.format(color);
    }

    return engine;
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

String.prototype.format = function(obj){
    var result = this;
    for(propName in obj){
        result = result.replaceAll('{' + propName + '}', obj[propName]);
    }

    return result;
}
