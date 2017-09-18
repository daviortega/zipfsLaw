'use strict'

let loadData = require('./loadData.js'),
	wordPicker = require('./wordPicker.js')

let dictionaryUrl = 'https://raw.githubusercontent.com/daviortega/zipfsLaw/master/data/words.txt'

exports.runSimulation = function(numberOfRounds, probabilityIncrease) {
	console.log('loading data')
	loadData.getDataWeb(dictionaryUrl).then((data) => {
		console.log('data loaded')
		let tally = wordPicker.simulate(data, numberOfRounds, probabilityIncrease)
		//console.log(JSON.stringify(tally, null, '  '))
	})
}
