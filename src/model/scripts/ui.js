function uiInit(utils, config, chart){

    var nodes = [];
    var edges = [];
    var params = {};
    var engine = new Engine({
        nodes: nodes,
        edges: edges,
        params: params
    });

    var containerSelector = '.play';
    var idAtrib = 'data-id';
    var interval = undefined;
    var intervalPeriod = 50;
    var paramCnt = 0;
    var colorCnt = 0;
    var colors = [
        {r: 0, g: 114, b: 187}, {r: 255, g: 76, b: 59}, {r: 255, g: 208, b: 52},
        {r: 50, g: 185, b: 45}, {r: 242, g: 0, b: 117}, {r: 111, g: 54, b: 98},
        {r: 255, g: 153, b: 0}
    ];

    var chart = uiChart(Chart, nodes);
    var extract = utils.extractor(idAtrib, nodes, edges);


    function addUiNode(node, id){
        var containerDom = config.templates.nodeElement.format({
            name: node.name,
            quantity: node.quantity,
            id: id,
            color: utils.colorToString(node.color)
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
            chart.resetChart();
        });

        $('.node input[type="checkbox"]').change(function(){
            var node = extract.nodeFromParentUi(this).node;
            node.visible = $(this).is(':checked');
            chart.resetChart();
        });
    }

    $('#addNode').click(function(){
        var node = new Node({});
        node.visible = true;
        colors[colorCnt].a = 1;
        node.color = colors[colorCnt];
        colorCnt = (colorCnt + 1) % colors.length;
        nodes.push(node);

        chart.resetChart();
        addUiNode(node, nodes.length - 1);
    });

    $('#play').click(function(){
        if($(this).attr('data-play') === 'false'){
            $(this).attr('data-play', 'true');
            $(this).text('Pause');
            interval = setInterval(engineSnap, intervalPeriod);
        }else{
            $(this).attr('data-play', 'false');
            $(this).text('Play');
            clearInterval(interval);
        }
    });

    function engineSnap(){
        engine.statsSnapshot();
        engine.next();
        var chartData = [];

        nodes.forEach(function(node, id){
            if(!node.visible) return;
            $('#node-' + id + ' .node-quantity').val(node.quantity);
            chartData.push(node.quantity);
        });

        chart.addData(chartData);
    };

    $('#addParam').click(function(){
        var name = 'p' + ++paramCnt;
        $('.params').append(config.templates.parameterElement.format({
            id: name,
            name: name
        }));

        addParamEvents();
    });

    function addParamEvents(){
        $('.paramName').off().change(function(){
            var newName = $(this).val();
            var oldName = extract.getPropName(this);
            var val = params[oldName];
            delete params[oldName];
            params[newName] = val;
            $(this).parent().attr(idAtrib, newName);
        });

        $('.paramVal').off().change(function(){
            if($(this).val() === '')
                delete params[name];
            var name = extract.getPropName(this);
            params[name] = +$(this).val();
        });

        $('.removeParam').off().click(function(){
            var name = extract.getPropName(this);
            delete params[name];
            $(this).parent().remove();
        });
    }

    $('#clearChart').click(chart.resetChart);
    $('#toggleChart').click($().toggle.bind($('#canvas')));
    jsPlumb.bind('beforeDrop', addUiEdge);

    return engine;
}
