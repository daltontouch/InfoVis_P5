window.onload = start;

function start() {
    var allData;

    var standingGraph = document.getElementById('standingGraph');
    var buttonBar = document.getElementById('buttonBar');

    var width = 900;
    var height = 400;
    var littleBuffer = 10;
    var bigBuffer = 40;

    var currentPhase = 'STANDING';

    const overviewText = "The strongest trends that we noticed while exploring the data were the relationships between number of injuries/fatalities and the manufacturer of the aircraft. In this first chart, we present an overview, a view of how many total accidents have been reported per aircraft manufacturer. The red bars represent number of fatalities, and the yellow bars represent serious injuries. One thing to keep in mind here is that these results DO NOT indicate that Boeing aircraft have a higher RATE of accidents than the other manufacturer’s products. Rather, there are simply more aircraft that have been produced by Boeing than those produced by other manufacturers.";
    const standingText = "Standing means that the aircraft is motionless on the tarmac, such as when passengers are boarding. During standing, it is evident that Boeing planes had the most incidents. Again, it’s helpful to remember that Boeing aircraft carry the most passengers.";
    const taxiText = "Taxiing is when the aircraft is moving across the runway to get into position for takeoff. It is interesting to notice that Bombardier has the most fatalities during taxiing. This is most likely due to a single catastrophic failure event.";
    const takeoffText = "Takeoff is the brief period of time during which the aircraft is moving down the runway under its own power, during which the engines are throttled up and the pilots are seeking liftoff speed. It also extends some time after the wheels leave the ground. Once the plane is a few hundred feet high, takeoff is over. Airbus leads the pack here for fatalities. This is most likely due to a single catastrophic failure event.";
    const climbText = "Climbing is the longer period of time during which the pilot seeks to gain altitude. Of note is the Ethiopian Airlines crash, where a Boeing 777 crashed during the climbing phase. ";
    const cruiseText = "Cruising is the longest flight phase, during which the plane’s altitude remains fairly constant and engine thrust is tapered off from the climbing phases. Typically speed remains constant as well. Incidents in this phase are much more uncommon. Of note is the Malaysia Airlines accident.";
    const descentText = "Descending begins when the pilot eases the nose of the aircraft downward, to lose altitude once near the destination.";
    const approachText = "Approach begins after descending once the pilot noses the plane upward, to slow the plane and ease into a soft landing.";
    const landingText = "Landing is when the wheels of the plane have touched down but the plane is still in motion.";
    const miscText = "Miscellaneous contains all of the data cases for which the flight phase was blank, null, or the unclear notation “maneuvering”.";


    var standingSvg = d3
        .select(standingGraph)
        .append('svg')
        .attr('width', width)
        .attr('height', height);


    d3.select('#btn-overview').on('click', function() {
        currentPhase = 'OVERVIEW';
        updateText();
        overviewBars();
    });
    d3.select('#btn-standing').on('click', function() {
        currentPhase = 'STANDING';
        updateText();
        updateBars();
    });
    d3.select('#btn-taxi').on('click', function() {
        currentPhase = 'TAXI';
        updateText();
        updateBars();
    });
    d3.select('#btn-takeoff').on('click', function() {
        currentPhase = 'TAKEOFF';
        updateText();
        updateBars();
    });
    d3.select('#btn-climbing').on('click', function() {
        currentPhase = 'CLIMB';
        updateText();
        updateBars();
    });
    d3.select('#btn-cruising').on('click', function() {
        currentPhase = 'CRUISE';
        updateText();
        updateBars();
    });
    d3.select('#btn-descending').on('click', function() {
        currentPhase = 'DESCENT';
        updateText();
        updateBars();
    });
    d3.select('#btn-approaching').on('click', function() {
        currentPhase = 'APPROACH';
        updateText();
        updateBars();
    });
    d3.select('#btn-landing').on('click', function() {
        currentPhase = 'LANDING';
        updateText();
        updateBars();
    });
    d3.select('#btn-misc').on('click', function() {
        currentPhase = 'MISC';
        updateText();
        miscBars();
    });

    function updateText() {
        if (currentPhase == "OVERVIEW") {
            d3.select("#bottomText")
                .text(overviewText)
        }
        if (currentPhase == "STANDING") {
            d3.select("#bottomText")
                .text(standingText)
        }
        if (currentPhase == "TAXI") {
            d3.select("#bottomText")
                .text(taxiText)
        }
        if (currentPhase == "TAKEOFF") {
            d3.select("#bottomText")
                .text(takeoffText)
        }
        if (currentPhase == "CLIMB") {
            d3.select("#bottomText")
                .text(climbText)
        }
        if (currentPhase == "CRUISE") {
            d3.select("#bottomText")
                .text(cruiseText)
        }
        if (currentPhase == "DESCENT") {
            d3.select("#bottomText")
                .text(descentText)
        }
        if (currentPhase == "APPROACH") {
            d3.select("#bottomText")
                .text(approachText)
        }
        if (currentPhase == "LANDING") {
            d3.select("#bottomText")
                .text(landingText)
        }
        if (currentPhase == "MISC") {
            d3.select("#bottomText")
                .text(miscText)
        }
    }

    function updateBars() {
        var fatalMax = d3.max(
            allData.map(function(d) {
                return d3.sum(
                    d.value.map(function(v) {
                        if (v.phase == currentPhase) {
                            return v.fatal;
                        } else {
                            return 0;
                        }
                    })
                );
            })
        );
        var seriousMax = d3.max(
            allData.map(function(d) {
                return d3.sum(
                    d.value.map(function(v) {
                        if (v.phase == currentPhase) {
                            return v.serious;
                        } else {
                            return 0;
                        }
                    })
                );
            })
        );

        yScale.domain([0, d3.max([fatalMax, seriousMax])]);

        standingBars
            .selectAll('.fatalBar')
            .transition()
            .duration(function(d) {
                return 1000;
            })
            .delay(function(d) {
                return Math.random() * 1500;
            })
            .attr('y', function(d) {
                return yScale(
                    d3.sum(
                        d.value.map(function(d) {
                            if (d.phase == currentPhase) {
                                return d.fatal;
                            } else {
                                return 0;
                            }
                        })
                    )
                );
            })
            .attr('height', function(d) {
                return (
                    height -
                    yScale(
                        d3.sum(
                            d.value.map(function(d) {
                                if (d.phase == currentPhase) {
                                    return d.fatal;
                                } else {
                                    return 0;
                                }
                            })
                        )
                    ) -
                    bigBuffer
                );
            });
        standingBars
            .selectAll('.seriousBar')
            .transition()
            .duration(function(d) {
                return 1000;
            })
            .delay(function(d) {
                return Math.random() * 500 + 500;
            })
            .attr('y', function(d) {
                return yScale(
                    d3.sum(
                        d.value.map(function(d) {
                            if (d.phase == currentPhase) {
                                return d.serious;
                            } else {
                                return 0;
                            }
                        })
                    )
                );
            })
            .attr('height', function(d) {
                return (
                    height -
                    yScale(
                        d3.sum(
                            d.value.map(function(d) {
                                if (d.phase == currentPhase) {
                                    return d.serious;
                                } else {
                                    return 0;
                                }
                            })
                        )
                    ) -
                    bigBuffer
                );
            });
        standingSvg.transition();

        var t = d3.transition().duration(1000).delay(500);

        var y = standingSvg.selectAll('.yAxis').data(['dummy']);

        var newY = y
            .enter()
            .append('g')
            .attr('class', 'yAxis')
            .attr('transform', function(d) {
                return 'translate(' + bigBuffer + ', 0)';
            });

        y.merge(newY).transition(t).call(yAxis);

        document.getElementById('graphTitle').innerHTML =
            'Flight Phase: ' + currentPhase;
    }

    function overviewBars() {
        var fatalMax = d3.max(
            allData.map(function(d) {
                return d3.sum(
                    d.value.map(function(v) {
                        return v.fatal;
                    })
                );
            })
        );
        var seriousMax = d3.max(
            allData.map(function(d) {
                return d3.sum(
                    d.value.map(function(v) {
                        return v.serious;
                    })
                );
            })
        );
        yScale.domain([0, d3.max([fatalMax, seriousMax])]);

        standingBars
            .selectAll('.fatalBar')
            .transition()
            .duration(function(d) {
                return 1000;
            })
            .delay(function(d) {
                return Math.random() * 1500;
            })
            .attr('y', function(d) {
                return yScale(
                    d3.sum(
                        d.value.map(function(d) {
                            return d.fatal;
                        })
                    )
                );
            })
            .attr('height', function(d) {
                return (
                    height -
                    yScale(
                        d3.sum(
                            d.value.map(function(d) {
                                return d.fatal;
                            })
                        )
                    ) -
                    bigBuffer
                );
            });
        standingBars
            .selectAll('.seriousBar')
            .transition()
            .duration(function(d) {
                return 1000;
            })
            .delay(function(d) {
                return Math.random() * 500 + 500;
            })
            .attr('y', function(d) {
                return yScale(
                    d3.sum(
                        d.value.map(function(d) {
                            return d.serious;
                        })
                    )
                );
            })
            .attr('height', function(d) {
                return (
                    height -
                    yScale(
                        d3.sum(
                            d.value.map(function(d) {
                                return d.serious;
                            })
                        )
                    ) -
                    bigBuffer
                );
            });

        standingSvg.transition();

        var t = d3.transition().duration(1000).delay(500);

        var y = standingSvg.selectAll('.yAxis').data(['dummy']);

        var newY = y
            .enter()
            .append('g')
            .attr('class', 'yAxis')
            .attr('transform', function(d) {
                return 'translate(' + bigBuffer + ', 0)';
            });

        y.merge(newY).transition(t).call(yAxis);

        document.getElementById('graphTitle').innerHTML =
            'Flight Phase: ' + currentPhase;
    }

    function miscBars() {
        var fatalMax = d3.max(
            allData.map(function(d) {
                return d3.sum(
                    d.value.map(function(v) {
                        if (
                            typeof v !== 'undefined' &&
                            v.phase == '' ||
                            v.phase == 'GO-AROUND' ||
                            v.phase == 'MANEUVERING' ||
                            v.phase == 'OTHER' ||
                            v.phase == 'UNKNOWN'
                        ) {
                            return v.fatal;
                        } else {
                            return 0;
                        }
                    })
                );
            })
        );
        var seriousMax = d3.max(
            allData.map(function(d) {
                return d3.sum(
                    d.value.map(function(v) {
                        if (
                            typeof v !== 'undefined' &&
                            v.phase == '' ||
                            v.phase == 'GO-AROUND' ||
                            v.phase == 'MANEUVERING' ||
                            v.phase == 'OTHER' ||
                            v.phase == 'UNKNOWN'
                        ) {
                            return v.serious;
                        } else {
                            return 0;
                        }
                    })
                );
            })
        );

        yScale.domain([0, d3.max([fatalMax, seriousMax])]);

        standingBars
            .selectAll('.fatalBar')
            .transition()
            .duration(function(d) {
                return 1000;
            })
            .delay(function(d) {
                return Math.random() * 1500;
            })
            .attr('y', function(d) {
                return yScale(
                    d3.sum(
                        d.value.map(function(d) {
                            if (
                                typeof d !== 'undefined' &&
                                d.phase == '' ||
                                d.phase == 'GO-AROUND' ||
                                d.phase == 'MANEUVERING' ||
                                d.phase == 'OTHER' ||
                                d.phase == 'UNKNOWN'
                            ) {
                                return d.fatal;
                            } else {
                                return 0;
                            }
                        })
                    )
                );
            })
            .attr('height', function(d) {
                return (
                    height -
                    yScale(
                        d3.sum(
                            d.value.map(function(v) {
                                if (
                                    typeof v !== 'undefined' &&
                                    v.phase == '' ||
                                    v.phase == 'GO-AROUND' ||
                                    v.phase == 'MANEUVERING' ||
                                    v.phase == 'OTHER' ||
                                    v.phase == 'UNKNOWN'
                                ) {
                                    return v.fatal;
                                } else {
                                    return 0;
                                }
                            })
                        )
                    ) -
                    bigBuffer
                );
            });
        standingBars
            .selectAll('.seriousBar')
            .transition()
            .duration(function(d) {
                return 1000;
            })
            .delay(function(d) {
                return Math.random() * 500 + 500;
            })
            .attr('y', function(d) {
                return yScale(
                    d3.sum(
                        d.value.map(function(v) {
                            if (
                                typeof v !== 'undefined' &&
                                v.phase == '' ||
                                v.phase == 'GO-AROUND' ||
                                v.phase == 'MANEUVERING' ||
                                v.phase == 'OTHER' ||
                                v.phase == 'UNKNOWN'
                            ) {
                                return v.serious;
                            } else {
                                return 0;
                            }
                        })
                    )
                );
            })
            .attr('height', function(d) {
                return (
                    height -
                    yScale(
                        d3.sum(
                            d.value.map(function(v) {
                                if (
                                    typeof v !== 'undefined' &&
                                    v.phase == '' ||
                                    v.phase == 'GO-AROUND' ||
                                    v.phase == 'MANEUVERING' ||
                                    v.phase == 'OTHER' ||
                                    v.phase == 'UNKNOWN'
                                ) {
                                    return v.serious;
                                } else {
                                    return 0;
                                }
                            })
                        )
                    ) -
                    bigBuffer
                );
            });
        standingSvg.transition();

        var t = d3.transition().duration(1000).delay(500);

        var y = standingSvg.selectAll('.yAxis').data(['dummy']);

        var newY = y
            .enter()
            .append('g')
            .attr('class', 'yAxis')
            .attr('transform', function(d) {
                return 'translate(' + bigBuffer + ', 0)';
            });

        y.merge(newY).transition(t).call(yAxis);

        document.getElementById('graphTitle').innerHTML =
            'Flight Phase: ' + currentPhase;
    }

    var standingBars = standingSvg.append('g');

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

            var test = d3
                .nest()
                .key(function(d) {
                    return d.Make;
                })
                .sortKeys(d3.ascending)
                .rollup(function(v) {
                    return v.map(function(d) {
                        return {
                            phase: d.Broad_Phase_of_Flight,
                            fatal: d.Total_Fatal_Injuries,
                            serious: d.Total_Serious_Injuries,
                            uninjured: d.Total_Uninjured,
                        };
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
                test.map(function(d) {
                    return d.key;
                })
            );
            yScale.domain([
                0,
                d3.max(
                    test
                    .filter(function(f) {
                        return f.key != '';
                    })
                    .map(function(d) {
                        return d3.max([
                            d3.sum(
                                d.value.map(function(d) {
                                    return d.fatal;
                                })
                            ),
                            d3.sum(
                                d.value.map(function(d) {
                                    return d.serious;
                                })
                            ),
                        ]);
                    })
                ),
            ]);

            buildChart(standingBars);

            function buildChart(bars) {
                bars
                    .append('g')
                    .attr('class', 'xAxis')
                    .attr('transform', function(d) {
                        return 'translate(' + bigBuffer + ', ' + (height - bigBuffer) + ')';
                    })
                    .call(xAxis);
                bars
                    .append('g')
                    .attr('class', 'yAxis')
                    .attr('transform', function(d) {
                        return 'translate(' + bigBuffer + ', 0)';
                    })
                    .call(yAxis);
                bars
                    .append('g')
                    .selectAll('.fatalBar')
                    .data(test)
                    .enter()
                    .append('rect')
                    .attr('class', 'fatalBar')
                    .attr('x', function(d) {
                        return bigBuffer + xScale(d.key) + xScale.bandwidth() * 0.25;
                    })
                    .attr('y', function(d) {
                        return yScale(
                            d3.sum(
                                d.value.map(function(d) {
                                    return d.fatal;
                                })
                            )
                        );
                    })
                    .attr('width', xScale.bandwidth() * 0.2)
                    .attr('height', function(d) {
                        return (
                            height -
                            yScale(
                                d3.sum(
                                    d.value.map(function(d) {
                                        return d.fatal;
                                    })
                                )
                            ) -
                            bigBuffer
                        );
                    });
                bars
                    .append('g')
                    .selectAll('.seriousBar')
                    .data(test)
                    .enter()
                    .append('rect')
                    .attr('class', 'seriousBar')
                    .attr('x', function(d) {
                        return bigBuffer + xScale(d.key) + xScale.bandwidth() * 0.55;
                    })
                    .attr('y', function(d) {
                        return yScale(
                            d3.sum(
                                d.value.map(function(d) {
                                    return d.serious;
                                })
                            )
                        );
                    })
                    .attr('width', xScale.bandwidth() * 0.2)
                    .attr('height', function(d) {
                        return (
                            height -
                            yScale(
                                d3.sum(
                                    d.value.map(function(d) {
                                        return d.serious;
                                    })
                                )
                            ) -
                            bigBuffer
                        );
                    });
            }
        }
    );
}