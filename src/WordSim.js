'use strict'

module.exports =

class WordSim {
    constructor(dictionary, probabilityIncrease) {
        this.tally = {
            rounds: 0,
            scores: [],
            words: []
        }
        this.dictionary = dictionary
        this.probabilityIncrease = probabilityIncrease
        this.probabilities = Array(dictionary.length).fill(1)
    }
    
    pickWords(numberOfRounds = 1) {
        let indexes = []
        for (let round = 0; round < numberOfRounds; round++) {
            this.tally.rounds++
            let wordIndex = this._pickWord(this.probabilities),
                word = this.dictionary[wordIndex]
            let tallyWordIndex = this.tally.words.indexOf(word)
            if (tallyWordIndex !== -1 && this.tally.words.length > 0) {
                this.tally.scores[tallyWordIndex].counts++
                indexes.push(tallyWordIndex)
            }
            else {
                let obj = {
                        word,
                        counts: 1
                    }
                this.tally.scores.push(obj)
                this.tally.words.push(word)
                indexes.push(this.tally.scores.length - 1)          
            }
            this.probabilities[wordIndex] += this.probabilityIncrease
        }
        this.tally.scores.sort(function (a, b) {
            //console.log(Object.values(a)[0].counter)
            return b.counts - a.counts
        })
        return indexes
    }

    _pickWord(probabilities) {
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
}