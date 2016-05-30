function chartBuilder(datasets){
    var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    startingData = {
        labels: [],
        datasets: datasets
    },
    latestLabel = startingData.labels[6];

    // Reduce the animation steps for demo clarity.
    var chart = new Chart(ctx).Line(startingData, {animationSteps: 5});
    return chart;
}
