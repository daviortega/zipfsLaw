'use strict'

import '../css/style.css'
let d3 = require('d3')

let numberOfRounds = 10,
	probabilityIncrease = 100000,
    dictionaryUrl = 'https://raw.githubusercontent.com/daviortega/zipfsLaw/master/data/words.txt'

let wordSim = require('./wordSim'),
    loadData = require('./loadData.js')

let width = window.innerWidth,
    height = window.innerHeight


let graphs = d3.select('body').append('div')
    .attr('class', 'svg-container')
    .style('width', width + "px")
    .style('height', height + "px")
    .style('top', '100px')
    .style('background-color', 'black')
    .style('line-height', height + 'px')
    .style('color', 'white')
    
let graphText = d3.select('.svg-container').append('span')
    .text('Loading dictionary...')

loadData.getDataWeb(dictionaryUrl).then((data) => {
	let Simulation = new wordSim(data, probabilityIncrease)
    console.log('data loaded')
    graphText.text('')

    let plot = d3.select('.svg-container').append('svg')
        .attr("width", width)
        .attr("height", height);

    plot.append('line')
        .attr('x1', '100px')
        .attr('y1', '400px')
        .attr('x2', width - 200)
        .attr('y2', '400px')
        .attr('stroke', 'white')
        .attr('stroke-width', 1)

    let bars = d3.select('svg').selectAll('circle')


    let controlBar = d3.select('body').append('div')
        .attr('class', 'controlBar')
        .style('top', '10px')
        .style('width', width + "px")
        .style('height', "50px")
        .style('background-color', 'grey')

    controlBar.append('button')
        .text('Start')
        .on('click', function() {
            console.log('start')
            controlBar.select('.status')
                .text('working...')
            let index = Simulation.pickWords(10)
            //console.log(index + ' -- ' + Simulation.tally.words[index[index.length - 1]] + ' -- ' + JSON.stringify(Simulation.tally.scores[index[index.length - 1]]))

            updatePlot()

                    //graphs.text(JSON.stringify(Simulation.tally.scores))
        })

    controlBar.append('div')
        .attr('class', 'status')
        .text('Status: Ready')
    
    function updatePlot() {

        let scores = []
        Simulation.tally.scores.forEach((item) => {
            scores.push(item.counts)
        })

        controlBar.select('.status')
            .text('Status: ' + Simulation.tally.rounds + ' rounds.')

        let maxCounts = Math.max(...scores)

        let y = d3.scaleLinear()
            .domain([0, maxCounts])
            .range([400, 200]);

        console.log(JSON.stringify(Simulation.tally.scores.slice(0,10)))
        let circleSelect = d3.select('svg').selectAll('circle')
            .data(Simulation.tally.scores.slice(0,10))
        
        let textSelect = d3.select('svg').selectAll('text')
            .data(Simulation.tally.scores.slice(0,10))

        let t = d3.transition().duration(1500)

        circleSelect.transition(t)
            .attr('cx', function(d, i) {
                return 110 + i * 100
            })
            .attr('cy', function(d, i) {
                return y(d.counts)
            })

        textSelect.transition(t)
            .attr('x', function(d, i) {
                return 110 + i * 100
            })
        
        circleSelect.enter()
            .append('circle')
            .attr('class', 'item')
            .attr('cx', function(d, i) {
                return 110 + i * 100
            })
            .attr('cy', function(d, i) {
                return y(d.counts)
            })
            .attr('r', 10)
            .attr('fill', 'red')
        
        circleSelect.exit().remove()
        
        textSelect.enter()
            .append('text')
            .attr('class', 'item')
            .attr('x', function(d, i) {
                return 110 + i * 100
            })
            .attr('y', 410)
            //.attr('transform', 'rotate(90)')
            .attr('text-anchor', 'end')
            .attr('fill', 'white')
            .text(function(d) {
                return d.word
            })
        textSelect.exit().remove()
    }
})