var config = (function(){

    var templates = {
        nodeElement: '<div style="background: {color}" data-id="{id}" id="node-{id}" class="node">' +
                        '<span class="removeNode">X</span>' +
                        '<input type="text" class="node-name" placeholder="name"><br/>' +
                        '<input type="text" class="node-quantity" placeholder="quantity">' +
                     '</div>',
        connectionLabel: '<input data-id="{edgeId}" class="formula" type="text" placeholder="Formula"/>' +
                         '<span class="removeEdge" data-id="{edgeId}" >X</span>'
    };

    var endpointOptions = {
        isSource:true,
        isTarget:true,
        endpoint: "Rectangle",
        anchor: "BottomRight",
        connector : "Straight",
        connectorStyle: { lineWidth:5, strokeStyle:'grey', dashstyle: 'dashed' }
    };

    function getEdgeOptions(source, target, edgeId){
        return {
            anchor: [ "Perimeter", { shape:"Square", anchorCount:150 }],
            source: source,
            target: target,
            endpoint: [ "Dot", {radius: 1} ],
            style:{ fillStyle:'red' },
            maxConnections: 200,
            connector : "StateMachine",
            connectorStyle: { lineWidth:3, strokeStyle:'red' },
            overlays:[
                ["Arrow", {width: 20, length: 25, location: 1, id: "arrow"}],
                ["Label", {label: templates.connectionLabel.format({edgeId: edgeId}), id:"label"}]
            ],
        }
    }

    return {
        getEdgeOptions: getEdgeOptions,
        endpointOptions: endpointOptions,
        templates: templates
    };

})();
