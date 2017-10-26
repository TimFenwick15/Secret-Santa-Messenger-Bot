'use strict'

const convertExcludesToIncludes = obj => {
  const peopleIncludes = {}
  for (let key in obj) {
    peopleIncludes[key] = Object.keys(obj).filter(x => !obj[key].includes(x))
  }
  return peopleIncludes
}

const addArrayLengthToKey = obj => {
  const peopleWithNewKey = {}
  for (let key in obj) {
    let newKey
    if (key.indexOf('-') === - 1)
      newKey = key
    else
      newKey = key.split('-')[0]
    peopleWithNewKey[`${newKey}-${obj[key].length}`] = obj[key]
  }
  return peopleWithNewKey
}

const sortPeopleByKeyNumber = obj => {
  const sortedPeople = {};
  Object.keys(obj)
    .sort((a, b) => Number(a.split('-')[1]) > Number(b.split('-')[1]) ? 1 : -1)
    .forEach(key => sortedPeople[key] = obj[key])
  return sortedPeople 
}

const makePairings = (obj, randomFunction = obj => obj[Math.floor(Math.random() * obj.length)]) => {
  const pairings = {}
  while (Object.keys(obj).length) {
    obj = sortPeopleByKeyNumber(obj)
    const buyerKey = Object.keys(obj)[0]
    const buyerName = buyerKey.split('-')[0]
    const receiverName = randomFunction(obj[buyerKey])
    const receiverKey = Object.keys(obj).find(x => x.indexOf(receiverName) !== - 1)

    // If a buys for b, we don't want b to buy for a
    if (receiverKey)
      obj[receiverKey] = obj[receiverKey].filter(x => x !== buyerName)

    for (let key in obj)
      obj[key] = obj[key].filter(x => x !== receiverName)

    delete obj[buyerKey]
    obj = addArrayLengthToKey(obj)
      
    if (receiverName)
      pairings[buyerName] = receiverName
    else {
      console.error('Error: no solution exists for this data')
      return null
    }
  }
  return pairings
}

const sendMessages = (peopleWithEmails, peopleWithRecipients) => {
  try {
    // for each peopleWithRecipients, write the result to a text file. Place in results dir
    const fs = require('fs')
    const resultsDirectory = './results'
    if (!fs.existsSync(resultsDirectory))
      fs.mkdirSync(resultsDirectory)
    else {
      const files = fs.readdirSync(resultsDirectory)
      files.forEach(x => fs.unlinkSync(`${resultsDirectory}/${x}`))
    }
    for (let key in peopleWithRecipients)
      fs.writeFileSync(`${resultsDirectory}/${key}.txt`, `${key} is buying for ${peopleWithRecipients[key]}`)

    console.log(`Results written to ${resultsDirectory}`)
    return true
  }
  catch (e) {
    return false
  }
}

module.exports = {
  convertExcludesToIncludes,
  addArrayLengthToKey,
  sortPeopleByKeyNumber,
  makePairings,
  sendMessages
}
