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

String.empty = '';

var utils = (function($){

    function extractor(idAtrib, nodes, edges){
        return {
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
            },
            getPropName: function(selector){
                return $(selector).parent().attr(idAtrib);
            }
        };
    };

    function colorToString(color){
        return 'rgba({r}, {g}, {b}, {a})'.format(color);
    }

    return {
        extractor: extractor,
        colorToString: colorToString
    };

})($);
