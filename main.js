window.onload = start;

function start() {
    var graph = document.getElementById('graph');
    var buttonBar = document.getElementById('buttonBar');

    console.log(graph);
    console.log(buttonBar);

    var width = 900;
    var height = 400;
    var littleBuffer = 10;
    var bigBuffer = 40;

    var currentPhase = "STANDING";

    var svg = d3
        //.select('img/#FlightGraphic')
        .select(graph)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // var flightChart = d3.xml('img/FlightGraphic.svg', 'image/svg+xml', function(
    //     xml
    // ) {
    //     var importedNode = document.importNode(xml.documentElement, true);
    //     d3.select('div#flightChart').each(function() {
    //         this.appendChild(importedNode);
    //     });
    // });

    // .then(data => {
    //     document.body.append(data.documentElement);
    // });

    //Navigation Buttons
    d3.select(buttonBar)
        .append('button')
        .text('Click Me!');
    d3.select(buttonBar)
        .append('button')
        .text('No, click me!');

    var bars = svg.append('g');

    var xScale = d3.scaleBand().rangeRound([0, width - (bigBuffer * 2)], 0.3);
    var yScale = d3.scaleLinear().range([height - bigBuffer, littleBuffer]);

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    d3.csv(
        'aircraft_incidents.csv',
        function(d) {
            //Ensure columns are typed correctly
            d.Total_Fatal_Injuries = +d.Total_Fatal_Injuries;
            d.Total_Serious_Injuries = +d.Total_Serious_Injuries;
            d.Total_Uninjured = +d.Total_Uninjured;
            d.Make = d.Make;
            d.Broad_Phase_of_Flight = d.Broad_Phase_of_Flight;
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
            var incidents = d3.nest()
                .key(function(d) { return d.Broad_Phase_of_Flight; })
                .sortKeys(d3.ascending)
                .key(function(d) { return d.Make; })
                .sortKeys(d3.ascending)
                //.key(function(d) { return d.Broad_Phase_of_Flight; })
                .rollup(function(v) { return {
                    make: v.map(function(d) { return d.Make })[0],
                    fatal: d3.sum(v, function (d) { return +d.Total_Fatal_Injuries; }),
                    serious: d3.sum(v, function (d) { return +d.Total_Serious_Injuries; }),
                    uninjured: d3.sum(v, function (d) { return +d.Total_Uninjured; })
                 }; })
                .entries(data);

            var currentIncidents = incidents
                .filter(function(d) {
                    return d.key == "STANDING";
                })[0].values.map(function(v) {
                    return v.value;
                });

            xScale.domain(currentIncidents.map(function(d) {
                return d.make;
            }));

            yScale.domain([0, d3.max(incidents.filter(function(f) {
                return f.key != "";
            }).map(function(d) {
                return d3.max(d.values.map(function(v) {
                    return d3.max([v.value.fatal, v.value.serious, v.value.uninjured]);
                }));
            }))]);

            bars.append('g')
                .attr('class', 'x axis')
                .attr('transform', function(d) {
                    return 'translate(' + bigBuffer + ', ' + (height - bigBuffer) + ')';
                })
                .call(xAxis);

            bars.append('g')
                .attr('class', 'y axis')
                .attr('transform', function(d) {
                    return 'translate(' + bigBuffer + ', 0)';
                })
                .call(yAxis);

            bars.append('g')
                .selectAll('.fatalBar')
                .data(currentIncidents)
                .enter()
                .append('rect')
                .attr('class', 'fatalBar')
                .attr('x', function(d) {
                    return bigBuffer + xScale(d.make) + (xScale.bandwidth() * .15);
                })
                .attr('y', function(d) {
                    return yScale(d.fatal);
                })
                .attr('width', xScale.bandwidth() * .2)
                .attr('height', function(d) {
                    return height - yScale(d.fatal) - bigBuffer;
                });
            bars.append('g')
                .selectAll('.seriousBar')
                .data(currentIncidents)
                .enter()
                .append('rect')
                .attr('class', 'seriousBar')
                .attr('x', function(d) {
                    return bigBuffer + xScale(d.make) + (xScale.bandwidth() * .4);
                })
                .attr('y', function(d) {
                    return yScale(d.serious);
                })
                .attr('width', xScale.bandwidth() * .2)
                .attr('height', function(d) {
                    return height - yScale(d.serious) - bigBuffer;
                });
                bars.append('g')
                    .selectAll('.uninjuredBar')
                    .data(currentIncidents)
                    .enter()
                    .append('rect')
                    .attr('class', 'uninjuredBar')
                    .attr('x', function(d) {
                        return bigBuffer + xScale(d.make) + (xScale.bandwidth() * .65);
                    })
                    .attr('y', function(d) {
                        return yScale(d.uninjured);
                    })
                    .attr('width', xScale.bandwidth() * .2)
                    .attr('height', function(d) {
                        return height - yScale(d.uninjured) - bigBuffer;
                    });
        }
    );
}