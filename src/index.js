'use strict'

import '../css/style.css'
let d3 = require('d3')

let spaceBetweenWords = 30,
    numberOfRounds = 10,
    maxRank = 30,
    sizeOfCircle = 5,
	probabilityIncrease = 370000,
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
        .attr('stroke-width', 0.5)

    let parettoDist = function(rank) {
        let maxRef = 200,
            minRef = 400,
            results = [maxRef]
        
        for (let i = 1; i < rank; i++) {
            results.push(results[i-1] + (minRef - results[i-1])/2)
        }
        return results
    }
        
        //[200, 300, 350, 375, 387.5, 393.75, 396.875, 398.4375, 399.21875, 399.609375, 399.8046875, 399.9023438, 399.9511719, 399.9755859, 399.987793, 399.9938965, 399.9969482]

    let paretto = parettoDist(maxRank)

    d3.select('svg').selectAll('.paretto').data(paretto).enter()
        .append('line')
        .attr('class', 'paretto')
        .attr('x1', function(d,i) {
            return 100 + i * spaceBetweenWords
        })
        .attr('y1', function(d) {
            return d
        })
        .attr('x2', function(d, i) {
            return 120 + i * spaceBetweenWords
        })
        .attr('y2', function(d) {
            return d
        })
        .attr('stroke', 'white')
        .attr('stroke-width', '1')

    let bars = d3.select('svg').selectAll('circle')


    let controlBar = d3.select('body').append('div')
        .attr('class', 'controlBar')
        .style('top', '10px')
        .style('width', width + "px")
        .style('height', "100px")
        .style('background-color', 'grey')

    let form1 = controlBar.append('form')
        .attr('name', 'numOfRoundsForm')
        .attr('onSubmit', 'return false')
        
    form1.append('input')
        .attr('type', 'text')
        .attr('id', 'numberOfRounds')
        .attr('placeholder', "number of rounds per turn: default = 10")
        .on('change', function() {
            numberOfRounds = this.value
            controlBar.select('#rounds')
                .text('Number of rounds: ' + numberOfRounds)
        })

    form1.append('input')
        .attr('type', 'text')
        .attr('id', 'probabilityIncrease')
        .attr('placeholder', "increase prob")
        .on('change', function() {
            probabilityIncrease = Math.abs(this.value)
            Simulation.restart(data, probabilityIncrease)
            controlBar.select('#probs')
                .text('Probability increase: ' + probabilityIncrease)
        })

    controlBar.append('div')
        .attr('id', 'status')
        .text('Status: ready')
    
    controlBar.append('div')
        .attr('id', 'rounds')
        .text('Number of rounds:' + numberOfRounds)

    controlBar.append('div')
        .attr('id', 'probs')
        .text('Probability increase: ' + probabilityIncrease)

    controlBar.append('button')
        .text('Play')
        .on('click', function() {
            console.log('start')
            controlBar.select('#status')
                .text('working...')
            let index = Simulation.pickWords(numberOfRounds)
            //console.log(index + ' -- ' + Simulation.tally.words[index[index.length - 1]] + ' -- ' + JSON.stringify(Simulation.tally.scores[index[index.length - 1]]))

            updatePlot()

                    //graphs.text(JSON.stringify(Simulation.tally.scores))
        })


    function updatePlot() {

        let scores = []
        Simulation.tally.scores.forEach((item) => {
            scores.push(item.counts)
        })

        controlBar.select('.status')
            .text('Status: ' + Simulation.tally.rounds + ' rounds.')

        let maxCounts = Math.max(...scores)

        console.log(maxCounts)
        let y = d3.scaleLinear()
            .domain([0, maxCounts])
            .range([400, 200]);

        console.log(JSON.stringify(Simulation.tally.scores.slice(0,maxRank)))
        let circleSelect = d3.select('svg').selectAll('circle')
            .data(Simulation.tally.scores.slice(0,maxRank), function(d) {return d.word})
        
        let textSelect = d3.select('svg').selectAll('text')
            .data(Simulation.tally.scores.slice(0,maxRank), function(d) {return d.word})

        let t = d3.transition().duration(1500)
        
        d3.selectAll('text').transition(t)
            .attr('fill', 'white')

        circleSelect.enter()
            .append('circle')
            .attr('class', 'item')
            .attr('cx', function(d, i) {
                return 110 + i * spaceBetweenWords
            })
            .attr('cy', function(d, i) {
                return y(d.counts)
            })
            .attr('r', sizeOfCircle)
            .attr('fill', 'white')
        
        circleSelect.exit().remove()
        
        textSelect.enter()
            .append('text')
            .attr('class', 'item')
            .attr('x', function(d, i) {
                return 110 + i * spaceBetweenWords
            })
            .attr('y', 420)
            .attr('transform', function(d, i) {
                return 'rotate(45, ' + (110 + i * spaceBetweenWords) + ', 420)'
            })
            //.attr('text-anchor', 'end')
            .attr('fill', 'red')
            .text(function(d) {
                return d.word
            })
        textSelect.exit().remove()

        d3.selectAll('circle').sort(function(a, b) {
            return b.counts - a.counts
        })

        d3.selectAll('text').sort(function(a, b) {
            return b.counts - a.counts
        })   

        d3.selectAll('circle').transition(t)
            .attr('cx', function(d, i) {
                return 110 + i * spaceBetweenWords
            })
            .attr('cy', function(d, i) {
                return y(d.counts)
            })

        d3.selectAll('text').transition(t)
            .attr('x', function(d, i) {
                return 110 + i * spaceBetweenWords
            })
            .attr('transform', function(d, i) {
                return 'rotate(45, ' + (110 + i * spaceBetweenWords) + ', 420)'
            })

    }
})
