'use strict'

let fs = require('fs')

exports.getData = function(fileName, type) {
	return new Promise(function(res, rej) {
		fs.readFile(fileName, type, (err, data) => {
			if (err) 
				rej(err)
            let words = data.toString('utf8').split('\n')
			res(words)
		})
	})
}
