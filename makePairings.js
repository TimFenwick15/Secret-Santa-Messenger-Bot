const santa = require('./secretSantaPairings')
const data = require('./data')
let people = {}
for (let key in data)
  people[key] = data[key].excludes

const peopleWithIncludesLists = santa.convertExcludesToIncludes(people)
const peopleWithIncludesLengthKeys = santa.addArrayLengthToKey(peopleWithIncludesLists)
const pairings = santa.makePairings(peopleWithIncludesLengthKeys)
if (!santa.sendMessages(data, pairings))
  console.error('Email sending failed :(')
