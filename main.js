window.onload = start;

function start() {
    var graph = document.getElementById('graph');
    var buttonBar = document.getElementById('buttonBar');

    console.log(graph);
    console.log(buttonBar);

    var width = 900;
    var height = 400;

    var svg = d3
        .select(graph)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    //Navigation Buttons
    d3.select(buttonBar).append('button').text('Click Me!');
    d3.select(buttonBar).append('button').text('No, click me!');

    var bars = svg.append('g');

    var xScale = d3.scaleBand().rangeRound([0, height], 0.3);
    var yScale = d3.scaleLinear().range([0, width]);

    var yAxis = d3.axisLeft(yScale);

    d3.csv(
        'aircraft_incidents.csv',
        function(d) {
            //Ensure columns are typed correctly
            d.Total_Fatal_Injuries = +d.Total_Fatal_Injuries;
            d.Total_Serious_Injuries = +d.Total_Serious_Injuries;
            d.Total_Uninjured = +d.Total_Uninjured;
            d.Weather_Condition = function(v) {
                if (v == 'VMC') {
                    return 'Visual Meteorological Conditions';
                } else if (v == 'IMC') {
                    return 'Instrument Meteorological Conditions';
                } else if (v == 'UNK') {
                    return 'Unknown';
                }
            };
            return d;
        },
        function(error, data) {
            //Do the data stuff here
        }
    );
}