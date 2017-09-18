'use strict'

let request = require('request'),
    fs = require('fs')

exports.getDataServer = function(fileName, type) {
	return new Promise(function(res, rej) {
		fs.readFile(fileName, type, (err, data) => {
			if (err) 
				rej(err)
            let words = data.toString('utf8').split('\n')
			res(words)
		})
	})
}

exports.getDataWeb = function(addr) {
    return new Promise(function(res, rej) {
        request.get(addr, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                let words = body.toString('utf8').split('\n')
                res(words)
            }
        } )
    })
}