'use strict'

import '../css/style.css'
let d3 = require('d3')

let app = require('./app.js')

let width = window.innerWidth,
    height = window.innerHeight

let numberOfRounds = 1000,
	probabilityIncrease = 100000

let controlBar = d3.select('body').append('div')
    .attr('class', 'svg-container')
    .style('top', '10px')
    .style('width', width + "px")
	.style('height', "50px")
    .style('background-color', 'grey')

controlBar.append('button')
    .text('Start')
    .on('click', app.runSimulation(numberOfRounds, probabilityIncrease))

let graphs = d3.select('body').append('div')
    .attr('class', 'svg-container')
    .style('width', width + "px")
	.style('height', height + "px")
    .style('background-color', 'black')


