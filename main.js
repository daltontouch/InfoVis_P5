window.onload = start;

function start() {
    var standingGraph = document.getElementById('standingGraph');
    var taxiGraph = document.getElementById('taxiGraph');
    var takeoffGraph = document.getElementById('takeoffGraph');
    var climbGraph = document.getElementById('climbGraph');
    var cruiseGraph = document.getElementById('cruiseGraph');
    var descentGraph = document.getElementById('descentGraph');
    var approachGraph = document.getElementById('approachGraph');
    var landingGraph = document.getElementById('landingGraph');
    var buttonBar = document.getElementById('buttonBar');

    //console.log(graph);
    console.log(buttonBar);

    var width = 900;
    var height = 400;
    var littleBuffer = 10;
    var bigBuffer = 40;

    var currentPhase = 'STANDING';

    var standingSvg = d3
        .select(standingGraph)
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    var taxiSvg = d3
        .select(taxiGraph)
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    var takeoffSvg = d3
        .select(takeoffGraph)
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    var climbSvg = d3
        .select(climbGraph)
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    var cruiseSvg = d3
        .select(cruiseGraph)
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    var descentSvg = d3
        .select(descentGraph)
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    var approachSvg = d3
        .select(approachGraph)
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    var landingSvg = d3
        .select(landingGraph)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // var Flightgraph1ic = d3
    //     .select('#buttonBar')
    //     .append('img')
    //     .attr('src', 'img/flightGraphic_new.svg')
    //     .attr('width', width)
    //     .attr('height', height);

    //Navigation Buttons
    d3.select(buttonBar).append('button').text('Click Me!');
    d3.select(buttonBar).append('button').text('No, click me!');

    var standingBars = standingSvg.append('g');
    var taxiBars = taxiSvg.append('g');
    var takeoffBars = takeoffSvg.append('g');
    var climbBars = climbSvg.append('g');
    var cruiseBars = cruiseSvg.append('g');
    var descentBars = descentSvg.append('g');
    var approachBars = approachSvg.append('g');
    var landingBars = landingSvg.append('g');

    var xScale = d3.scaleBand().rangeRound([0, width - bigBuffer * 2], 0.3);
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
            var incidents = d3
                .nest()
                .key(function(d) {
                    return d.Broad_Phase_of_Flight;
                })
                .sortKeys(d3.ascending)
                .key(function(d) {
                    return d.Make;
                })
                .sortKeys(d3.ascending)
                //.key(function(d) { return d.Broad_Phase_of_Flight; })
                .rollup(function(v) {
                    return {
                        make: v.map(function(d) {
                            return d.Make;
                        })[0],
                        fatal: d3.sum(v, function(d) {
                            return +d.Total_Fatal_Injuries;
                        }),
                        serious: d3.sum(v, function(d) {
                            return +d.Total_Serious_Injuries;
                        }),
                        uninjured: d3.sum(v, function(d) {
                            return +d.Total_Uninjured;
                        }),
                    };
                })
                .entries(data);

            var standingIncidents = incidents
                .filter(function(d) {
                    return d.key == 'STANDING';
                })[0]
                .values.map(function(v) {
                    return v.value;
                });
            var taxiIncidents = incidents
                .filter(function(d) {
                    return d.key == 'TAXI';
                })[0]
                .values.map(function(v) {
                    return v.value;
                });
            var takeoffIncidents = incidents
                .filter(function(d) {
                    return d.key == 'TAKEOFF';
                })[0]
                .values.map(function(v) {
                    return v.value;
                });
            var climbIncidents = incidents
                .filter(function(d) {
                    return d.key == 'CLIMB';
                })[0]
                .values.map(function(v) {
                    return v.value;
                });
            var cruiseIncidents = incidents
                .filter(function(d) {
                    return d.key == 'CRUISE';
                })[0]
                .values.map(function(v) {
                    return v.value;
                });
            var descentIncidents = incidents
                .filter(function(d) {
                    return d.key == 'DESCENT';
                })[0]
                .values.map(function(v) {
                    return v.value;
                });
            var approachIncidents = incidents
                .filter(function(d) {
                    return d.key == 'APPROACH';
                })[0]
                .values.map(function(v) {
                    return v.value;
                });
            var landingIncidents = incidents
                .filter(function(d) {
                    return d.key == 'LANDING';
                })[0]
                .values.map(function(v) {
                    return v.value;
                });

            xScale.domain(
                standingIncidents.map(function(d) {
                    return d.make;
                })
            );
            yScale.domain([
                0,
                d3.max(
                    incidents
                    .filter(function(f) {
                        return f.key != '';
                    })
                    .map(function(d) {
                        return d3.max(
                            d.values.map(function(v) {
                                return d3.max([v.value.fatal, v.value.serious]); //, v.value.uninjured]);
                            })
                        );
                    })
                ),
            ]);

            buildChart(standingBars, standingIncidents);
            buildChart(taxiBars, taxiIncidents);
            buildChart(takeoffBars, takeoffIncidents);
            buildChart(climbBars, climbIncidents);
            buildChart(cruiseBars, cruiseIncidents);
            buildChart(descentBars, descentIncidents);
            buildChart(approachBars, approachIncidents);
            buildChart(landingBars, landingIncidents);

            function buildChart(bars, incidentData) {
                bars
                    .append('g')
                    .attr('class', 'x axis')
                    .attr('transform', function(d) {
                        return 'translate(' + bigBuffer + ', ' + (height - bigBuffer) + ')';
                    })
                    .call(xAxis);
                bars
                    .append('g')
                    .attr('class', 'y axis')
                    .attr('transform', function(d) {
                        return 'translate(' + bigBuffer + ', 0)';
                    })
                    .call(yAxis);
                bars
                    .append('g')
                    .selectAll('.fatalBar')
                    .data(incidentData)
                    .enter()
                    .append('rect')
                    .attr('class', 'fatalBar')
                    .attr('x', function(d) {
                        return bigBuffer + xScale(d.make) + xScale.bandwidth() * 0.15;
                    })
                    .attr('y', function(d) {
                        return yScale(d.fatal);
                    })
                    .attr('width', xScale.bandwidth() * 0.2)
                    .attr('height', function(d) {
                        return height - yScale(d.fatal) - bigBuffer;
                    });
                bars
                    .append('g')
                    .selectAll('.seriousBar')
                    .data(incidentData)
                    .enter()
                    .append('rect')
                    .attr('class', 'seriousBar')
                    .attr('x', function(d) {
                        return bigBuffer + xScale(d.make) + xScale.bandwidth() * 0.4;
                    })
                    .attr('y', function(d) {
                        return yScale(d.serious);
                    })
                    .attr('width', xScale.bandwidth() * 0.2)
                    .attr('height', function(d) {
                        return height - yScale(d.serious) - bigBuffer;
                    });
                // bars.append('g')
                //     .selectAll('.uninjuredBar')
                //     .data(incidentData)
                //     .enter()
                //     .append('rect')
                //     .attr('class', 'uninjuredBar')
                //     .attr('x', function(d) {
                //         return bigBuffer + xScale(d.make) + (xScale.bandwidth() * .65);
                //     })
                //     .attr('y', function(d) {
                //         return yScale(d.uninjured);
                //     })
                //     .attr('width', xScale.bandwidth() * .2)
                //     .attr('height', function(d) {
                //         return height - yScale(d.uninjured) - bigBuffer;
                //     });
            }
        }
    );
}