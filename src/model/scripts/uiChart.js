var uiChart = function(Chart, nodes){

    var chart = {};
    var chartCnt = 0;
    var maxChartData = 1500;
    var showXLabels = 50;

    function resetChart(){
        chart = chartInit(nodes);
        chartCnt = 0;
    }

    function addData(chartData){
        chart.addData && chart.addData(
            chartData,
            chartCnt++ % showXLabels === 0 ? chartCnt - 1 : ''
        );

        if(chartCnt > maxChartData){
            chart.removeData && chart.removeData();
        }
    }

    function chartBuilder(datasets){
        var canvas = document.getElementById('canvas'),
            ctx = canvas.getContext('2d'),
            startingData = {
                labels: [],
                datasets: datasets
            };

        return new Chart(ctx).Line(startingData, {
            animationSteps: 1,
            showLabelBackdrop: true,
            showTooltips: false,
            scaleShowGridLines: false
        });
    }

    function chartInit(nodes){
        var datasets = [];
        nodes.forEach(function(node){
            if(!node.visible) return;

            var strokeStyle = utils.colorToString(node.color);
            node.color.a = 0.1;
            var fillStyle = utils.colorToString(node.color);
            node.color.a = 1;

            datasets.push({
                fillColor: fillStyle,
                strokeColor: strokeStyle,
                pointColor: 'transparent',
                pointStrokeColor: 'transparent',
                data: []
            })
        });

        return chartBuilder(datasets);
    }

    return {
        resetChart: resetChart,
        addData: addData
    };

};
