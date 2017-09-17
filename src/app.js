'use strict'

let loadData = require('./loadData.js'),
	wordPicker = require('./wordPicker.js')

exports.runSimulation = function(numberOfRounds, probabilityIncrease) {
	loadData.getData('../data/words.txt').then((data) => {
		let t = process.hrtime()
		let tally = wordPicker.simulate(data, numberOfRounds, probabilityIncrease)
		console.log(JSON.stringify(tally, null, '  '))
		t = process.hrtime(t)
		console.log('Total elapsed time: %d s', t[0] + t[1]/100000000)
	})
}
