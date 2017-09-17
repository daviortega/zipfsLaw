'use strict'

exports.simulate = function(data, numberOfRounds, probabilityIncrease) {
	let tally = {
        rounds: 0,
        scores: [],
        words: []
    }
    
    let probabilities = Array(data.length).fill(1)
    
    for (let round = 0; round < numberOfRounds; round++) {
        //console.log('round: ' + round)
        //let t = process.hrtime()
		tally.rounds = round + 1
		let wordIndex = pickWord(probabilities),
            word = data[wordIndex]

        let tallyWordIndex = tally.words.indexOf(word)
        if (tallyWordIndex !== -1 && tally.words.length > 0) {
            tally.scores[tallyWordIndex][word].counter++
        }
        else {
            tally.words.push(word)
            let obj = {}
            obj[word] = {
                    counter: 1,
                    index: wordIndex
                }
            tally.scores.push(obj)           
        }
        probabilities[wordIndex] += probabilityIncrease
    }
    tally.scores.sort(function (a, b) {
        console.log(Object.values(a)[0].counter)
        return Object.values(b)[0].counter - Object.values(a)[0].counter
    })
    return tally
}

function pickWord(probabilities) {
    //console.log('--> normProbFactor')
    //let t = process.hrtime()

    let normProbFactor = 0
    for (let i = 0; i < probabilities.length; i++)
        normProbFactor += probabilities[i]

    //t = process.hrtime(t)
    //console.log('--->Elapsed time: %d s %d ns', t[0], t[1]/10000)
    //console.log('--> normProb')
    //t = process.hrtime()
    let normProb = []
    for (let i = 0; i < probabilities.length; i++)
        normProb.push(probabilities[i]/normProbFactor)
/*    let normProb = probabilities.map(function(x) { 
        return x / normProbFactor
    })*/
    //t = process.hrtime(t)
    //console.log('--->Elapsed time: %d s %d ns', t[0], t[1]/10000)
    //console.log('--> cumProb')
    //t = process.hrtime()
    let cumProb = normProb

    for (let i = 1; i < normProb.length; i++)
        cumProb[i] = cumProb[i-1] + normProb[i]
    
    //t = process.hrtime(t)
    //console.log('--->Elapsed time: %d s %d ns', t[0], t[1]/10000)
    //console.log('--> picking')
    //t = process.hrtime()
    let randomNumber = Math.random()
/*    //console.log(randomNumber)
    //console.log(cumProb[cumProb.length - 1])
    //console.log(cumProb.length)*/

    let choice = -1
    for (let i = 0; i < cumProb.length; i++) {
        ////console.log(cumProb[i])
        if ( randomNumber < cumProb[i]) {
            choice = i
            break
        }
    }
    //t = process.hrtime(t)
    //console.log('--->Elapsed time: %d s %d ns', t[0], t[1]/10000)
    //console.log(choice)
    return choice
}
 