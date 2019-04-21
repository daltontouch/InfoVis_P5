window.onload = start;

function start() {
    var allData;

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

    // var gButtonBar = d3
    //     .select(buttonBar)
    //     .append('svg')
    //     .attr('width', '1000')
    //     .attr('height', '600');

    // var flightChart = d3.xml('img/d3.svg', 'image/svg+xml', function(xml) {
    //     var importedNode = document.importNode(xml.documentElement, true);
    //     d3.select('div#buttonBar').each(function() {
    //         this.appendChild(importedNode);
    //     });
    // });

    // var FlightGraphic = d3
    //     .select('#buttonBar')
    //     .append('svg')
    //     .attr('src', 'img/FlightGraphic_new.svg')
    //     .attr('width', width)
    //     .attr('height', width * 0.6);

    // d3.xml('img/FlightGraphic.svg', 'image/svg+xml', function(xml) {
    //     var importedNode = document.importNode(xml.documentElement, true);
    //     d3.select('div#buttonBar').each(function() {
    //         this.appendChild(importedNode);
    //     });
    // });

    //Navigation Buttons
    d3.select(buttonBar)
        .append('button')
        .attr('id', 'leftButton')
        .attr('class', 'invisibleButton')
        .attr('transform', function(d) {
            return 'translate(' + bigBuffer + ', 0)';
        })
        .text('Click Me!')
        .on('click', button1);
    d3.select(buttonBar)
        .append('button')
        .attr('id', 'rightButton')
        .attr('class', 'visibleButton')
        .attr('transform', function(d) {
            return 'translate(' + (width - bigBuffer) + ', 0)';
        })
        .text('Taxi Incidents')
        .on('click', button2);

    
    function button1() {
        var leftVisibility = 'visibleButton';
        var rightVisibility = 'visibleButton';
        var leftPhase = '';
        var rightPhase = '';
        if (currentPhase == "LANDING") {
            currentPhase = "APPROACH";
            leftPhase = "Descending Incidents";
            rightPhase = "Landing Incidents";
            rightVisibility = 'visibleButton';
        } else if (currentPhase == "APPROACH") {
            currentPhase = "DESCENT";
            leftPhase = "Cruising Incidents";
            rightPhase = "Approaching Incidents";
        } else if (currentPhase == "DESCENT") {
            currentPhase = "CRUISE";
            leftPhase = "Climbing Incidents";
            rightPhase = "Descent Incidents";
        } else if (currentPhase == "CRUISE") {
            currentPhase = "CLIMB";
            leftPhase = "Takeoff Incidents";
            rightPhase = "Cruising Incidents";
        } else if (currentPhase == "CLIMB") {
            currentPhase = "TAKEOFF";
            leftPhase = "Taxi Incidents";
            rightPhase = "Climbing Incidents";
        } else if (currentPhase == "TAXI") {
            currentPhase = "STANDING";
            rightPhase = "Taxi Incidents";
            leftVisibility = 'invisibleButton';
        }
        d3.select(document.getElementById('leftButton'))
            .attr('class', leftVisibility)
            .text(leftPhase);
        d3.select(document.getElementById('rightButton'))
            .attr('class', rightVisibility)
            .text(rightPhase);
        updateBars();
    }

    function button2() {
        var leftVisibility = 'visibleButton';
        var rightVisibility = 'visibleButton';
        var leftPhase = '';
        var rightPhase = '';
        if (currentPhase == "STANDING") {
            currentPhase = "TAXI";
            leftPhase = 'Standing Incidents';
            rightPhase = 'Takeoff Incidents';
        } else if (currentPhase == "TAXI") {
                currentPhase = "TAKEOFF";
                leftPhase = "Taxi Incidents";
                rightPhase = "Climbing Incidents";
        } else if (currentPhase == "TAKEOFF") {
            currentPhase = "CLIMB";
            leftPhase = "Takeoff Incidents";
            rightPhase = "Cruising Incidents";
        } else if (currentPhase == "CLIMB") {
            currentPhase = "CRUISE";
            leftPhase = "Climbing Incidents";
            rightPhase = "Descent Incidents";
        } else if (currentPhase == "CRUISE") {
            currentPhase = "DESCENT";
            leftPhase = "Cruising Incidents";
            rightPhase = "Approaching Incidents";
        } else if (currentPhase == "DESCENT") {
            currentPhase = "APPROACH";
            leftPhase = "Descent Incidents";
            rightPhase = "Landing Incidents";
        } else if (currentPhase == "APPROACH") {
            currentPhase = "LANDING";
            leftPhase = "Approaching Incidents";
            rightVisibility = 'invisibleButton';
        }
        d3.select(document.getElementById('leftButton'))
            .attr('class', leftVisibility)
            .text(leftPhase);
        d3.select(document.getElementById('rightButton'))
            .attr('class', rightVisibility)
            .text(rightPhase);
        updateBars();
    }

    function updateBars() {
        var fatalMax = d3.max(allData.map(function(d) {
            return d3.sum(d.value.map(function(v) {
                if (v.phase == currentPhase) {
                    return v.fatal;
                } else {
                    return 0;
                }
            }));
        }));
        var seriousMax = d3.max(allData.map(function(d) {
            return d3.sum(d.value.map(function(v) {
                if (v.phase == currentPhase) {
                    return v.serious;
                } else {
                    return 0;
                }
            }));
        }));

        yScale.domain([0, d3.max([fatalMax, seriousMax])]);

        standingBars.selectAll('.fatalBar')
        .transition()
        .duration(function(d) {
            return 1000;
        })
        .delay(function(d) {
            return Math.random() * 1500;
        })
        .attr('y', function(d) {
            return yScale(d3.sum(d.value.map(function(d) {
                if (d.phase == currentPhase) {
                    return d.fatal;
                } else {
                    return 0;
                }
            })));
        })
        .attr('height', function(d) {
            return height - yScale(d3.sum(d.value.map(function(d) {
                if (d.phase == currentPhase) {
                    return d.fatal;
                } else {
                    return 0;
                }
            }))) - bigBuffer;
        });
        standingBars.selectAll('.seriousBar')
        .transition()
        .duration(function(d) {
            return 1000;
        })
        .delay(function(d) {
            return Math.random() * 1500;
        })
        .attr('y', function(d) {
            return yScale(d3.sum(d.value.map(function(d) {
                if (d.phase == currentPhase) {
                    return d.serious;
                } else {
                    return 0;
                }
            })));
        })
        .attr('height', function(d) {
            return height - yScale(d3.sum(d.value.map(function(d) {
                if (d.phase == currentPhase) {
                    return d.serious;
                } else {
                    return 0;
                }
            }))) - bigBuffer;
        });
        standingSvg.transition();

        var t = d3.transition()
            .duration(1000)
            .delay(500);

        var y = standingSvg.selectAll(".yAxis")
            .data(["dummy"]);
        
        var newY = y.enter().append("g")
            .attr("class", "yAxis")
            .attr("transform", function(d) {
                return 'translate(' + bigBuffer + ', 0)';
            });

        y.merge(newY).transition(t).call(yAxis);
    }

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
                        })
                    };
                })
                .entries(data);

            var test = d3
                .nest()
                .key(function(d) {
                    return d.Make;
                })
                .sortKeys(d3.ascending)
                //.key(function(d) { return d.Broad_Phase_of_Flight; })
                .rollup(function(v) {
                    return v.map(function(d) {
                        return {
                            phase: d.Broad_Phase_of_Flight,
                            fatal: d.Total_Fatal_Injuries,
                            serious: d.Total_Serious_Injuries,
                            uninjured: d.Total_Uninjured
                        }
                    });
                })
                .entries(data);

            allData = test;

            var standingIncidents = incidents
                .filter(function(d) {
                    return d.key == 'STANDING';
                })[0]
                .values.map(function(v) {
                    return v.value;
                });
            var taxiIncidents = incidents
                .filter(function(d) {
                    return d.key == "TAXI";
                })[0].values.map(function(v) {
                    return v.value;
                });
            var takeoffIncidents = incidents
                .filter(function(d) {
                    return d.key == "TAKEOFF";
                })[0].values.map(function(v) {
                    return v.value;
                });
            var climbIncidents = incidents
                .filter(function(d) {
                    return d.key == "CLIMB";
                })[0].values.map(function(v) {
                    return v.value;
                });
            var cruiseIncidents = incidents
                .filter(function(d) {
                    return d.key == "CRUISE";
                })[0].values.map(function(v) {
                    return v.value;
                });
            var descentIncidents = incidents
                .filter(function(d) {
                    return d.key == "DESCENT";
                })[0].values.map(function(v) {
                    return v.value;
                });
            var approachIncidents = incidents
                .filter(function(d) {
                    return d.key == "APPROACH";
                })[0].values.map(function(v) {
                    return v.value;
                });
            var landingIncidents = incidents
                .filter(function(d) {
                    return d.key == "LANDING";
                })[0].values.map(function(v) {
                    return v.value;
                });

            var standingIncidents = incidents
                .filter(function(d) {
                    return d.key == 'STANDING';
                })[0]
                .values.map(function(v) {
                    return v.value;
                });
            var taxiIncidents = incidents
                .filter(function(d) {
                    return d.key == "TAXI";
                })[0].values.map(function(v) {
                    return v.value;
                });
            var takeoffIncidents = incidents
                .filter(function(d) {
                    return d.key == "TAKEOFF";
                })[0].values.map(function(v) {
                    return v.value;
                });
            var climbIncidents = incidents
                .filter(function(d) {
                    return d.key == "CLIMB";
                })[0].values.map(function(v) {
                    return v.value;
                });
            var cruiseIncidents = incidents
                .filter(function(d) {
                    return d.key == "CRUISE";
                })[0].values.map(function(v) {
                    return v.value;
                });
            var descentIncidents = incidents
                .filter(function(d) {
                    return d.key == "DESCENT";
                })[0].values.map(function(v) {
                    return v.value;
                });
            var approachIncidents = incidents
                .filter(function(d) {
                    return d.key == "APPROACH";
                })[0].values.map(function(v) {
                    return v.value;
                });
            var landingIncidents = incidents
                .filter(function(d) {
                    return d.key == "LANDING";
                })[0].values.map(function(v) {
                    return v.value;
                });

            xScale.domain(test.map(function(d) {
                return d.key;
            }));
            yScale.domain([0, d3.max(test.filter(function(f) {
                return f.key != "";
            }).map(function(d) {
                return d3.max(
                    [d3.sum(d.value.map(function(d) {
                        return d.fatal;
                    })),
                    d3.sum(d.value.map(function(d) {
                        return d.serious;
                    }))]);
            }))]);

            buildChart(standingBars, test);
            //buildChart(standingBars, standingIncidents);
            //buildChart(taxiBars, taxiIncidents);
            //buildChart(takeoffBars, takeoffIncidents);
            //buildChart(climbBars, climbIncidents);
            //buildChart(cruiseBars, cruiseIncidents);
            //buildChart(descentBars, descentIncidents);
            //buildChart(approachBars, approachIncidents);
            //buildChart(landingBars, landingIncidents);

            function buildChart(bars, incidentData) {
                bars.append('g')
                    .attr('class', 'xAxis')
                    .attr('transform', function(d) {
                        return 'translate(' + bigBuffer + ', ' + (height - bigBuffer) + ')';
                    })
                    .call(xAxis);
                bars.append('g')
                    .attr('class', 'yAxis')
                    .attr('transform', function(d) {
                        return 'translate(' + bigBuffer + ', 0)';
                    })
                    .call(yAxis);
                bars.append('g')
                    .selectAll('.fatalBar')
                    .data(test)
                    .enter()
                    .append('rect')
                    .attr('class', 'fatalBar')
                    .attr('x', function(d) {
                        return bigBuffer + xScale(d.key) + (xScale.bandwidth() * .15);
                    })
                    .attr('y', function(d) {
                        return yScale(d3.sum(d.value.map(function(d) {
                            return d.fatal;
                        })));
                    })
                    .attr('width', xScale.bandwidth() * .2)
                    .attr('height', function(d) {
                        return height - yScale(d3.sum(d.value.map(function(d) {
                            return d.fatal;
                        }))) - bigBuffer;
                    });
                bars.append('g')
                    .selectAll('.seriousBar')
                    .data(test)
                    .enter()
                    .append('rect')
                    .attr('class', 'seriousBar')
                    .attr('x', function(d) {
                        return bigBuffer + xScale(d.key) + (xScale.bandwidth() * .4);
                    })
                    .attr('y', function(d) {
                        return yScale(d3.sum(d.value.map(function(d) {
                            return d.serious;
                        })));
                    })
                    .attr('width', xScale.bandwidth() * .2)
                    .attr('height', function(d) {
                        return height - yScale(d3.sum(d.value.map(function(d) {
                            return d.serious;
                        }))) - bigBuffer;
                    });

            // xScale.domain(standingIncidents.map(function(d) {
            //     return d.make;
            // }));
            // yScale.domain([0, d3.max(incidents.filter(function(f) {
            //     return f.key != "";
            // }).map(function(d) {
            //     return d3.max(d.values.map(function(v) {
            //         return d3.max([v.value.fatal, v.value.serious]);//, v.value.uninjured]);
            //     }));
            // }))]);

            // buildChart(standingBars, standingIncidents);
            // buildChart(taxiBars, taxiIncidents);
            // buildChart(takeoffBars, takeoffIncidents);
            // buildChart(climbBars, climbIncidents);
            // buildChart(cruiseBars, cruiseIncidents);
            // buildChart(descentBars, descentIncidents);
            // buildChart(approachBars, approachIncidents);
            // buildChart(landingBars, landingIncidents);

            // function buildChart(bars, incidentData) {
            //     bars.append('g')
            //         .attr('class', 'x axis')
            //         .attr('transform', function(d) {
            //             return 'translate(' + bigBuffer + ', ' + (height - bigBuffer) + ')';
            //         })
            //         .call(xAxis);
            //     bars.append('g')
            //         .attr('class', 'y axis')
            //         .attr('transform', function(d) {
            //             return 'translate(' + bigBuffer + ', 0)';
            //         })
            //         .call(yAxis);
            //     bars.append('g')
            //         .selectAll('.fatalBar')
            //         .data(incidentData)
            //         .enter()
            //         .append('rect')
            //         .attr('class', 'fatalBar')
            //         .attr('x', function(d) {
            //             return bigBuffer + xScale(d.make) + (xScale.bandwidth() * .15);
            //         })
            //         .attr('y', function(d) {
            //             return yScale(d.fatal);
            //         })
            //         .attr('width', xScale.bandwidth() * .2)
            //         .attr('height', function(d) {
            //             return height - yScale(d.fatal) - bigBuffer;
            //         });
            //     bars.append('g')
            //         .selectAll('.seriousBar')
            //         .data(incidentData)
            //         .enter()
            //         .append('rect')
            //         .attr('class', 'seriousBar')
            //         .attr('x', function(d) {
            //             return bigBuffer + xScale(d.make) + (xScale.bandwidth() * .4);
            //         })
            //         .attr('y', function(d) {
            //             return yScale(d.serious);
            //         })
            //         .attr('width', xScale.bandwidth() * .2)
            //         .attr('height', function(d) {
            //             return height - yScale(d.serious) - bigBuffer;
            //         });
            //     // bars.append('g')
            //     //     .selectAll('.uninjuredBar')
            //     //     .data(incidentData)
            //     //     .enter()
            //     //     .append('rect')
            //     //     .attr('class', 'uninjuredBar')
            //     //     .attr('x', function(d) {
            //     //         return bigBuffer + xScale(d.make) + (xScale.bandwidth() * .65);
            //     //     })
            //     //     .attr('y', function(d) {
            //     //         return yScale(d.uninjured);
            //     //     })
            //     //     .attr('width', xScale.bandwidth() * .2)
            //     //     .attr('height', function(d) {
            //     //         return height - yScale(d.uninjured) - bigBuffer;
            //     //     });
            }
        }
    );
}